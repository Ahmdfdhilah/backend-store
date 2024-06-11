import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { CreateUserDetailsDto } from './dto/create-user-details.dto';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';

@Controller('users/details-user')
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) {}

  @Get(':userId')
  async findOneByUserId(@Param('userId') userId: string) {
    return await this.userDetailsService.findByUserId(userId);
  }

  @Post(':userId')
  async create(@Param('userId') userId: string, @Body() createUserDetailsDto: CreateUserDetailsDto) {
    return await this.userDetailsService.create(userId, createUserDetailsDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDetailsDto: UpdateUserDetailsDto) {
    return await this.userDetailsService.update(id, updateUserDetailsDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userDetailsService.remove(id);
  }
}
