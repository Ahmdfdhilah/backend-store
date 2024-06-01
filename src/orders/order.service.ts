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
import { PaymentMethods } from '../entities/orders-related/payment-methods.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { plainToClass, classToPlain } from 'class-transformer';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory) private readonly orderStatusHistoryRepository: Repository<OrderStatusHistory>,
    @InjectRepository(ShippingDetails) private readonly shippingDetailsRepository: Repository<ShippingDetails>,
    @InjectRepository(Payments) private readonly paymentsRepository: Repository<Payments>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(PaymentMethods) private readonly paymentMethodsRepository: Repository<PaymentMethods>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<Order[]> {
    const cacheKey = 'orders';
    const cachedOrders = await this.cacheManager.get<Order[]>(cacheKey);

    if (cachedOrders) {
      return plainToClass(Order, cachedOrders);
    }

    const orders = await this.orderRepository.find({
      relations: ['items', 'items.product', 'statusHistory', 'shippingDetails', 'payments', 'payments.method'],
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
      relations: ['items', 'items.product', 'user', 'statusHistory', 'shippingDetails', 'payments', 'payments.method'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    await this.cacheManager.set(cacheKey, classToPlain(order), 10000);
    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<any> {
    const { userId, items, statusHistory, shippingDetails, payments } = createOrderDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
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

    const orderPayments = await Promise.all(payments.map(async payment => {
      const paymentMethod = await this.paymentMethodsRepository.findOne({ where: { id: payment.methodId } });
      if (!paymentMethod) {
        throw new NotFoundException(`Payment method not found: ${payment.methodId}`);
      }
      return this.paymentsRepository.create({
        amount: payment.amount,
        method: paymentMethod,
        status: payment.status,
        paid_at: new Date(payment.paid_at),
      });
    }));

    const order = this.orderRepository.create({
      user,
      items: orderItems,
      statusHistory: orderStatusHistories,
      shippingDetails: orderShippingDetails,
      payments: orderPayments,
      total,
    });

    const newOrder = await this.orderRepository.save(order);

    await this.cacheManager.del('orders');
    this.logger.log('Cleared allOrders cache');
    
    const res = await this.orderRepository.findOne({
      where: { id: newOrder.id },
      relations: ['items', 'items.product', 'statusHistory', 'shippingDetails', 'payments', 'payments.method'],
    });

    return res;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { userId, items, statusHistory, shippingDetails, payments } = updateOrderDto;

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

    if (payments) {
      await this.paymentsRepository.delete({ order });
      const orderPayments = await Promise.all(payments.map(async payment => {
        const paymentMethod = await this.paymentMethodsRepository.findOne({ where: { id: payment.methodId } });
        if (!paymentMethod) {
          throw new NotFoundException(`Payment method not found: ${payment.methodId}`);
        }
        return this.paymentsRepository.create({
          amount: payment.amount,
          method: paymentMethod,
          status: payment.status,
          paid_at: new Date(payment.paid_at),
          order,
        });
      }));
      order.payments = orderPayments;
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
