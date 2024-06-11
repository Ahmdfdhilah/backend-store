import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { UserAddress } from './user-address.entity';
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

  @OneToMany(() => UserAddress, address => address.user)
  addresses: UserAddress[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToOne(() => UserDetails, userDetails => userDetails.user)
  @JoinColumn()
  details: UserDetails[];

  @OneToMany(() => ProductReviews, productReviews => productReviews.user)
  reviews: ProductReviews[];
}
