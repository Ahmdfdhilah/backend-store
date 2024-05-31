import { IsUUID, ValidateNested, IsInt} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateOrderItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;
}

export class UpdateOrderDto {
  @IsUUID()
  userId?: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items: UpdateOrderItemDto[];

  status?: string;
}
