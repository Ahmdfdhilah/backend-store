import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { ProductReviewsService } from './product-review.service';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';

@Controller('products/product-reviews')
export class ProductReviewsController {
  constructor(private readonly productReviewsService: ProductReviewsService) {}

  @Get()
  async findAll() {
    return await this.productReviewsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const review = await this.productReviewsService.findOne(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  @Post()
  async create(@Body() createProductReviewDto: CreateProductReviewDto) {
    return await this.productReviewsService.create(createProductReviewDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductReviewDto: UpdateProductReviewDto) {
    return await this.productReviewsService.update(id, updateProductReviewDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productReviewsService.remove(id);
  }
}
