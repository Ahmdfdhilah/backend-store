import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, product => product.inventory)
  product: Product;

  @Column()
  stock: number;
}
