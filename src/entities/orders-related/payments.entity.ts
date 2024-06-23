import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Payments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.payments, {eager: true})
  order: Order;

  @Column({ nullable: true })
  amount: number;

  @Column({ nullable: true })
  link_payment: string;

}