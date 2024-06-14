import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/products-related/product.entity';
import { ProductInventory } from '../entities/products-related/product-inventory.entity';
import { ProductReviews } from '../entities/products-related/product-reviews.entity';
import { Discounts } from '../entities/products-related/discounts.entity';
import { User } from 'src/entities/users-related/user.entity';
import { SpecsSmartphone } from 'src/entities/products-related/specs/specs-smartphone.entity';
import { SpecsLaptop } from 'src/entities/products-related/specs/specs-laptop.entity';
import { SpecsTablet } from 'src/entities/products-related/specs/specs-tablet.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductInventory) private readonly productInventoryRepository: Repository<ProductInventory>,
    @InjectRepository(ProductReviews) private readonly productReviewsRepository: Repository<ProductReviews>,
    @InjectRepository(Discounts) private readonly discountsRepository: Repository<Discounts>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(SpecsSmartphone) private readonly specsSmartphoneRepository: Repository<SpecsSmartphone>,
    @InjectRepository(SpecsLaptop) private readonly specsLaptopRepository: Repository<SpecsLaptop>,
    @InjectRepository(SpecsTablet) private readonly specsTabletRepository: Repository<SpecsTablet>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async findAll(): Promise<Product[]> {
    const cacheKey = 'products';
    const cachedProducts = await this.cacheManager.get<Product[]>(cacheKey);

    if (cachedProducts) {
      this.logger.log('Returning cached products');
      return cachedProducts;
    }

    const products = await this.productRepository.find({
      relations: ['reviews', 'discounts', 'laptopSpecs', 'smartphoneSpecs', 'tabletSpecs'],
    });
    this.logger.log('Setting products to cache');
    await this.cacheManager.set(cacheKey, products, 10000);
    return products;
  }

  async findOne(id: string): Promise<Product> {
    const cacheKey = `product_${id}`;
    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);

    if (cachedProduct) {
      this.logger.log(`Returning cached product with ID: ${id}`);
      return cachedProduct;
    }

    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['reviews', 'discounts', 'laptopSpecs', 'smartphoneSpecs', 'tabletSpecs'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.logger.log(`Setting product with ID: ${id} to cache`);
    await this.cacheManager.set(cacheKey, product, 10000);
    return product;
  }

  async create(createProductDto: CreateProductDto, imgSrc: string): Promise<Product> {
    const { name, price, weight, color, inventory, reviews, discounts, category, tabletSpecs, smartphoneSpecs, laptopSpecs } = createProductDto;

    const product = this.productRepository.create({ name, price, category, weight, imgSrc, color, inventory });
    const newProduct = await this.productRepository.save(product);

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

    if (smartphoneSpecs) {
      const specsSmartphoneEntity = new SpecsSmartphone();
      Object.assign(specsSmartphoneEntity, smartphoneSpecs);
      specsSmartphoneEntity.product = newProduct;
      await this.specsSmartphoneRepository.save(specsSmartphoneEntity);
      newProduct.smartphoneSpecs = specsSmartphoneEntity;
    }

    if (laptopSpecs) {
      const specsLaptopEntity = new SpecsLaptop();
      Object.assign(specsLaptopEntity, laptopSpecs);
      specsLaptopEntity.product = newProduct;
      await this.specsLaptopRepository.save(specsLaptopEntity);
      newProduct.laptopSpecs = specsLaptopEntity;
    }

    if (tabletSpecs) {
      const specsTabletEntity = new SpecsTablet();
      Object.assign(specsTabletEntity, tabletSpecs);
      specsTabletEntity.product = newProduct;
      await this.specsTabletRepository.save(specsTabletEntity);
      newProduct.tabletSpecs = specsTabletEntity;
    }
    await this.productRepository.save(newProduct);
    await this.cacheManager.del('products');
    this.logger.log('Cleared products cache');
    return this.findOne(newProduct.id);

  }

  async update(id: string, updateProductDto: UpdateProductDto, imgSrc?: string): Promise<Product> {
    const { name, price, category, color, weight, tabletSpecs, smartphoneSpecs, laptopSpecs } = updateProductDto;

    console.log(tabletSpecs, smartphoneSpecs, laptopSpecs);

    let product = await this.productRepository.findOne({
      where: { id },
      relations: ['reviews', 'discounts', 'laptopSpecs', 'smartphoneSpecs', 'tabletSpecs'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.weight = weight ?? product.weight;
    product.imgSrc = imgSrc ?? product.imgSrc;
    product.color = color ?? product.color;

    if (smartphoneSpecs !== undefined) {
      if (!product.smartphoneSpecs) {
        product.smartphoneSpecs = new SpecsSmartphone();
      }
      Object.assign(product.smartphoneSpecs, smartphoneSpecs);
      product.smartphoneSpecs.product = product
      await this.specsSmartphoneRepository.remove(product.smartphoneSpecs);
      await this.specsSmartphoneRepository.save(product.smartphoneSpecs);
    }

    if (laptopSpecs) {
      if (!product.laptopSpecs) {
        product.laptopSpecs = new SpecsLaptop();
      }
      Object.assign(product.laptopSpecs, laptopSpecs);
      product.laptopSpecs.product = product;
      await this.specsLaptopRepository.remove(product.laptopSpecs);
      await this.specsLaptopRepository.save(product.laptopSpecs);
    }

    if (tabletSpecs !== undefined) {
      if (!product.tabletSpecs) {
        product.tabletSpecs = new SpecsTablet();
      }
      Object.assign(product.tabletSpecs, tabletSpecs);
      product.tabletSpecs.product = product
      await this.specsTabletRepository.remove(product.tabletSpecs);
      await this.specsTabletRepository.save(product.tabletSpecs);
    }

    await this.productRepository.save(product);

    return this.productRepository.findOne({
      where: { id },
      relations: ['reviews', 'discounts', 'laptopSpecs', 'smartphoneSpecs', 'tabletSpecs'],
    });
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['reviews', 'discounts', 'laptopSpecs', 'smartphoneSpecs', 'tabletSpecs'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.smartphoneSpecs) {
      product.smartphoneSpecs.product = null;
      await this.specsSmartphoneRepository.save(product.smartphoneSpecs);
    }
    if (product.laptopSpecs) {
      product.laptopSpecs.product = null;
      await this.specsLaptopRepository.save(product.laptopSpecs);
    }
    if (product.tabletSpecs) {
      product.tabletSpecs.product = null;
      await this.specsTabletRepository.save(product.tabletSpecs);
    }

    if (product.smartphoneSpecs) {
      await this.specsSmartphoneRepository.remove(product.smartphoneSpecs);
    }
    if (product.laptopSpecs) {
      await this.specsLaptopRepository.remove(product.laptopSpecs);
    }
    if (product.tabletSpecs) {
      await this.specsTabletRepository.remove(product.tabletSpecs);
    }

    await this.productInventoryRepository.delete({ product });
    await this.productReviewsRepository.delete({ product });
    await this.discountsRepository.delete({ product });
    await this.productRepository.delete(id);
  }

}