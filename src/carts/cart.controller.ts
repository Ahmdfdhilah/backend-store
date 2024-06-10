import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  async findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Get('user/:userId')
  async findCartByUserId(@Param('userId') userId: string) {
    return this.cartService.findCartByUserId(userId);
  }
  
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
