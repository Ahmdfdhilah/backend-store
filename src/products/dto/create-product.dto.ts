import {  ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateInventoryDto {
  stock: number;
}

class CreateReviewDto {
  rating: number;
  comment: string;
  userId: string;
}

class CreateDiscountDto {
  discount: number;
  expires_at: string;
}

export class CreateProductDto {
  name: string;
  price: number;

  @ValidateNested({ each: true })
  @Type(() => CreateInventoryDto)
  inventory: CreateInventoryDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateReviewDto)
  reviews: CreateReviewDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateDiscountDto)
  discounts: CreateDiscountDto[];

  categories: string[];
}
