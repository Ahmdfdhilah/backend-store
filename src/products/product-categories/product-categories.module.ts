import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './product-categories.controller';
import { CategoryService } from './product-categories.service';
import { ProductCategories } from '../../entities/products-related/product-categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategories])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
