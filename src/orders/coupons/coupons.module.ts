import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsService } from './coupons-service';
import { CouponsController } from './coupons.controller';
import { Coupons } from 'src/entities/orders-related/coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coupons])],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
