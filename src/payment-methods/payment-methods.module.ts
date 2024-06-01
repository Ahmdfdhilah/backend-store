import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethods } from '../entities/orders-related/payment-methods.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethods])],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
