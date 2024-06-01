import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { ProductModule } from '../products/product.module';
import { UserModule } from '../users/user.module';
import { Product } from 'src/entities/products-related/product.entity';
import { User } from 'src/entities/users-related/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';


@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product, User]),
    ProductModule, 
    UserModule,    
  ],
  providers: [CartService, JwtAuthGuard
  ],
  controllers: [CartController],
})
export class CartModule {}
