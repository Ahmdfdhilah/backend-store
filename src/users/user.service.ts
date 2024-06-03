import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users-related/user.entity';
import { Address } from '../entities/users-related/address.entity';
import { UserDetails } from '../entities/users-related/user-details.entity';
import { ProductReviews } from '../entities/products-related/product-reviews.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
    @InjectRepository(UserDetails) private readonly userDetailsRepository: Repository<UserDetails>,
    @InjectRepository(ProductReviews) private readonly productReviewsRepository: Repository<ProductReviews>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<User[]> {
    const cacheKey = 'users';
    const cachedUsers = await this.cacheManager.get<User[]>(cacheKey);

    if (cachedUsers) {
      this.logger.log('Returning cached users');
      return cachedUsers;
    }

    const users = await this.userRepository.find({
      relations: ['addresses', 'carts', 'orders', 'details', 'reviews'],
    });
    this.logger.log('Setting users to cache');
    await this.cacheManager.set(cacheKey, JSON.stringify(users), 100000);
    return users;
  }

  async findOne(id: string): Promise<User> {
    const cacheKey = `user_${id}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);

    if (cachedUser) {
      this.logger.log(`Returning cached user with ID: ${id}`);
      return cachedUser;
    }

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses', 'carts', 'orders', 'details', 'reviews'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.log(`Setting user with ID: ${id} to cache`);
    await this.cacheManager.set(cacheKey, JSON.stringify(user), 10000);
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, addresses, details, userRole, reviews } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, email, password: hashedPassword, userRole });
    const newUser = await this.userRepository.save(user);

    if (addresses) {
      const addressEntities = addresses.map(item => {
        const addressEntity = new Address();
        addressEntity.street = item.street;
        addressEntity.city = item.city;
        addressEntity.state = item.state;
        addressEntity.postalCode = item.postalCode;
        addressEntity.user = newUser;
        return addressEntity;
      });
      await this.addressRepository.save(addressEntities);
      newUser.addresses = addressEntities;
    }

    if (details) {
      const detailsEntities = details.map(item => {
        const detailsEntity = new UserDetails();
        detailsEntity.phone = item.phone;
        detailsEntity.country = item.country;
        detailsEntity.firstName = item.firstName;
        detailsEntity.lastName = item.lastName;
        detailsEntity.fullName = item.fullName;
        detailsEntity.user = newUser;
        return detailsEntity;
      });
      await this.userDetailsRepository.save(detailsEntities);
      newUser.details = detailsEntities;
    }

    if (reviews) {
      const reviewEntities = reviews.map(item => {
        const reviewEntity = new ProductReviews();
        reviewEntity.rating = item.rating;
        reviewEntity.comment = item.comment;
        reviewEntity.user = newUser;
        return reviewEntity;
      });
      await this.productReviewsRepository.save(reviewEntities);
      newUser.reviews = reviewEntities;
    }

    await this.userRepository.save(newUser);
    await this.cacheManager.del('users');
    this.logger.log('Cleared allUsers cache');
    return this.findOne(newUser.id);
  }

  async findByUsername(username: string): Promise<User> {
    const cacheKey = `user_username_${username}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);

    if (cachedUser) {
      this.logger.log(`Returning cached user with username: ${username}`);
      return cachedUser;
    }

    const user = await this.userRepository.findOne({ where: { username }, relations: ['addresses', 'carts', 'orders', 'details', 'reviews'] });
    if (user) {
      this.logger.log(`Setting user with username: ${username} to cache`);
      await this.cacheManager.set(cacheKey, user, 10000 );
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { username, email, password, addresses, details, userRole, reviews } = updateUserDto;

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses', 'details', 'reviews'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.username = username ?? user.username;
    user.email = email ?? user.email;
    user.userRole = userRole ?? user.userRole;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (addresses) {
      await this.addressRepository.delete({ user });
      const addressEntities = addresses.map(item => {
        const addressEntity = new Address();
        addressEntity.street = item.street;
        addressEntity.city = item.city;
        addressEntity.state = item.state;
        addressEntity.postalCode = item.postalCode;
        addressEntity.user = user;
        return addressEntity;
      });
      await this.addressRepository.save(addressEntities);
      user.addresses = addressEntities;
    }

    if (details) {
      await this.userDetailsRepository.delete({ user });
      const detailsEntities = details.map(item => {
        const detailsEntity = new UserDetails();
        detailsEntity.phone = item.phone;
        detailsEntity.country = item.country;
        detailsEntity.firstName = item.firstName;
        detailsEntity.lastName = item.lastName;
        detailsEntity.fullName = item.fullName;
        detailsEntity.user = user;
        return detailsEntity;
      });
      await this.userDetailsRepository.save(detailsEntities);
      user.details = detailsEntities;
    }

    if (reviews) {
      await this.productReviewsRepository.delete({ user });
      const reviewEntities = reviews.map(item => {
        const reviewEntity = new ProductReviews();
        reviewEntity.rating = item.rating;
        reviewEntity.comment = item.comment;
        reviewEntity.user = user;
        return reviewEntity;
      });
      await this.productReviewsRepository.save(reviewEntities);
      user.reviews = reviewEntities;
    }

    await this.userRepository.save(user);
    await this.cacheManager.del(`user_${id}`);
    await this.cacheManager.del('users');
    return this.findOne(user.id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses', 'details', 'reviews'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.addressRepository.delete({ user });
    await this.userDetailsRepository.delete({ user });
    await this.productReviewsRepository.delete({ user });

    await this.userRepository.delete(id);
    this.logger.log(`User removed with ID: ${id}`);
    await this.cacheManager.del(`user_${id}`);
    await this.cacheManager.del('users');
  }
}


