import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethods } from '../entities/orders-related/payment-methods.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethods)
    private readonly paymentMethodsRepository: Repository<PaymentMethods>,
  ) {}

  async create(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethods> {
    const paymentMethod = this.paymentMethodsRepository.create(createPaymentMethodDto);
    return this.paymentMethodsRepository.save(paymentMethod);
  }

  async findAll(): Promise<PaymentMethods[]> {
    return this.paymentMethodsRepository.find();
  }

  async findOne(id: string): Promise<PaymentMethods> {
    const paymentMethod = await this.paymentMethodsRepository.findOne({where: {id}});
    if (!paymentMethod) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }
    return paymentMethod;
  }

  async update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto): Promise<PaymentMethods> {
    const paymentMethod = await this.paymentMethodsRepository.preload({
      id,
      ...updatePaymentMethodDto,
    });
    if (!paymentMethod) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }
    return this.paymentMethodsRepository.save(paymentMethod);
  }

  async remove(id: string): Promise<void> {
    const paymentMethod = await this.findOne(id);
    await this.paymentMethodsRepository.remove(paymentMethod);
  }
}
