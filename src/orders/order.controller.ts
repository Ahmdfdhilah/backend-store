import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, CreatePriceShippingDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.orderService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  //ini untuk controller cek ke midtrans
  @Get(':id/update-status-from-midtrans')
  async updateOrderStatusFromMidtrans(@Param('id') id: string) {
    return this.orderService.updateOrderStatusFromMidtrans(id);
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

