import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CategoryService } from './product-categories.service';
import { CreateCategoryDto } from './dto/create-product-categories.dto';
import { UpdateCategoryDto } from './dto/update-product-categories.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(id);
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(id);
  }
}
