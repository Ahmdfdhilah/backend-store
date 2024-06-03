import { IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateAddressDto {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

class UpdateUserDetailsDto {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  country?: string;
  phone?: string;
}

class UpdateReviewDto {
  rating?: number;
  comment?: string;
}

export class UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  @ValidateNested({ each: true })
  @Type(() => UpdateAddressDto)
  addresses?: UpdateAddressDto[];
  @ValidateNested({ each: true })
  @Type(() => UpdateUserDetailsDto)
  details?: UpdateUserDetailsDto[];
  userRole?: string;
  @ValidateNested({ each: true })
  @Type(() => UpdateReviewDto)
  reviews?: UpdateReviewDto[];
}
