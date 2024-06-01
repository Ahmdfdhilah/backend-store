import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users-related/user.entity';
import { Product } from '../entities/products-related/product.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  ) {}

  private async isDatabaseEmpty(): Promise<boolean> {
    const userCount = await this.userRepository.count();
    const productCount = await this.productRepository.count();
    return userCount === 0 && productCount === 0;
  }

  async seed() {
    const isDatabaseEmpty = await this.isDatabaseEmpty();
    if (isDatabaseEmpty) {
      await this.seedUsers();
      await this.seedProducts();
    }
  }

  private async seedUsers() {
    const users = [
      { username: 'John Doe', email: 'john@example.com', password: 'password' },
      { username: 'Jane Doe', email: 'jane@example.com', password: 'password' },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10); // Adjusted salt rounds
      const newUser = this.userRepository.create({ ...user, password: hashedPassword });
      await this.userRepository.save(newUser);
    }
  }

  private async seedProducts() {
    const products = [
      { name: 'Product 1', price: 100 },
      { name: 'Product 2', price: 200 },
    ];

    for (const product of products) {
      const newProduct = this.productRepository.create(product);
      await this.productRepository.save(newProduct);
    }
  }
}
