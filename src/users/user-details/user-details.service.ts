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
  ) { }

  async findByUserId(userId: string): Promise<UserDetails> {
    const userDetails = await this.userDetailsRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] });
    if (!userDetails) {
      throw new NotFoundException(`UserDetails with User ID ${userId} not found`);
    }
    return userDetails;
  }

  async create(userId: string, createUserDetailsDto: CreateUserDetailsDto, imgSrc: string): Promise<UserDetails> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const { firstName, lastName, phone, gender, birthDate } = createUserDetailsDto;
    if (!user) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    const userDetails = this.userDetailsRepository.create({
      firstName, lastName, phone, gender, birthDate, imgSrc, user: user
    });
    return await this.userDetailsRepository.save(userDetails);
  }

  async update(userId: string, updateUserDetailsDto: UpdateUserDetailsDto, imgSrc?: string): Promise<UserDetails> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['details'] });
    if (!user) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    let userDetails = await this.userDetailsRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] });
    if (!userDetails) {
      throw new NotFoundException(`UserDetails for User ID ${userId} not found`);
    }
    console.log(imgSrc);
    
    userDetails = {
      ...userDetails,
      ...updateUserDetailsDto,
      imgSrc: imgSrc ?? userDetails.imgSrc,
    };

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