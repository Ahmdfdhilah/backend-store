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
import { CreateOrderDto, CreatePriceShippingDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { plainToClass, classToPlain } from 'class-transformer';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import midtransClient from 'midtrans-client';
import axios
 from 'axios';
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
    const { userId, items, statusHistory, shippingDetails, shippingCost } = createOrderDto;
  
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const order = new Order();
    order.user = user;
    order.items = [];
    order.statusHistory = [];
    order.shippingDetails = null;
    order.total = 0;
  
    const savedOrder = await this.orderRepository.save(order);
  
    const orderItems = await Promise.all(items.map(async item => {
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Product not found: ${item.productId}`);
      }
      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
        order: savedOrder
      });
      return await this.orderItemRepository.save(orderItem);
    }));
  
    savedOrder.items = orderItems;
  
    console.log(shippingCost);
    console.log(typeof(shippingCost));
  
    const total = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)+ shippingCost;
  
    const orderStatusHistories = statusHistory.map(status => {
      const orderStatus = this.orderStatusHistoryRepository.create({
        status: status.status,
        updated_at: new Date(status.updated_at),
        order: savedOrder
      });
      return orderStatus;
    });
  
    await this.orderStatusHistoryRepository.save(orderStatusHistories);
    savedOrder.statusHistory = orderStatusHistories;
  
    const orderShippingDetails = this.shippingDetailsRepository.create({
      address: shippingDetails.address,
      city: shippingDetails.city,
      postalCode: shippingDetails.postalCode,
      country: shippingDetails.country,
      order: savedOrder
    });
  
    await this.shippingDetailsRepository.save(orderShippingDetails);
    savedOrder.shippingDetails = orderShippingDetails;
  
    
    savedOrder.total = total;
  
    await this.orderRepository.save(savedOrder);

    const orderPayments = this.paymentsRepository.create({
      amount: total,
      status: 'pending',
      paid_at: new Date(),
      order: savedOrder
    });
  
    await this.paymentsRepository.save(orderPayments);
    savedOrder.payments = [orderPayments];
  
    try {
      const transactionPayload = {
        transaction_details: {
          order_id: savedOrder.id,
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
            address: orderShippingDetails.address,
            city: orderShippingDetails.city,
            postal_code: orderShippingDetails.postalCode,
            country_code: user.addresses?.[0]?.country
          }
        },
        item_details: [
          {
            price: shippingCost,  
            quantity: 1,
            name: "Biaya Pengiriman"
          },
          ...orderItems.map(item => ({
            id: item.product.id,
            price: item.product.price,
            quantity: item.quantity,
            name: item.product.name,
          }))
        ]
      }
  
      const transaction = await this.snap.createTransaction(transactionPayload);
      console.log(transaction);
      
      savedOrder.snapToken = transaction.token;
      await this.orderRepository.save(savedOrder);
      orderPayments.link_payment = transaction.redirect_url;
      await this.paymentsRepository.save(orderPayments);
  
      await this.cacheManager.del('orders');
      this.logger.log('Cleared allOrders cache');
  
      return {
        order: await this.orderRepository.findOne({
          where: { id: savedOrder.id },
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
      const orderShippingDetails = this.shippingDetailsRepository.create({
        address: shippingDetails.address,
        city: shippingDetails.city,
        postalCode: shippingDetails.postalCode,
        country: shippingDetails.country,
        order,
      });
      await this.shippingDetailsRepository.save(orderShippingDetails);
      order.shippingDetails = orderShippingDetails;
    }

    await this.orderRepository.save(order);
    await this.cacheManager.del('orders');
    this.logger.log(`Cleared cache for order ${id}`);
    return order;
  }

  async remove(id: string): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id }, relations: ['items', 'statusHistory', 'shippingDetails', 'payments'] });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    console.log(order)
 
    await this.orderItemRepository.delete({ order }); 
    await this.orderStatusHistoryRepository.delete({ order }); 
    await this.paymentsRepository.delete({ order }); 

    if (order.shippingDetails) {
      order.shippingDetails = null;
      await this.orderRepository.save(order);
    }

    if (order.shippingDetails && order.shippingDetails.id) {
      await this.shippingDetailsRepository.delete(order.shippingDetails.id);
    }

    await this.orderRepository.delete(id);
    this.logger.log(`Order removed with ID: ${id}`);
    await this.cacheManager.del('orders');
    await this.cacheManager.del(`order_${id}`);
  }

  async getStatus(orderId: string): Promise<any> {
    const url = `https://api.sandbox.midtrans.com/v2/${orderId}/status`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(process.env.MIDTRANS_SERVER_KEY).toString('base64')}`,
    };
  
    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      this.logger.error('Error getting Midtrans status:', error);
      throw new Error('Failed to get Midtrans status');
    }
  }

  async getProvince(): Promise<any>{
    const url = `https://api.rajaongkir.com/starter/province/`;
    const headers =  {
      key: '1306e862fb71c2c95e6f40cb6400cbb4',
    }
    try{
      const response = await axios.get(url, {headers})
      return response.data.rajaongkir.results;
    }
    catch(error){
      throw new Error('failed to get province')
    }
  }

  async getProvinceById(id: string): Promise<any>{
    const url = `https://api.rajaongkir.com/starter/province?id=${id}`;
    const headers =  {
      key: '1306e862fb71c2c95e6f40cb6400cbb4',
    }
    try{
      const response = await axios.get(url, {headers})
      return response.data.rajaongkir.results;
    }
    catch(error){
      throw new Error('failed to get province')
    }
  }

  async getCity(): Promise<any>{
    const url = `https://api.rajaongkir.com/starter/city/`;
    const headers =  {
      key: '1306e862fb71c2c95e6f40cb6400cbb4',
    }
    try{
      const response = await axios.get(url, {headers})
      return response.data.rajaongkir.results;
    }
    catch(error){
      throw new Error('failed to get province')
    }
  }

  async getCityById(id: string): Promise<any>{
    const url = `https://api.rajaongkir.com/starter/city?id=${id}`;
    const headers =  {
      key: '1306e862fb71c2c95e6f40cb6400cbb4',
    }
    try{
      const response = await axios.get(url, {headers})
      return response.data.rajaongkir.results;
    }
    catch(error){
      throw new Error('failed to get province')
    }
  }
  async getPrice(createPriceShipping: CreatePriceShippingDto): Promise<any> {
    const {origin, destination, weight, courier} = createPriceShipping;
    const url = `https://api.rajaongkir.com/starter/cost`;
    const headers = {
      key: '1306e862fb71c2c95e6f40cb6400cbb4',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = {
      origin,
      destination,
      weight,
      courier,
    };
    try {
      const response = await axios.post(url, data, { headers });
      return response.data.rajaongkir.results;
    } catch (error) {
      throw new Error('Failed to get price');
    }
  }
}




