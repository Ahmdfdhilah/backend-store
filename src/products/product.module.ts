import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from '../entities/products-related/product.entity';
import { CartItem } from '../entities/cart-item.entity';
import { OrderItem } from '../entities/orders-related/order-item.entity';
import { ProductReviews } from '../entities/products-related/product-reviews.entity';
import { ProductInventory } from '../entities/products-related/product-inventory.entity';
import { Discounts } from '../entities/products-related/discounts.entity';
import { User } from 'src/entities/users-related/user.entity';
import { SpecsLaptop } from 'src/entities/products-related/specs/specs-laptop.entity';
import { SpecsSmartphone } from 'src/entities/products-related/specs/specs-smartphone.entity';
import { SpecsTablet } from 'src/entities/products-related/specs/specs-tablet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      CartItem,
      OrderItem,
      ProductReviews,
      SpecsLaptop,
      SpecsSmartphone,
      SpecsTablet,
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
