import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './products-related/product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, cart => cart.items)
  @Exclude()
  cart: Cart;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column('int')
  quantity: number;
}
