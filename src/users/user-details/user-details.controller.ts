import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { CreateUserDetailsDto } from './dto/create-user-details.dto';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';
import { UserDetails } from 'src/entities/users-related/user-details.entity';

@Controller('user-details')
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) {}

  @Get()
  async findAll(): Promise<UserDetails[]> {
    return this.userDetailsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDetails> {
    return this.userDetailsService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateUserDetailsDto): Promise<UserDetails> {
    return this.userDetailsService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDetailsDto,
  ): Promise<UserDetails> {
    return this.userDetailsService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.userDetailsService.remove(id);
  }
}
