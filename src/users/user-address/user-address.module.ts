import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressService } from './user-address.service';
import { UserAddressController } from './user-address.controller';
import { UserAddress } from 'src/entities/users-related/user-address.entity';
import { User } from 'src/entities/users-related/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress, User])],
  providers: [UserAddressService],
  controllers: [UserAddressController],
})
export class UserAddressModule {}
