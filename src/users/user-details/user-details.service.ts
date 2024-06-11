import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDetails } from 'src/entities/users-related/user-details.entity';
import { CreateUserDetailsDto } from './dto/create-user-details.dto';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';
import { User } from 'src/entities/users-related/user.entity';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectRepository(UserDetails) private readonly userDetailsRepository: Repository<UserDetails>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findByUserId(userId: string): Promise<UserDetails> {
    const userDetails = await this.userDetailsRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] });
    if (!userDetails) {
      throw new NotFoundException(`UserDetails with User ID ${userId} not found`);
    }
    return userDetails;
  }

  async create(userId: string, createUserDetailsDto: CreateUserDetailsDto): Promise<UserDetails> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    const userDetails = this.userDetailsRepository.create({ ...createUserDetailsDto, user });
    return await this.userDetailsRepository.save(userDetails);
  }

  async update(id: string, updateUserDetailsDto: UpdateUserDetailsDto): Promise<UserDetails> {
    const userDetails = await this.userDetailsRepository.findOne({ where: { id }, relations: ['user'] });
    if (!userDetails) {
      throw new NotFoundException(`UserDetails with ID ${id} not found`);
    }

    Object.assign(userDetails, updateUserDetailsDto);
    return await this.userDetailsRepository.save(userDetails);
  }

  async remove(id: string): Promise<void> {
    const userDetails = await this.userDetailsRepository.findOne({ where: { id }, relations: ['user'] });
    if (!userDetails) {
      throw new NotFoundException(`UserDetails with ID ${id} not found`);
    }

    await this.userDetailsRepository.remove(userDetails);
  }
}
