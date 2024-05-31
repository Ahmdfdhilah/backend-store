import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CacheModule } from '@nestjs/common/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CacheModule.register()],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
