import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { UpdateUserAddressDto } from '../dto/update-user.dto';
import { CreateUserAddressDto } from '../dto/create-user.dto';

@Controller('user-addresses')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Get(':userId')
  async findByUserId(@Param('userId') userId: string) {
    return await this.userAddressService.findByUserId(userId);
  }

  @Post(':userId')
  async createForUser(@Param('userId') userId: string, @Body() createUserAddressDto: CreateUserAddressDto) {
    return await this.userAddressService.create(userId, createUserAddressDto);
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() updateUserAddressDto: UpdateUserAddressDto) {
    return await this.userAddressService.update(id, updateUserAddressDto);
  }

  @Delete(':id')
  async removeById(@Param('id') id: string) {
    return await this.userAddressService.removeById(id);
  }
}
