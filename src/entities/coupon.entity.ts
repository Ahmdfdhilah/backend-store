import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Coupons {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  discount: number;

  @Column()
  expires_at: Date;
}
