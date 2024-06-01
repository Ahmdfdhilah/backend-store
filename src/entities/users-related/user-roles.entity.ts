import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserRoles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  role: string;

  @ManyToMany(() => User, user => user.roles)
  @JoinTable()
  users: User[];
}
