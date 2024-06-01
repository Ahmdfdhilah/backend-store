import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../users-related/user.entity';

@Entity()
export class ProductReviews {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @ManyToOne(() => Product, product => product.reviews, { onDelete: 'CASCADE' })
  product: Product;

  @ManyToOne(() => User, user => user.reviews, { onDelete: 'CASCADE' })
  user: User;
}
