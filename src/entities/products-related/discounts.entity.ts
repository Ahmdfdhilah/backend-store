import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Discounts {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Product, product => product.discounts)
  product: Product;

  @Column()
  discount: number;

  @Column()
  expires_at: Date;
}
