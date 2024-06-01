import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users-related/user.entity';
import { Product } from '../entities/products-related/product.entity';
import { Order } from '../entities/orders-related/order.entity';
import { Cart } from '../entities/cart.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order, Cart])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
