import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from '../entities/products-related/product.entity';
import { OrderItem } from '../entities/orders-related/order-item.entity';
import { ProductReviews } from '../entities/products-related/product-reviews.entity';
import { Discounts } from '../entities/products-related/discounts.entity';
import { User } from 'src/entities/users-related/user.entity';
import { SpecsLaptop } from 'src/entities/products-related/specs/specs-laptop.entity';
import { SpecsSmartphone } from 'src/entities/products-related/specs/specs-smartphone.entity';
import { SpecsTablet } from 'src/entities/products-related/specs/specs-tablet.entity';
import { UserModule } from 'src/users/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      OrderItem,
      ProductReviews,
      SpecsLaptop,
      SpecsSmartphone,
      SpecsTablet,
      Discounts,
      User
    ]),
    forwardRef(() => AuthModule), 
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
