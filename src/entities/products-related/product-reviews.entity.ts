import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToOne } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../users-related/user.entity';
import { OrderItem } from '../orders-related/order-item.entity';

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

  @OneToOne(() => OrderItem, orderItem => orderItem.productReviews, { onDelete: 'CASCADE' })
  orderItem: OrderItem;

  @ManyToOne(() => User, user => user.reviews, { onDelete: 'CASCADE' })
  user: User;
}
