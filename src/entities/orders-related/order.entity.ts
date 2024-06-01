import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from 'typeorm';
import { User } from '../users-related/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatusHistory } from './order-status.entity';
import { ShippingDetails } from './shipping-details.entity';
import { Payments } from './payments.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.orders, {eager: true})
  user: User;

  @Column()
  total: number;

  @OneToMany(() => OrderItem, items => items.order, {cascade: true})
  items: OrderItem[];

  @OneToMany(() => OrderStatusHistory, orderStatusHistory => orderStatusHistory.order, {cascade: true})
  statusHistory: OrderStatusHistory[];

  @OneToMany(() => ShippingDetails, shippingDetails => shippingDetails.order, {cascade:true})
  shippingDetails: ShippingDetails[];

  @OneToMany(() => Payments, payments => payments.order, {cascade:true})
  payments: Payments[];
}
