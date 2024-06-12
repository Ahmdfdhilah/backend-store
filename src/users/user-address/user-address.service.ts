import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddress } from 'src/entities/users-related/user-address.entity';
import { UpdateUserAddressDto } from '../dto/update-user.dto';
import { CreateUserAddressDto } from '../dto/create-user.dto';
import { User } from 'src/entities/users-related/user.entity';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress) private readonly userAddressRepository: Repository<UserAddress>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async findByUserId(userId: string): Promise<UserAddress[]> {
    const userAddress = await this.userAddressRepository.find({ where: { user: { id: userId } }, relations: ['user'] });
    return userAddress;
  }

  async create(userId: string, createUserAddressDto: CreateUserAddressDto): Promise<UserAddress> {
    const { street, city, state, country, postalCode } = createUserAddressDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    const address = this.userAddressRepository.create({ street, city, state, country, postalCode, user });
    return await this.userAddressRepository.save(address);
  }

  async update(userId: string, updateUserAddressDto: UpdateUserAddressDto): Promise<UserAddress> {
    const { street, city, state, country, postalCode } = updateUserAddressDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User not found: ${userId}`);
    }
    await this.userAddressRepository.delete({ user });
    
    const address = this.userAddressRepository.create({
      street: street ? street : user.addresses[0].street,
      city: city ? city : user.addresses[0].city,
      state: state ? state : user.addresses[0].state,
      country: country ? country : user.addresses[0].country,
      postalCode: postalCode ? postalCode : user.addresses[0].postalCode,
      user });

    return await this.userAddressRepository.save(address);
  }

  async removeById(id: string): Promise<void> {
    const address = await this.userAddressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    await this.userAddressRepository.remove(address);
  }
}
