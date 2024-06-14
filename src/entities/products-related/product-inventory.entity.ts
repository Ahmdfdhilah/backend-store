import { Entity, PrimaryGeneratedColumn, Column,  OneToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Product, product => product.inventory)
  product: Product;

  @Column()
  stock: number;
}
