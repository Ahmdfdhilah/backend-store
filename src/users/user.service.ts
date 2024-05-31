import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<User[]> {
    const cacheKey = 'users';
    const cachedUsers = await this.cacheManager.get<User []>(cacheKey);

    if (cachedUsers) {
      this.logger.log('Returning cached users');
      return cachedUsers
    }

    const users = await this.userRepository.find();
    this.logger.log('Setting users to cache');
    await this.cacheManager.set(cacheKey, users, 10000); 
    return users;
  }

  async findByUsername(username: string): Promise<User> {
    const cacheKey = `user_username_${username}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);

    if (cachedUser) {
      this.logger.log(`Returning cached user with username: ${username}`);
      return cachedUser;
    }

    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      this.logger.log(`Setting user with email: ${username} to cache`);
      await this.cacheManager.set(cacheKey, JSON.stringify(user), 10000); 
    }
    return user;
  }

  async findOne(id: string): Promise<User> {
    const cacheKey = `user_${id}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);

    if (cachedUser) {
      this.logger.log(`Returning cached user with ID: ${id}`);
      return cachedUser
    }

    const user = await this.userRepository.findOne({ where: { id } });
    this.logger.log(`Setting user with ID: ${id} to cache`);
    await this.cacheManager.set(cacheKey, JSON.stringify(user), 10000); 
    return user;
  }


  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({ ...createUserDto});
    const newUser = await this.userRepository.save(user);
    this.logger.log('User created:', JSON.stringify(newUser));
    await this.cacheManager.del('users');
    this.logger.log('Cleared allUsers cache');
    return newUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    this.logger.log(`User updated with ID: ${id}`, JSON.stringify(updatedUser));
    await this.cacheManager.del('users');
    await this.cacheManager.del(`user_${id}`);
    this.logger.log(`Cleared cache for user with ID: ${id}`);
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
    this.logger.log(`User removed with ID: ${id}`);
    await this.cacheManager.del('users');
    await this.cacheManager.del(`user_${id}`);
    this.logger.log(`Cleared cache for user with ID: ${id}`);
  }
}