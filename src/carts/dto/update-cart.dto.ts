import { IsUUID, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateCartItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;
}

export class UpdateCartDto {
  @IsUUID()
  userId?: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateCartItemDto)
  items: UpdateCartItemDto[];
}
