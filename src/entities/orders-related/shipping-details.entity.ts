import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class ShippingDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  @OneToOne(() => Order, order => order.shippingDetails)
  order: Order;
}
