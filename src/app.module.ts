import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { UserModule } from './users/user.module';
import { ProductModule } from './products/product.module';
import { OrderModule } from './orders/order.module';
import { CartModule } from './carts/cart.module';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { Cart } from './entities/cart.entity';
import { SeederModule } from './seeder/seeder.module';
import { CartItem } from './entities/cart-item.entity';
import { OrderItem } from './entities/order-item.entity';
import { SeederService } from './seeder/seeder.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      entities: [User, Product, Order, OrderItem, Cart, CartItem],
      synchronize: true,
    }),
    CacheModule.register({
      isGlobal:true,
      store: redisStore,
      ttl: 300,
    }),
    TypeOrmModule.forFeature([User, Product, Order, Cart, CartItem, OrderItem]),
    SeederModule,
    UserModule,
    ProductModule,
    OrderModule,
    CartModule,
    AuthModule
  ],
  controllers: [],
  providers: [SeederService],
})
export class AppModule {
  constructor(private readonly seederService: SeederService) {
    this.seederService.seed();
  }
}
