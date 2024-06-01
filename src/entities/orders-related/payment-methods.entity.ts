import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Payments } from './payments.entity';

@Entity()
export class PaymentMethods {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  details: string;

  @OneToMany(() => Payments, payment => payment.method, {cascade:true})
  payment: Payments;
}
