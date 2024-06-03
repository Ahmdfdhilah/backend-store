import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  fullName: string;

  @Column()
  imgSrc: string;
  
  @Column()
  phone: string;

  @Column()
  country: string;

  @ManyToOne(() => User, user => user.details)
  user: User;
}
