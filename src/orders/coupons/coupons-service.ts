import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupons } from 'src/entities/orders-related/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CouponsService {
  private readonly logger = new Logger(CouponsService.name);

  constructor(
    @InjectRepository(Coupons)
    private readonly couponsRepository: Repository<Coupons>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<Coupons[]> {
    const cacheKey = 'coupons';
    const cachedCoupons = await this.cacheManager.get<Coupons[]>(cacheKey);

    if (cachedCoupons) {
      this.logger.log('Returning cached coupons');
      return plainToClass(Coupons, cachedCoupons);
    }

    const coupons = await this.couponsRepository.find();
    await this.cacheManager.set(cacheKey, coupons, 1000);
    return coupons;
  }

  async findOne(id: string): Promise<Coupons> {
    const cacheKey = `coupon_${id}`;
    const cachedCoupon = await this.cacheManager.get<Coupons>(cacheKey);

    if (cachedCoupon) {
      this.logger.log(`Returning cached coupon with ID: ${id}`);
      return plainToClass(Coupons, cachedCoupon);
    }

    const coupon = await this.couponsRepository.findOne({ where: { id } });
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    await this.cacheManager.set(cacheKey, coupon, 10000);
    return coupon;
  }

  async create(createCouponDto: CreateCouponDto): Promise<Coupons> {
    const coupon = this.couponsRepository.create(createCouponDto);
    const newCoupon = await this.couponsRepository.save(coupon);

    await this.cacheManager.del('coupons');
    this.logger.log('Cleared allCoupons cache');
    return newCoupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupons> {
    const coupon = await this.couponsRepository.findOne({ where: { id } });
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    Object.assign(coupon, updateCouponDto);
    const updatedCoupon = await this.couponsRepository.save(coupon);

    await this.cacheManager.del(`coupon_${id}`);
    await this.cacheManager.del('coupons');
    this.logger.log(`Cleared cache for coupon with ID: ${id}`);
    return updatedCoupon;
  }

  async remove(id: string): Promise<void> {
    const coupon = await this.couponsRepository.findOne({ where: { id } });
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    await this.couponsRepository.delete(id);

    await this.cacheManager.del(`coupon_${id}`);
    await this.cacheManager.del('coupons');
    this.logger.log(`Cleared cache for coupon with ID: ${id}`);
  }
}
