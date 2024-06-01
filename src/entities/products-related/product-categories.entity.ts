import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductCategories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Product, product => product.categories)
  products: Product[];
}
