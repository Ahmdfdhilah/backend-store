import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<Cart[]> {
    const cacheKey = 'carts';
    const cachedCarts = await this.cacheManager.get<Cart[]>(cacheKey);

    if (cachedCarts) {
      this.logger.log('Returning cached carts');
      return cachedCarts;
    }

    const carts = await this.cartRepository.find({ relations: ['items', 'items.product', 'user'] });
    this.logger.log('Setting carts to cache');
    await this.cacheManager.set(cacheKey, JSON.stringify(carts), 100000);
    return carts;
  }

  async findOne(id: string): Promise<Cart> {
    const cacheKey = `cart_${id}`;
    const cachedCart = await this.cacheManager.get<Cart>(cacheKey);

    if (cachedCart) {
      this.logger.log(`Returning cached cart with ID: ${id}`);
      return cachedCart;
    }

    const cart = await this.cartRepository.findOne({ where: { id }, relations: ['items', 'items.product', 'user'] });
    this.logger.log(`Setting cart with ID: ${id} to cache`);
    await this.cacheManager.set(cacheKey, JSON.stringify(cart), 10000); 
    return cart;
  }

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const { userId, items } = createCartDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Create cart instance
    const cart = this.cartRepository.create({
      user,
    });

    // Save the cart first to generate an ID
    const savedCart = await this.cartRepository.save(cart);

    // Map and save cart items
    const cartItems = await Promise.all(items.map(async itemDto => {
      const product = await this.productRepository.findOne({ where: { id: itemDto.productId } });
      if (!product) {
        throw new Error(`Product not found: ${itemDto.productId}`);
      }
      const cartItem = this.cartItemRepository.create({
        product,
        quantity: itemDto.quantity,
        cart: savedCart, // Ensure the cart relationship is set here
      });
      return cartItem;
    }));

    await this.cartItemRepository.save(cartItems);

    // Reload the cart with items to return it properly
    const newCart = await this.cartRepository.findOne({
      where: { id: savedCart.id },
      relations: ['items', 'items.product', 'user'],
    });

    const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    newCart.totalPrice = totalPrice;

    await this.cartRepository.save(newCart);

    this.logger.log('Cart created:', JSON.stringify({
      id: newCart.id,
      userId: newCart.user.id,
      totalPrice: newCart.totalPrice,
      items: newCart.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    }));

    await this.cacheManager.del('carts');
    this.logger.log('Cleared allCarts cache');
    
    return plainToClass(Cart, newCart, { excludePrefixes: ['__'] });
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const { userId, items, ...updateFields } = updateCartDto;

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
      updateFields['user'] = user;
    }

    await this.cartRepository.update(id, updateFields);

    if (items) {
      const cart = await this.cartRepository.findOne({ where: { id }, relations: ['items'] });
      if (!cart) {
        throw new Error('Cart not found');
      }

      const cartItems = await Promise.all(items.map(async item => {
        const product = await this.productRepository.findOne({ where: { id: item.productId } });
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        const cartItem = this.cartItemRepository.create({
          product,
          quantity: item.quantity,
          cart,
        });
        return cartItem;
      }));

      await this.cartItemRepository.delete({ cart }); 
      await this.cartItemRepository.save(cartItems);

      const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      cart.items = cartItems;
      cart.totalPrice = totalPrice;
      await this.cartRepository.save(cart);
    }

    const updatedCart = await this.cartRepository.findOne({ where: { id }, relations: ['items', 'items.product', 'user'] });
    this.logger.log(`Cart updated with ID: ${id}`, JSON.stringify({
      id: updatedCart.id,
      userId: updatedCart.user.id,
      totalPrice: updatedCart.totalPrice,
      items: updatedCart.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    }));

    await this.cacheManager.del('allCarts');
    await this.cacheManager.del(`cart_${id}`);
    this.logger.log(`Cleared cache for cart with ID: ${id}`);

    return plainToClass(Cart, updatedCart, { excludePrefixes: ['__'] });
  }

  async remove(id: string): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { id }, relations: ['items'] });

    if (cart) {
      await this.cartItemRepository.delete({ cart }); 
      await this.cartRepository.delete(id);
      this.logger.log(`Cart removed with ID: ${id}`);
      await this.cacheManager.del('allCarts');
      await this.cacheManager.del(`cart_${id}`);
      this.logger.log(`Cleared cache for cart with ID: ${id}`);
    } else {
      this.logger.log(`Cart with ID: ${id} not found`);
    }
  }
}
