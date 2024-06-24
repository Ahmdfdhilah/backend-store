import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products-related/product.entity';
import { Exclude } from 'class-transformer';
import { ProductReviews } from '../products-related/product-reviews.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.items)
  @Exclude()
  order: Order;

  @ManyToOne(() => Product, { eager: true, nullable: true })
  product: Product;

  @OneToOne(() => ProductReviews, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  productReviews: ProductReviews;
  
  @Column('int')
  quantity: number;

  @Column()
  color: string;

}
