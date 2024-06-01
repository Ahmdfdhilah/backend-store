import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class ShippingDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.shippingDetails)
  order: Order;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;
}
