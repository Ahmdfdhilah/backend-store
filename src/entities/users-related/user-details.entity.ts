import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
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
  phone: string;

  @Column()
  gender: string;

  @Column()
  birthDate: string;

  @Column({nullable:true})
  imgSrc: string;

  @OneToOne(() => User, user => user.details)
  user: User;
}
