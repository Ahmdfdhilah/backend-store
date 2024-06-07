import { z } from 'zod';

export const UserDetailSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string(),
  phone: z.string(),
  country: z.string(),
});

export type CreateUserDetailsDto = z.infer<typeof UserDetailSchema>;
