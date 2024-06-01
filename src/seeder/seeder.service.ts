import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users-related/user.entity';
import { Product } from '../entities/products-related/product.entity';
import { ProductInventory } from '../entities/products-related/product-inventory.entity';
import { ProductReviews } from '../entities/products-related/product-reviews.entity';
import { Discounts } from '../entities/products-related/discounts.entity';
import { ProductCategories } from '../entities/products-related/product-categories.entity';
import { PaymentMethods } from '../entities/orders-related/payment-methods.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductInventory) private readonly productInventoryRepository: Repository<ProductInventory>,
    @InjectRepository(ProductReviews) private readonly productReviewsRepository: Repository<ProductReviews>,
    @InjectRepository(Discounts) private readonly discountsRepository: Repository<Discounts>,
    @InjectRepository(ProductCategories) private readonly productCategoriesRepository: Repository<ProductCategories>,
    @InjectRepository(PaymentMethods) private readonly paymentMethodsRepository: Repository<PaymentMethods>,
  ) {}

  private async isDatabaseEmpty(): Promise<boolean> {
    const userCount = await this.userRepository.count();
    const productCount = await this.productRepository.count();
    const categoryCount = await this.productCategoriesRepository.count();
    const paymentMethodCount = await this.paymentMethodsRepository.count();
    return userCount === 0 && productCount === 0 && categoryCount === 0 && paymentMethodCount === 0;
  }

  async seed() {
    const isDatabaseEmpty = await this.isDatabaseEmpty();
    if (isDatabaseEmpty) {
      await this.seedUsers();
      await this.seedCategories();
      await this.seedPaymentMethods();
      await this.seedProducts();
    }
  }

  private async seedUsers() {
    const users = [
      { username: 'testuser', email: 'test@example.com', password: 'password', UserRoles: "admin" },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = this.userRepository.create({ ...user, password: hashedPassword });
      await this.userRepository.save(newUser);
    }
  }

  private async seedCategories() {
    const categories = [
      { name: 'Electronics' },
      { name: 'Clothing' },
      { name: 'Books' },
    ];

    for (const category of categories) {
      const newCategory = this.productCategoriesRepository.create(category);
      await this.productCategoriesRepository.save(newCategory);
    }
  }

  private async seedPaymentMethods() {
    const paymentMethods = [
      { name: 'Credit Card', details: 'Visa, MasterCard, Amex' },
      { name: 'PayPal', details: 'Pay via PayPal' },
      { name: 'Bank Transfer', details: 'Transfer directly to our bank account' },
    ];

    for (const method of paymentMethods) {
      const newPaymentMethod = this.paymentMethodsRepository.create(method);
      await this.paymentMethodsRepository.save(newPaymentMethod);
    }
  }

  private async seedProducts() {
    const products = [
      {
        name: 'Mito AE23',
        price: 100,
        inventory: [],
        reviews: [],
        discounts: [],
        categories: [],
      },
      {
        name: 'SAMSUNG 23A',
        price: 200,
        inventory: [],
        reviews: [],
        discounts: [],
        categories: [],
      },
    ];

    for (const productData of products) {
      const { inventory, reviews, discounts, categories, ...product } = productData;

      const newProduct = this.productRepository.create(product);
      await this.productRepository.save(newProduct);

      if (inventory) {
        const inventoryEntities = inventory.map(item => {
          const inventoryEntity = new ProductInventory();
          inventoryEntity.stock = item.stock;
          inventoryEntity.product = newProduct;
          return inventoryEntity;
        });
        await this.productInventoryRepository.save(inventoryEntities);
      }

      if (reviews) {
        const reviewEntities = await Promise.all(reviews.map(async item => {
          const user = await this.userRepository.findOne({ where: { id: item.userId } });
          if (!user) {
            throw new Error(`User not found: ${item.userId}`);
          }
          const reviewEntity = new ProductReviews();
          reviewEntity.rating = item.rating;
          reviewEntity.comment = item.comment;
          reviewEntity.product = newProduct;
          reviewEntity.user = user;
          return reviewEntity;
        }));
        await this.productReviewsRepository.save(reviewEntities);
      }

      if (discounts) {
        const discountEntities = discounts.map(item => {
          const discountEntity = new Discounts();
          discountEntity.discount = item.discount;
          discountEntity.expires_at = new Date(item.expires_at);
          discountEntity.product = newProduct;
          return discountEntity;
        });
        await this.discountsRepository.save(discountEntities);
      }

      if (categories) {
        const categoryEntities = await Promise.all(categories.map(async categoryId => {
          const categoryEntity = await this.productCategoriesRepository.findOne({ where: { id: categoryId } });
          if (!categoryEntity) {
            throw new Error(`Category not found: ${categoryId}`);
          }
          return categoryEntity;
        }));
        newProduct.categories = categoryEntities;
      }

      await this.productRepository.save(newProduct);
    }
  }
}
