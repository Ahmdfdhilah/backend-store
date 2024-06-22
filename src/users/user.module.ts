import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users-related/user.entity';
import { UserDetails } from '../entities/users-related/user-details.entity';
import { UserAddress } from 'src/entities/users-related/user-address.entity';
import { ProductReviews } from '../entities/products-related/product-reviews.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      UserDetails,
      UserAddress,
      ProductReviews
    ]), 
    forwardRef(() => AuthModule) 
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
