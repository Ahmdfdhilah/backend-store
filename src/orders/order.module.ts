import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from '../entities/order.entity';
import { UserModule } from '../users/user.module';
import { ProductModule } from '../products/product.module';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/product.entity';
import { OrderItem } from 'src/entities/order-item.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';


@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Product, OrderItem]),
    UserModule, 
    ProductModule, 
  ],
  providers: [OrderService, JwtAuthGuard],
  controllers: [OrderController],
})
export class OrderModule {}
