import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<Product[]> {
    const cacheKey = 'products';
    const cachedProducts = await this.cacheManager.get<Product[]>(cacheKey);

    if (cachedProducts) {
      this.logger.log(`Returning cached product`);
      return cachedProducts
    }

    const products = await this.productRepository.find();
    this.logger.log('Setting products to cache');
    await this.cacheManager.set(cacheKey, products, 10000000000);
    return products;
  }

  async findOne(id: string): Promise<Product> {
    const cacheKey = `product_${id}`;
    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);

    if (cachedProduct) {
      this.logger.log(`Returning cached product with ID: ${id}`);
      cachedProduct
    }

    const product = await this.productRepository.findOne({ where: { id } });
    this.logger.log(`Setting product with ID: ${id} to cache`);
    await this.cacheManager.set(cacheKey, product, 10000); 
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const newProduct = await this.productRepository.save(product);
    this.logger.log('Product created:', JSON.stringify(newProduct));
    await this.cacheManager.del('products');
    this.logger.log('Cleared allProducts cache');
    return newProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    const updatedProduct = await this.productRepository.findOne({ where: { id } });
    this.logger.log(`Product updated with ID: ${id}`, JSON.stringify(updatedProduct));
    await this.cacheManager.del('allProducts');
    await this.cacheManager.del(`product_${id}`);
    this.logger.log(`Cleared cache for product with ID: ${id}`);
    return updatedProduct;
  }


  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
    this.logger.log(`Product removed with ID: ${id}`);
    await this.cacheManager.del('products');
    await this.cacheManager.del(`product_${id}`);
    this.logger.log(`Cleared cache for product with ID: ${id}`);
  }
}
