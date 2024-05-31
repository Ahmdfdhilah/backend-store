import { IsUUID, ValidateNested, IsInt } from 'class-validator';


class CreateCartItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;
}

export class CreateCartDto {
  @IsUUID()
  userId: string;

  items: CreateCartItemDto[];
}
