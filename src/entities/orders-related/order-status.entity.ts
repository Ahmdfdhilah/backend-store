import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.statusHistory, { eager: true })
  order: Order;

  @Column({ nullable: true })
  transaction_id: string;

  @Column({ nullable: true })
  gross_amount: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  payment_type: string;

  @Column({ nullable: true })
  signature_key: string;

  @Column({ nullable: true })
  transaction_status: string;

  @Column({ nullable: true })
  fraud_status: string;

  @Column({ nullable: true })
  status_message: string;

  @Column({ nullable: true })
  merchant_id: string;

  @Column({ type: 'json', nullable: true })
  va_numbers: { bank: string; va_number: string }[];

  @Column({ type: 'json', nullable: true })
  payment_amounts: any[];

  @Column({ nullable: true })
  transaction_time: string;

  @Column({ nullable: true })
  settlement_time: string;

  @Column({ nullable: true })
  expiry_time: string;

  @Column({ nullable: true })
  updated_at: Date;
}
