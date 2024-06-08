import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, CreatePriceShippingDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('orders')
// @UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get(':id/status')
  async getOrderStatus(@Param('id') id: string) {
    return await this.orderService.getStatus(id);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
  //ini controller untuk ongkir atau shipping
  @Get('shipping/province')
  async getProvince() {
    return await this.orderService.getProvince();
  }
  @Get('shipping/province/:id')
  async getProvinceById(@Param('id') id: string) {
    return await this.orderService.getProvinceById(id);
  }
  @Get('shipping/city')
  async getCity() {
    return await this.orderService.getCity();
  }
  @Get('shipping/city/:id')
  async getCityById(@Param('id') id: string) {
    return await this.orderService.getCityById(id);
  }
  @Post('shipping/price')
  getPrice(@Body() createPriceShipping: CreatePriceShippingDto) {
    return this.orderService.getPrice(createPriceShipping);
  }
}

