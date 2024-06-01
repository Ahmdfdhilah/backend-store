import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Address } from './address.entity';
import { Cart } from '../cart.entity';
import { Order } from '../orders-related/order.entity';
import { UserDetails } from './user-details.entity';
import { ProductReviews } from '../products-related/product-reviews.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;
  
  @Column()
  userRole: string;

  @Column()
  password: string;

  @OneToMany(() => Address, address => address.user)
  addresses: Address[];

  @OneToMany(() => Cart, cart => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => UserDetails, userDetails => userDetails.user)
  details: UserDetails[];

  @OneToMany(() => ProductReviews, productReviews => productReviews.user)
  reviews: ProductReviews[];
}
