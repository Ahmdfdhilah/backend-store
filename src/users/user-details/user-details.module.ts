import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetailsService } from './user-details.service';
import { UserDetailsController } from './user-details.controller';
import { UserDetails } from 'src/entities/users-related/user-details.entity';
import { User } from 'src/entities/users-related/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDetails, User])
  ],
  providers: [UserDetailsService],
  controllers: [UserDetailsController],
  exports: [UserDetailsService],
})
export class UserDetailsModule {}
