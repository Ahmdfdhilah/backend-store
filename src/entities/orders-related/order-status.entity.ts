import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.statusHistory, {eager: true})
  order: Order;

  @Column()
  status: string;

  @Column()
  updated_at: Date;
}
