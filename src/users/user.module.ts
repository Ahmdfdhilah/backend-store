import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users-related/user.entity';
import { UserDetails } from '../entities/users-related/user-details.entity';
import { Address } from '../entities/users-related/address.entity';
import { UserRoles } from '../entities/users-related/user-roles.entity';
import { ProductReviews } from '../entities/products-related/product-reviews.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDetails, Address, UserRoles, ProductReviews])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
