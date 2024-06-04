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

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductInventory) private readonly productInventoryRepository: Repository<ProductInventory>,
    @InjectRepository(ProductReviews) private readonly productReviewsRepository: Repository<ProductReviews>,
    @InjectRepository(Discounts) private readonly discountsRepository: Repository<Discounts>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(SpecsSmartphone) private readonly specsSmartphoneRepository: Repository<SpecsSmartphone>,
    @InjectRepository(SpecsLaptop) private readonly specsLaptopRepository: Repository<SpecsLaptop>,
    @InjectRepository(SpecsTablet) private readonly specsTabletRepository: Repository<SpecsTablet>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['inventory', 'reviews', 'reviews.user', 'discounts', 'laptopSpecs', 'smartphoneSpecs', 'tabletSpecs'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['inventory', 'reviews', 'reviews.user', 'discounts', 'laptopSpecs', 'smartphoneSpecs', 'tabletSpecs'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, price, inventory, reviews, discounts, category, tabletSpecs, smartphoneSpecs, LaptopSpecs } = createProductDto;

    const product = this.productRepository.create({ name, price, category});
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

    if (smartphoneSpecs) {
      const specsSmartphoneEntity = new SpecsSmartphone();
      Object.assign(specsSmartphoneEntity, smartphoneSpecs);
      specsSmartphoneEntity.product = newProduct;
      await this.specsSmartphoneRepository.save(specsSmartphoneEntity);
      newProduct.smartphoneSpecs = specsSmartphoneEntity;
    }

    if (LaptopSpecs) {
      const specsLaptopEntity = new SpecsLaptop();
      Object.assign(specsLaptopEntity, LaptopSpecs);
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
    return this.findOne(newProduct.id);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const { name, price, category, tabletSpecs, smartphoneSpecs, laptopSpecs} = updateProductDto;

    let product = await this.productRepository.findOne({where: {id} ,
      relations: ['inventory', 'reviews', 'discounts', 'laptopSpecs', 'smartphoneSpecs', 'tabletSpecs'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.category = category ?? product.category;

    if (smartphoneSpecs) {
      if (!product.smartphoneSpecs) {
        product.smartphoneSpecs = new SpecsSmartphone();
      }
      Object.assign(product.smartphoneSpecs, smartphoneSpecs);
      product.smartphoneSpecs.product = product
      await this.specsSmartphoneRepository.save(product.smartphoneSpecs);
    } else if (product.smartphoneSpecs) {
      await this.specsSmartphoneRepository.remove(product.smartphoneSpecs);
      product.smartphoneSpecs = null;
    }

    if (laptopSpecs) {
      if (!product.laptopSpecs) {
        product.laptopSpecs = new SpecsLaptop();
      }
      Object.assign(product.laptopSpecs, laptopSpecs);
      product.laptopSpecs.product = product;
      await this.specsLaptopRepository.save(product.laptopSpecs);
    } else if (product.laptopSpecs) {
      await this.specsLaptopRepository.remove(product.laptopSpecs);
      product.laptopSpecs = null;
    }

    if (tabletSpecs) {
      if (!product.tabletSpecs) {
        product.tabletSpecs = new SpecsTablet();
      }
      Object.assign(product.tabletSpecs, tabletSpecs);
      product.tabletSpecs.product = product
      await this.specsTabletRepository.save(product.tabletSpecs);
    } else if (product.tabletSpecs) {
      await this.specsTabletRepository.remove(product.tabletSpecs);
      product.tabletSpecs = null;
    }

    await this.productRepository.save(product);

    return this.productRepository.findOne({where: {id}, 
      relations: ['inventory', 'reviews', 'discounts', 'laptopSpecs', 'smartphoneSpecs', 'tabletSpecs'],
    });
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['inventory', 'reviews', 'discounts', 'laptopSpecs', 'smartphoneSpecs', 'tabletSpecs'],
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