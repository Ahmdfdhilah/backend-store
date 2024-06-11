import { z } from 'zod';

const UpdateAddressDtoSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional()
});

const UpdateUserDetailsDtoSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  imgSrc: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
});

const UpdateReviewDtoSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export const UpdateUserDtoSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  addresses: z.array(UpdateAddressDtoSchema).optional(),
  details: z.array(UpdateUserDetailsDtoSchema).optional(),
  userRole: z.string().optional(),
  reviews: z.array(UpdateReviewDtoSchema).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
export type UpdateUserAddressDto = z.infer<typeof UpdateAddressDtoSchema>;
