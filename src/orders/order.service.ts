import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/orders-related/order.entity';
import { OrderItem } from '../entities/orders-related/order-item.entity';
import { OrderStatusHistory } from '../entities/orders-related/order-status.entity';
import { ShippingDetails } from '../entities/orders-related/shipping-details.entity';
import { Payments } from '../entities/orders-related/payments.entity';
import { Product } from '../entities/products-related/product.entity';
import { User } from '../entities/users-related/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { plainToClass, classToPlain } from 'class-transformer';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import midtransClient from 'midtrans-client';
import { Coupons } from 'src/entities/orders-related/coupon.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private readonly snap;

  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory) private readonly orderStatusHistoryRepository: Repository<OrderStatusHistory>,
    @InjectRepository(ShippingDetails) private readonly shippingDetailsRepository: Repository<ShippingDetails>,
    @InjectRepository(Payments) private readonly paymentsRepository: Repository<Payments>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Coupons) private readonly couponsRepository: Repository<Coupons>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
  }

  async findAll(): Promise<Order[]> {
    const cacheKey = 'orders';
    const cachedOrders = await this.cacheManager.get<Order[]>(cacheKey);

    if (cachedOrders) {
      return plainToClass(Order, cachedOrders);
    }

    const orders = await this.orderRepository.find({
      relations: ['items', 'items.product', 'statusHistory', 'shippingDetails', 'payments'],
    });
    await this.cacheManager.set(cacheKey, classToPlain(orders), 1000000);
    return orders;
  }

  async findOne(id: string): Promise<Order> {
    const cacheKey = `order_${id}`;
    const cachedOrder = await this.cacheManager.get<Order>(cacheKey);

    if (cachedOrder) {
      return plainToClass(Order, cachedOrder);
    }

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user', 'statusHistory', 'shippingDetails', 'payments'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    await this.cacheManager.set(cacheKey, classToPlain(order), 10000);
    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<any> {
    const { userId, items, statusHistory, shippingDetails, couponsId } = createOrderDto;
  
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['details'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const orderItems = await Promise.all(items.map(async item => {
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Product not found: ${item.productId}`);
      }
      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
      });
      return orderItem;
    }));
  
    const total = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    // let discounted = 0;
    // let coupon: Coupons | null = null;
  
    // if (couponsId) {
    //   coupon = await this.couponsRepository.findOne({ where: { id: couponsId } });
    //   if (coupon) {
    //     discounted = (total * coupon.discount) / 100;
    //     console.log("Coupon found");
    //   } else {
    //     console.log("Coupon not found");
    //     coupon = null;
    //   }
    // }
  
    const orderStatusHistories = statusHistory.map(status => {
      return this.orderStatusHistoryRepository.create({
        status: status.status,
        updated_at: new Date(status.updated_at),
      });
    });
  
    const orderShippingDetails = shippingDetails.map(details => {
      return this.shippingDetailsRepository.create({
        address: details.address,
        city: details.city,
        postalCode: details.postalCode,
        country: details.country,
      });
    });
  
    const orderPayments = this.paymentsRepository.create({
      amount: total,
      status: 'pending',
      paid_at: new Date(),
    });
  
    const order = this.orderRepository.create({
      user,
      items: orderItems,
      statusHistory: orderStatusHistories,
      shippingDetails: orderShippingDetails,
      payments: [orderPayments],
      total: total,
    });
  
    const newOrder = await this.orderRepository.save(order);
    try {
      const userDetails = user.details[0];
      console.log('User Details:', userDetails);
  
      const transactionPayload = {
        transaction_details: {
          order_id: newOrder.id,
          gross_amount: total,
        },
        customer_details: {
          email: user.email,
          first_name: user.details?.[0]?.firstName,
          last_name: user.details?.[0]?.lastName,
          phone: user.details?.[0]?.phone,
          shipping_address: {
            first_name: user.details?.[0]?.firstName,
            last_name: user.details?.[0]?.lastName,
            phone: user.details?.[0]?.phone,
            email: user.email,
            address: orderShippingDetails?.[0]?.address,
            city: orderShippingDetails?.[0]?.city,
            postal_code: orderShippingDetails?.[0]?.postalCode,
            country_code: user.details?.[0]?.country
          }
        },
        item_details: orderItems.map(item => ({
          id: item.product.id,
          price: item.product.price,
          quantity: item.quantity,
          name: item.product.name,
        })),
      };
  
      console.log('Transaction Payload:', transactionPayload);
  
      const transaction = await this.snap.createTransaction(transactionPayload);
      newOrder.snapToken = transaction.token;
      await this.orderRepository.save(newOrder);
      orderPayments.link_payment = transaction.redirect_url;
      await this.paymentsRepository.save(orderPayments);
  
      await this.cacheManager.del('orders');
      this.logger.log('Cleared allOrders cache');
  
      return {
        order: await this.orderRepository.findOne({
          where: { id: newOrder.id },
          relations: ['items', 'items.product', 'statusHistory', 'shippingDetails', 'payments'],
        }),
        paymentUrl: transaction.redirect_url,
        payload: transactionPayload
      };
    } catch (error) {
      this.logger.error('Midtrans transaction creation failed:', error);
      throw new Error('Midtrans transaction creation failed');
    }
  }
  

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { userId, items, statusHistory, shippingDetails, couponsId } = updateOrderDto;

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'statusHistory', 'shippingDetails', 'payments'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      order.user = user;
    }

    if (items) {
      await this.orderItemRepository.delete({ order });
      const orderItems = await Promise.all(items.map(async item => {
        const product = await this.productRepository.findOne({ where: { id: item.productId } });
        if (!product) {
          throw new NotFoundException(`Product not found: ${item.productId}`);
        }
        const orderItem = this.orderItemRepository.create({
          product,
          quantity: item.quantity,
          order,
        });
        await this.orderItemRepository.save(orderItem);
        return orderItem;
      }));
      order.items = orderItems;
    }

    if (statusHistory) {
      await this.orderStatusHistoryRepository.delete({ order });
      const orderStatusHistories = statusHistory.map(status => {
        return this.orderStatusHistoryRepository.create({
          status: status.status,
          updated_at: new Date(status.updated_at),
          order,
        });
      });
      order.statusHistory = orderStatusHistories;
      for (const orderStatusHistory of orderStatusHistories) {
        await this.orderStatusHistoryRepository.save(orderStatusHistory);
      }
    }

    if (shippingDetails) {
      await this.shippingDetailsRepository.delete({ order });
      const orderShippingDetails = shippingDetails.map(details => {
        return this.shippingDetailsRepository.create({
          address: details.address,
          city: details.city,
          postalCode: details.postalCode,
          country: details.country,
          order,
        });
      });
      order.shippingDetails = orderShippingDetails;
      for (const shippingDetail of orderShippingDetails) {
        await this.shippingDetailsRepository.save(shippingDetail);
      }
    }

    if (items) {
      order.total = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }

    await this.orderRepository.save(order);
    await this.cacheManager.del(`order_${id}`);
    await this.cacheManager.del('orders');
    return order;
  }

  async remove(id: string): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id }, relations: ['items', 'statusHistory', 'shippingDetails', 'payments'] });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    await this.orderItemRepository.delete({ order });
    await this.orderStatusHistoryRepository.delete({ order });
    await this.shippingDetailsRepository.delete({ order });
    await this.paymentsRepository.delete({ order });

    await this.orderRepository.delete(id);
    this.logger.log(`Order removed with ID: ${id}`);
    await this.cacheManager.del('orders');
    await this.cacheManager.del(`order_${id}`);
  }
}
