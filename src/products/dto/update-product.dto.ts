import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateInventoryDto {
  stock: number;
}

class UpdateReviewDto {
  rating?: number;
  comment?: string;
  userId?: string;
}

class UpdateDiscountDto {
  discount: number;
  expires_at: string;
}

export class UpdateProductDto {
  name: string;
  price: number;

  @ValidateNested({ each: true })
  @Type(() => UpdateInventoryDto)
  inventory: UpdateInventoryDto[];

  @ValidateNested({ each: true })
  @Type(() => UpdateReviewDto)
  reviews: UpdateReviewDto[];

  @ValidateNested({ each: true })
  @Type(() => UpdateDiscountDto)
  discounts: UpdateDiscountDto[];

  categories: string[];
}
