import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategories } from '../entities/products-related/product-categories.entity';
import { CreateCategoryDto } from './dto/create-product-categories.dto';
import { UpdateCategoryDto } from './dto/update-product-categories.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(ProductCategories)
    private readonly categoryRepository: Repository<ProductCategories>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<ProductCategories[]> {
    const cacheKey = 'categories';
    const cachedCategories = await this.cacheManager.get<ProductCategories[]>(cacheKey);

    if (cachedCategories) {
      this.logger.log('Returning cached categories');
      return plainToClass(ProductCategories, cachedCategories);
    }

    const categories = await this.categoryRepository.find();
    await this.cacheManager.set(cacheKey, categories, 10000 );
    return categories;
  }

  async findOne(id: string): Promise<ProductCategories> {
    const cacheKey = `category_${id}`;
    const cachedCategory = await this.cacheManager.get<ProductCategories>(cacheKey);

    if (cachedCategory) {
      this.logger.log(`Returning cached category with ID: ${id}`);
      return plainToClass(ProductCategories, cachedCategory);
    }

    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    await this.cacheManager.set(cacheKey, category, 10000);
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<ProductCategories> {
    const category = this.categoryRepository.create(createCategoryDto);
    const newCategory = await this.categoryRepository.save(category);

    await this.cacheManager.del('categories');
    this.logger.log('Cleared allCategories cache');
    return newCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<ProductCategories> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    Object.assign(category, updateCategoryDto);
    const updatedCategory = await this.categoryRepository.save(category);

    await this.cacheManager.del(`category_${id}`);
    await this.cacheManager.del('categories');
    this.logger.log(`Cleared cache for category with ID: ${id}`);
    return updatedCategory;
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    await this.categoryRepository.delete(id);

    await this.cacheManager.del(`category_${id}`);
    await this.cacheManager.del('categories');
    this.logger.log(`Cleared cache for category with ID: ${id}`);
  }
}
