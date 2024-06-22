import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/orders-related/order.entity';
import { OrderItem } from '../entities/orders-related/order-item.entity';
import { OrderStatusHistory } from '../entities/orders-related/order-status.entity';
import { ShippingDetails } from '../entities/orders-related/shipping-details.entity';
import { Payments } from '../entities/orders-related/payments.entity';
import { Product } from '../entities/products-related/product.entity';
import { User } from '../entities/users-related/user.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from 'src/users/user.module';
import { ProductModule } from 'src/products/product.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order, 
      OrderItem, 
      OrderStatusHistory, 
      ShippingDetails, 
      Payments, 
      Product, 
      User
    ]), 
    forwardRef(() => AuthModule), 
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
