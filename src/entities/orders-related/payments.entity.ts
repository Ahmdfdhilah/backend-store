import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { PaymentMethods } from './payment-methods.entity';

@Entity()
export class Payments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.payments, {eager: true})
  order: Order;

  @Column()
  amount: number;

  @ManyToOne(() => PaymentMethods)
  method: PaymentMethods;

  @Column()
  status: string;

  @Column()
  paid_at: Date;
}
