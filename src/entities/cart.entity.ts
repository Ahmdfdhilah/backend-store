import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.carts, { eager: true })
  user: User;

  @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true, onDelete: 'CASCADE' })
  items: CartItem[];

  @Column('decimal')
  totalPrice: number;
}
