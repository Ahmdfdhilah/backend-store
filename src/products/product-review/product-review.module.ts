import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReviewsService } from './product-review.service';
import { ProductReviewsController } from './product-review.controller';
import { ProductReviews } from '../../entities/products-related/product-reviews.entity';
import { User } from '../../entities/users-related/user.entity';
import { Product } from '../../entities/products-related/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReviews, User, Product])],
  providers: [ProductReviewsService],
  controllers: [ProductReviewsController],
})
export class ProductReviewsModule {}
