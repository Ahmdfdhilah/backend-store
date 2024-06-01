import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/products-related/product.entity';
import { ProductInventory } from '../entities/products-related/product-inventory.entity';
import { ProductReviews } from '../entities/products-related/product-reviews.entity';
import { Discounts } from '../entities/products-related/discounts.entity';
import { ProductCategories } from '../entities/products-related/product-categories.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../entities/users-related/user.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductInventory) private readonly productInventoryRepository: Repository<ProductInventory>,
    @InjectRepository(ProductReviews) private readonly productReviewsRepository: Repository<ProductReviews>,
    @InjectRepository(Discounts) private readonly discountsRepository: Repository<Discounts>,
    @InjectRepository(ProductCategories) private readonly productCategoriesRepository: Repository<ProductCategories>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<Product[]> {
    const cacheKey = 'products';
    const cachedProducts = await this.cacheManager.get<Product[]>(cacheKey);

    if (cachedProducts) {
      this.logger.log('Returning cached products');
      return plainToClass(Product, cachedProducts);
    }

    const products = await this.productRepository.find({ relations: ['inventory', 'reviews', 'reviews.user', 'discounts', 'categories'] });
    await this.cacheManager.set(cacheKey, products, 10000);
    return products;
  }

  async findOne(id: string): Promise<Product> {
    const cacheKey = `product_${id}`;
    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);

    if (cachedProduct) {
      this.logger.log(`Returning cached product with ID: ${id}`);
      return plainToClass(Product, cachedProduct);
    }

    const product = await this.productRepository.findOne({ where: { id }, relations: ['inventory', 'reviews', 'reviews.user', 'discounts', 'categories'] });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.cacheManager.set(cacheKey, product, 10000) ;
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, price, inventory, reviews, discounts, categories } = createProductDto;

    const product = this.productRepository.create({ name, price });
    const newProduct = await this.productRepository.save(product);

    if (inventory) {
      const inventoryEntities = inventory.map(item => {
        const inventoryEntity = new ProductInventory();
        inventoryEntity.stock = item.stock;
        inventoryEntity.product = newProduct;
        return inventoryEntity;
      });
      await this.productInventoryRepository.save(inventoryEntities);
      newProduct.inventory = inventoryEntities;
    }

    if (reviews) {
      const reviewEntities = await Promise.all(reviews.map(async item => {
        const user = await this.userRepository.findOne({ where: { id: item.userId } });
        if (!user) {
          throw new NotFoundException(`User not found: ${item.userId}`);
        }
        const reviewEntity = new ProductReviews();
        reviewEntity.rating = item.rating;
        reviewEntity.comment = item.comment;
        reviewEntity.product = newProduct;
        reviewEntity.user = user;
        return reviewEntity;
      }));
      await this.productReviewsRepository.save(reviewEntities);
      newProduct.reviews = reviewEntities;
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
      newProduct.discounts = discountEntities;
    }

    if (categories) {
      const categoryEntities = await Promise.all(categories.map(async categoryId => {
        const categoryEntity = await this.productCategoriesRepository.findOne({ where: { id: categoryId } });
        if (!categoryEntity) {
          throw new NotFoundException(`Category not found: ${categoryId}`);
        }
        return categoryEntity;
      }));
      newProduct.categories = categoryEntities;
    }

    await this.productRepository.save(newProduct);
    await this.cacheManager.del('products');
    return this.findOne(newProduct.id);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const { name, price, inventory, reviews, discounts, categories } = updateProductDto;

    const product = await this.productRepository.findOne({ where: { id }, relations: ['inventory', 'reviews', 'reviews.user', 'discounts', 'categories'] });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;

    if (inventory) {
      await this.productInventoryRepository.delete({ product });
      const inventoryEntities = inventory.map(item => {
        const inventoryEntity = new ProductInventory();
        inventoryEntity.stock = item.stock;
        inventoryEntity.product = product;
        return inventoryEntity;
      });
      await this.productInventoryRepository.save(inventoryEntities);
      product.inventory = inventoryEntities;
    }

    if (reviews) {
      await this.productReviewsRepository.delete({ product });
      const reviewEntities = await Promise.all(reviews.map(async item => {
        const user = await this.userRepository.findOne({ where: { id: item.userId } });
        if (!user) {
          throw new NotFoundException(`User not found: ${item.userId}`);
        }
        const reviewEntity = new ProductReviews();
        reviewEntity.rating = item.rating;
        reviewEntity.comment = item.comment;
        reviewEntity.product = product;
        reviewEntity.user = user;
        return reviewEntity;
      }));
      await this.productReviewsRepository.save(reviewEntities);
      product.reviews = reviewEntities;
    }

    if (discounts) {
      await this.discountsRepository.delete({ product });
      const discountEntities = discounts.map(item => {
        const discountEntity = new Discounts();
        discountEntity.discount = item.discount;
        discountEntity.expires_at = new Date(item.expires_at);
        discountEntity.product = product;
        return discountEntity;
      });
      await this.discountsRepository.save(discountEntities);
      product.discounts = discountEntities;
    }

    if (categories) {
      const categoryEntities = await Promise.all(categories.map(async categoryId => {
        const categoryEntity = await this.productCategoriesRepository.findOne({ where: { id: categoryId } });
        if (!categoryEntity) {
          throw new NotFoundException(`Category not found: ${categoryId}`);
        }
        return categoryEntity;
      }));
      product.categories = categoryEntities;
    }

    await this.productRepository.save(product);
    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('products');
    return this.findOne(product.id);
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['inventory', 'reviews', 'discounts', 'categories'] });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productInventoryRepository.delete({ product });
    await this.productReviewsRepository.delete({ product });
    await this.discountsRepository.delete({ product });

    await this.productRepository.delete(id);
    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('products');
  }
}
