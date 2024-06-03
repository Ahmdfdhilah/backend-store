import { IsInt, IsUUID, ValidateNested } from "class-validator";
import { CreateOrderItemDto, CreateOrderStatusDto, CreatePaymentsDto, CreateShippingDetailsDto } from "./create-order.dto";
import { Type } from "class-transformer";

export class UpdateOrderDto {
  @IsUUID()
  userId: string;

  @IsInt()
  total: number;

  couponsId?: string;

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