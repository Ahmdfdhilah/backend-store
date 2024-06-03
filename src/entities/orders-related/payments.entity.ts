import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Payments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.payments, {eager: true})
  order: Order;

  @Column()
  amount: number;

  @Column()
  method: string;

  @Column()
  status: string;

  @Column()
  link_payment: string;

  @Column()
  paid_at: Date;
}
