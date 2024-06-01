import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../users-related/user.entity';

@Entity()
export class ProductReviews {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, product => product.reviews)
  product: Product;

  @ManyToOne(() => User, user => user.reviews)
  user: User;

  @Column()
  rating: number;

  @Column()
  comment: string;
}
