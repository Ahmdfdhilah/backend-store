import { z } from 'zod';

const CreateAddressDtoSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
});

const CreateUserDetailsDtoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  imgSrc: z.string(),
  gender: z.string(),
  birthDate: z.string(),
});

const CreateReviewDtoSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string(),
  productId: z.string(),
});

export const CreateUserDtoSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  addresses: z.array(CreateAddressDtoSchema).optional(),
  details: z.array(CreateUserDetailsDtoSchema).optional(),
  userRole: z.string().optional(),
  reviews: z.array(CreateReviewDtoSchema).optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
export type CreateUserAddressDto = z.infer<typeof CreateAddressDtoSchema>;
