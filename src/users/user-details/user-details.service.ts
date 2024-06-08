import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDetails } from 'src/entities/users-related/user-details.entity';
import { CreateUserDetailsDto } from './dto/create-user-details.dto';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class UserDetailsService {
  private readonly logger = new Logger(UserDetailsService.name);

  constructor(
    @InjectRepository(UserDetails) private readonly userDetailsRepository: Repository<UserDetails>,
    private readonly cacheManager: Cache,
  ){}

  async findAll(): Promise<UserDetails[]> {
    const cacheKey = 'user-details';
    const cachedUserDetails = await this.cacheManager.get<UserDetails[]>(cacheKey);

    if (cachedUserDetails) {
      this.logger.log('Returning cached user details');
      return cachedUserDetails;
    }

    const userDetails = await this.userDetailsRepository.find();
    this.logger.log('Setting user details to cache');
    await this.cacheManager.set(cacheKey, userDetails, 10000 );
    return userDetails;
  }

  async findOne(id: string): Promise<UserDetails> {
    const cacheKey = `user-details:${id}`;
    const cachedUserDetail = await this.cacheManager.get<UserDetails>(cacheKey);

    if (cachedUserDetail) {
      this.logger.log(`Returning cached user details with ID: ${id}`);
      return cachedUserDetail;
    }

    const userDetails = await this.userDetailsRepository.findOne({where: {id: id}});
    if (!userDetails) {
      throw new NotFoundException(`User details with ID ${id} not found`);
    }
    this.logger.log(`Setting user details with ID: ${id} to cache`);
    await this.cacheManager.set(cacheKey, userDetails, 10000 );
    return userDetails;
  }

  async create(createUserDetailsDto: CreateUserDetailsDto): Promise<UserDetails> {
    const newUserDetails = this.userDetailsRepository.create(createUserDetailsDto);
    const savedUserDetails = await this.userDetailsRepository.save(newUserDetails);

    await this.cacheManager.del('user-details');
    this.logger.log('Cleared user details cache');
    
    return savedUserDetails;
  }

  async update(id: string, updateUserDetailsDto: UpdateUserDetailsDto): Promise<UserDetails> {
    const existingUserDetails = await this.userDetailsRepository.findOne({where: {id: id}});
    if (!existingUserDetails) {
      throw new NotFoundException(`User details with ID ${id} not found`);
    }

    await this.userDetailsRepository.update(id, updateUserDetailsDto);

    await this.cacheManager.del('user-details');
    this.logger.log('Cleared user details cache');

    return this.userDetailsRepository.findOne({where:{id:id}});
  }

  async remove(id: string): Promise<void> {
    const existingUserDetails = await this.userDetailsRepository.findOne({where:{id:id}});
    if (!existingUserDetails) {
      throw new NotFoundException(`User details with ID ${id} not found`);
    }
    await this.userDetailsRepository.delete(id);

    await this.cacheManager.del('user-details');
    this.logger.log('Cleared user details cache');
  }
}
