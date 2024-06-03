import { IsDate } from 'class-validator';

export class CreateCouponDto {
  code: string;
  discount: number;
  @IsDate()
  expires_at: Date;
}
