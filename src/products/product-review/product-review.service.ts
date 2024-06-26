import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductReviews } from '../../entities/products-related/product-reviews.entity';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { User } from '../../entities/users-related/user.entity';
import { Product } from '../../entities/products-related/product.entity';
import { OrderItem } from 'src/entities/orders-related/order-item.entity';

@Injectable()
export class ProductReviewsService {
  constructor(
    @InjectRepository(ProductReviews) private readonly productReviewsRepository: Repository<ProductReviews>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<ProductReviews[]> {
    return await this.productReviewsRepository.find({ relations: ['user', 'product', 'orderItem'] });
  }

  async findOne(id: string): Promise<ProductReviews> {
    const review = await this.productReviewsRepository.findOne({ where: { id }, relations: ['user', 'product', 'orderItem'] });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async create(createProductReviewDto: CreateProductReviewDto): Promise<ProductReviews> {
    const { rating, comment, productId, userId, orderItemId  } = createProductReviewDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product not found: ${productId}`);
    }

    const orderItem = await this.orderItemRepository.findOne({ where: { id: orderItemId } });
    if (!orderItem) {
      throw new NotFoundException(`Order Item not found: ${productId}`);
    }
    const review = this.productReviewsRepository.create({ rating, comment, user, product, orderItem });
    return await this.productReviewsRepository.save(review);
  }

  async update(id: string, updateProductReviewDto: UpdateProductReviewDto): Promise<ProductReviews> {
    const review = await this.productReviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    Object.assign(review, updateProductReviewDto);
    return await this.productReviewsRepository.save(review);
  }

  async remove(id: string): Promise<void> {
    const review = await this.productReviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    await this.productReviewsRepository.remove(review);
  }
}
