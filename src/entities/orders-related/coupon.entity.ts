import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Coupons {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  discount: number;

  @Column()
  expires_at: Date;

  @OneToMany(() => Order, order => order.coupons)
  orders: Order[];
}
