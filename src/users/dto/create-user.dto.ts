import { IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateAddressDto {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

class CreateUserDetailsDto {
  address: string;
  phone: string;
}

class CreateReviewDto {
  rating: number;
  comment: string;
  productId: string;
}

export class CreateUserDto {
  username: string;
  @IsEmail()
  email: string;
  password: string;
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  addresses?: CreateAddressDto[];
  @ValidateNested({ each: true })
  @Type(() => CreateUserDetailsDto)
  details?: CreateUserDetailsDto[];
  userRole?: string;
  @ValidateNested({ each: true })
  @Type(() => CreateReviewDto)
  reviews?: CreateReviewDto[];
}
