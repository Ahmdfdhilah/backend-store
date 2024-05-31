import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<Order[]> {
    const cacheKey = 'orders';
    const cachedOrders = await this.cacheManager.get<Order[]>(cacheKey);

    if (cachedOrders) {
      this.logger.log('Returning cached orders');
      return cachedOrders;
    }

    const orders = await this.orderRepository.find({ relations: ['items', 'items.product', 'user'] });
    this.logger.log('Setting orders to cache');
    await this.cacheManager.set(cacheKey, JSON.stringify(orders), 10000); 
    return orders;
  }

  async findOne(id: string): Promise<Order> {
    const cacheKey = `order_${id}`;
    const cachedOrder = await this.cacheManager.get<Order>(cacheKey);

    if (cachedOrder) {
      this.logger.log(`Returning cached order with ID: ${id}`);
      return cachedOrder;
    }

    const order = await this.orderRepository.findOne({ where: { id }, relations: ['items', 'items.product', 'user'] });
    this.logger.log(`Setting order with ID: ${id} to cache`);
    await this.cacheManager.set(cacheKey, JSON.stringify(order), 10000); 
    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, items, status } = createOrderDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const order = this.orderRepository.create({
      user,
      status,
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderItems = await Promise.all(items.map(async itemDto => {
      const product = await this.productRepository.findOne({ where: { id: itemDto.productId } });
      if (!product) {
        throw new Error(`Product not found: ${itemDto.productId}`);
      }
      const orderItem = this.orderItemRepository.create({
        product,
        quantity: itemDto.quantity,
        order: savedOrder, 
      });
      return orderItem;
    }));

    await this.orderItemRepository.save(orderItems);

    const newOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product', 'user'],
    });

    const totalPrice = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    newOrder.totalPrice = totalPrice;

    await this.orderRepository.save(newOrder);

    this.logger.log('Order created:', JSON.stringify({
      id: newOrder.id,
      userId: newOrder.user.id,
      totalPrice: newOrder.totalPrice,
      items: newOrder.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      status: newOrder.status,
    }));

    await this.cacheManager.del('orders');
    this.logger.log('Cleared allOrders cache');

    return plainToClass(Order, newOrder, { excludePrefixes: ['__'] });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { userId, items, status, ...updateFields } = updateOrderDto;

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
      updateFields['user'] = user;
    }

    await this.orderRepository.update(id, updateFields);

    if (items) {
      const order = await this.orderRepository.findOne({ where: { id }, relations: ['items'] });
      if (!order) {
        throw new Error('Order not found');
      }

      const orderItems = await Promise.all(items.map(async item => {
        const product = await this.productRepository.findOne({ where: { id: item.productId } });
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        const orderItem = this.orderItemRepository.create({
          product,
          quantity: item.quantity,
          order,
        });
        return orderItem;
      }));

      await this.orderItemRepository.delete({ order }); 
      await this.orderItemRepository.save(orderItems);

      const totalPrice = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      order.items = orderItems;
      order.totalPrice = totalPrice;
      await this.orderRepository.save(order);
    }

    const updatedOrder = await this.orderRepository.findOne({ where: { id }, relations: ['items', 'items.product', 'user'] });
    this.logger.log(`Order updated with ID: ${id}`, JSON.stringify({
      id: updatedOrder.id,
      userId: updatedOrder.user.id,
      totalPrice: updatedOrder.totalPrice,
      items: updatedOrder.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      status: updatedOrder.status,
    }));

    await this.cacheManager.del('orders');
    await this.cacheManager.del(`order_${id}`);
    this.logger.log(`Cleared cache for order with ID: ${id}`);

    return plainToClass(Order, updatedOrder, { excludePrefixes: ['__'] });
  }

  async remove(id: string): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id }, relations: ['items'] });

    if (order) {
      await this.orderItemRepository.delete({ order }); 
      await this.orderRepository.delete(id);
      this.logger.log(`Order removed with ID: ${id}`);
      await this.cacheManager.del('orders');
      await this.cacheManager.del(`order_${id}`);
      this.logger.log(`Cleared cache for order with ID: ${id}`);
    } else {
      this.logger.log(`Order with ID: ${id} not found`);
    }
  }
}
