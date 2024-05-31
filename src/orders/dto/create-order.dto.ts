import { IsUUID, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;
}

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  status: string;
}
