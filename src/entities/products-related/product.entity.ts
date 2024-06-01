import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { CartItem } from '../cart-item.entity';
import { OrderItem } from '../orders-related/order-item.entity';
import { ProductReviews } from './product-reviews.entity';
import { ProductCategories } from './product-categories.entity';
import { ProductInventory } from './product-inventory.entity';
import { Discounts } from './discounts.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @OneToMany(() => CartItem, cartItem => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => ProductReviews, productReviews => productReviews.product)
  reviews: ProductReviews[];

  @ManyToMany(() => ProductCategories, productCategories => productCategories.products)
  @JoinTable()
  categories: ProductCategories[];

  @OneToMany(() => ProductInventory, productInventory => productInventory.product)
  inventory: ProductInventory[];

  @OneToMany(() => Discounts, discounts => discounts.product)
  discounts: Discounts[];
}
