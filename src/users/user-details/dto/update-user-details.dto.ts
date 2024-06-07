import { z } from 'zod';

export const UserDetailSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
});

export type UpdateUserDetailsDto = z.infer<typeof UserDetailSchema>;
