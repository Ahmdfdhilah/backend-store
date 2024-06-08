import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { CartItem } from '../cart-item.entity';
import { OrderItem } from '../orders-related/order-item.entity';
import { ProductReviews } from './product-reviews.entity';
import { ProductInventory } from './product-inventory.entity';
import { Discounts } from './discounts.entity';
import { SpecsLaptop } from './specs/specs-laptop.entity';
import { SpecsSmartphone } from './specs/specs-smartphone.entity';
import { SpecsTablet } from './specs/specs-tablet.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  // @Column()
  // imgSrc: string;

  @Column()
  price: number;

  @OneToMany(() => CartItem, cartItem => cartItem.product, {cascade: true})
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, orderItem => orderItem.product, {cascade: true})
  orderItems: OrderItem[];

  @OneToMany(() => ProductReviews, productReviews => productReviews.product, {cascade: true})
  reviews: ProductReviews[];

  @OneToMany(() => ProductInventory, productInventory => productInventory.product, {cascade: true})
  inventory: ProductInventory[];

  @OneToMany(() => Discounts, discounts => discounts.product, {cascade: true})
  discounts: Discounts[];

  @OneToOne(() => SpecsLaptop, { cascade: true, onDelete:"CASCADE" })
  @JoinColumn()
  laptopSpecs: SpecsLaptop;

  @OneToOne(() => SpecsSmartphone, { cascade: true ,onDelete:"CASCADE"})
  @JoinColumn()
  smartphoneSpecs: SpecsSmartphone;

  @OneToOne(() => SpecsTablet, { cascade: true ,onDelete:"CASCADE"})
  @JoinColumn()
  tabletSpecs: SpecsTablet; 
}
