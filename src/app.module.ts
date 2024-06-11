import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { UserModule } from './users/user.module';
import { ProductModule } from './products/product.module';
import { OrderModule } from './orders/order.module';
import { User } from './entities/users-related/user.entity';
import { Product } from './entities/products-related/product.entity';
import { Order } from './entities/orders-related/order.entity';
import { SeederModule } from './seeder/seeder.module';
import { OrderItem } from './entities/orders-related/order-item.entity';
import { SeederService } from './seeder/seeder.service';
import { AuthModule } from './auth/auth.module';
import { UserAddress } from './entities/users-related/user-address.entity';
import { Discounts } from './entities/products-related/discounts.entity';
import { OrderStatusHistory } from './entities/orders-related/order-status.entity';
import { Payments } from './entities/orders-related/payments.entity';
import { ProductInventory } from './entities/products-related/product-inventory.entity';
import { ProductReviews } from './entities/products-related/product-reviews.entity';
import { ShippingDetails } from './entities/orders-related/shipping-details.entity';
import { UserDetails } from './entities/users-related/user-details.entity';
import { ProductReviewsModule } from './products/product-review/product-review.module';
import { SpecsLaptop } from './entities/products-related/specs/specs-laptop.entity';
import { SpecsSmartphone } from './entities/products-related/specs/specs-smartphone.entity';
import { SpecsTablet } from './entities/products-related/specs/specs-tablet.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RateLimiterMiddleware } from './security/rate-limiter.middleware';
import { APP_GUARD } from '@nestjs/core';
import { UserDetailsModule } from './users/user-details/user-details.module';
import { UserAddressModule } from './users/user-address/user-address.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      entities: [User, Product, Order, OrderItem, UserAddress,  Discounts, OrderStatusHistory, Payments, ProductInventory, ProductReviews, ShippingDetails, UserDetails, SpecsLaptop, SpecsSmartphone, SpecsTablet],
      synchronize: true,
    }),
    CacheModule.register({
      isGlobal:true,
      ttl: 300,
    }),
    TypeOrmModule.forFeature([User, Product, Order, OrderItem, UserAddress, Discounts, OrderStatusHistory, Payments, ProductInventory, ProductReviews, ShippingDetails, UserDetails, SpecsLaptop, SpecsSmartphone, SpecsTablet]),
    SeederModule,
    UserModule,
    ProductModule,
    OrderModule,
    UserDetailsModule,
    UserAddressModule,
    ProductReviewsModule,
    AuthModule
  ],
  controllers: [],
  providers: [
    SeederService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    RateLimiterMiddleware,
  ],
})
export class AppModule {
  constructor(private readonly seederService: SeederService) {
    this.seederService.seed();
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware)
      .forRoutes('auth/login'); 
  }
}
