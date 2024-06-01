import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from '../entities/products-related/product.entity';
import { CartItem } from '../entities/cart-item.entity';
import { OrderItem } from '../entities/orders-related/order-item.entity';
import { ProductReviews } from '../entities/products-related/product-reviews.entity';
import { ProductCategories } from '../entities/products-related/product-categories.entity';
import { ProductInventory } from '../entities/products-related/product-inventory.entity';
import { Discounts } from '../entities/products-related/discounts.entity';
import { User } from 'src/entities/users-related/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      CartItem,
      OrderItem,
      ProductReviews,
      ProductCategories,
      ProductInventory,
      Discounts,
      User
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
