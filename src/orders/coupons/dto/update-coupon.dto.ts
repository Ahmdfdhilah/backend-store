import { IsDate } from 'class-validator';

export class UpdateCouponDto {
  code?: string;
  discount?: number;
  @IsDate()
  expires_at?: Date;
}
