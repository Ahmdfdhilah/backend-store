import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users-related/user.entity';
import { UserAddress } from 'src/entities/users-related/user-address.entity';
import { UserDetails } from '../entities/users-related/user-details.entity';
import { ProductReviews } from '../entities/products-related/product-reviews.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserAddress) private readonly addressRepository: Repository<UserAddress>,
    @InjectRepository(UserDetails) private readonly userDetailsRepository: Repository<UserDetails>,
    @InjectRepository(ProductReviews) private readonly productReviewsRepository: Repository<ProductReviews>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['addresses', 'orders', 'details', 'reviews'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses', 'orders', 'details', 'reviews'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, addresses, details, userRole, reviews } = createUserDto;

    const user = this.userRepository.create({ username, email, password, userRole });
    await this.userRepository.save(user);

    if (addresses) {
      const addressEntities = addresses.map(item => {
        const addressEntity = new UserAddress();
        addressEntity.street = item.street;
        addressEntity.city = item.city;
        addressEntity.state = item.state;
        addressEntity.country = item.country;
        addressEntity.postalCode = item.postalCode;
        addressEntity.user = user;
        return addressEntity;
      });
      await this.addressRepository.save(addressEntities);
      user.addresses = addressEntities;
    }

    if (details) {
      const detailsEntities = details.map(item => {
        const detailsEntity = new UserDetails();
        detailsEntity.phone = item.phone;
        detailsEntity.imgSrc = item.imgSrc;
        detailsEntity.birthDate = item.birthDate;
        detailsEntity.gender = item.gender;
        detailsEntity.firstName = item.firstName;
        detailsEntity.lastName = item.lastName;
        detailsEntity.user = user;
        return detailsEntity;
      });
      await this.userDetailsRepository.save(detailsEntities);
      user.details = detailsEntities;
    }

    if (reviews) {
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
    return this.findOne(user.id);
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { username },
      relations: ['addresses', 'orders', 'details', 'reviews'],
    });
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
        const addressEntity = new UserAddress();
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
        detailsEntity.imgSrc = item.imgSrc;
        detailsEntity.birthDate = item.birthDate;
        detailsEntity.gender = item.gender;
        detailsEntity.firstName = item.firstName;
        detailsEntity.lastName = item.lastName;
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
  }
}