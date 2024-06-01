import { NotEmpty, IsUUID, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;
}

export class CreateOrderStatusDto {
  status: string;

  @NotEmpty()
  updated_at: Date;
}

export class CreateShippingDetailsDto {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export class CreatePaymentsDto {
  @IsInt()
  amount: number;

  @IsUUID()
  methodId: string;

  status: string;

  @NotEmpty()
  paid_at: Date;
}

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsInt()
  total: number;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateOrderStatusDto)
  statusHistory: CreateOrderStatusDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateShippingDetailsDto)
  shippingDetails: CreateShippingDetailsDto[];

  @ValidateNested({ each: true })
  @Type(() => CreatePaymentsDto)
  payments: CreatePaymentsDto[];
}
