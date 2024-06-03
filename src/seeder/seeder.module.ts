import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users-related/user.entity';
import { Product } from '../entities/products-related/product.entity';
import { Order } from '../entities/orders-related/order.entity';
import { Cart } from '../entities/cart.entity';
import { SeederService } from './seeder.service';
import { ProductCategories } from 'src/entities/products-related/product-categories.entity';
import { ProductInventory } from 'src/entities/products-related/product-inventory.entity';
import { Discounts } from 'src/entities/products-related/discounts.entity';
import { ProductReviews } from 'src/entities/products-related/product-reviews.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order, Cart, ProductCategories, ProductInventory, Discounts, ProductReviews])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
