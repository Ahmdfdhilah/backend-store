import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Discounts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Product, product => product.discounts)
  product: Product;

  @Column()
  discount: number;

  @Column()
  expires_at: Date;
}
