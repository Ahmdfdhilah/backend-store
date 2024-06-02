import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { UserModule } from './users/user.module';
import { ProductModule } from './products/product.module';
import { OrderModule } from './orders/order.module';
import { CartModule } from './carts/cart.module';
import { User } from './entities/users-related/user.entity';
import { Product } from './entities/products-related/product.entity';
import { Order } from './entities/orders-related/order.entity';
import { Cart } from './entities/cart.entity';
import { SeederModule } from './seeder/seeder.module';
import { CartItem } from './entities/cart-item.entity';
import { OrderItem } from './entities/orders-related/order-item.entity';
import { SeederService } from './seeder/seeder.service';
import { AuthModule } from './auth/auth.module';
import { Address } from './entities/users-related/address.entity';
import { Coupons } from './entities/coupon.entity';
import { Discounts } from './entities/products-related/discounts.entity';
import { OrderStatusHistory } from './entities/orders-related/order-status.entity';
import { PaymentMethods } from './entities/orders-related/payment-methods.entity';
import { Payments } from './entities/orders-related/payments.entity';
import { ProductCategories } from './entities/products-related/product-categories.entity';
import { ProductInventory } from './entities/products-related/product-inventory.entity';
import { ProductReviews } from './entities/products-related/product-reviews.entity';
import { ShippingDetails } from './entities/orders-related/shipping-details.entity';
import { UserDetails } from './entities/users-related/user-details.entity';
import { PaymentMethodsModule } from './orders/payment-methods/payment-methods.module';
import { CategoryModule } from './products/product-categories/product-categories.module';
import { ProductReviewsModule } from './products/product-review/product-review.module';

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
      entities: [User, Product, Order, OrderItem, Cart, CartItem, Address, Coupons, Discounts, OrderStatusHistory, PaymentMethods, Payments, ProductCategories, ProductInventory, ProductReviews, ShippingDetails, UserDetails],
      synchronize: true,
    }),
    CacheModule.register({
      isGlobal:true,
      store: redisStore,
      ttl: 300,
    }),
    TypeOrmModule.forFeature([User, Product, Order, OrderItem, Cart, CartItem, Address, Coupons, Discounts, OrderStatusHistory, PaymentMethods, Payments, ProductCategories, ProductInventory, ProductReviews, ShippingDetails, UserDetails]),
    SeederModule,
    UserModule,
    ProductModule,
    OrderModule,
    CartModule,
    PaymentMethodsModule,
    ProductReviewsModule,
    CategoryModule,
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
