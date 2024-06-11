import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users-related/user.entity';
import { Product } from '../entities/products-related/product.entity';
import { Order } from '../entities/orders-related/order.entity';
import { SeederService } from './seeder.service';
import { SpecsLaptop } from 'src/entities/products-related/specs/specs-laptop.entity';
import { SpecsSmartphone } from 'src/entities/products-related/specs/specs-smartphone.entity';
import { SpecsTablet } from 'src/entities/products-related/specs/specs-tablet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order, SpecsLaptop, SpecsSmartphone, SpecsTablet])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
