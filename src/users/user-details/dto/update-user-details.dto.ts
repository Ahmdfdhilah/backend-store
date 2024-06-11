import { z } from 'zod';

export const UserDetailSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  imgSrc: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
});

export type UpdateUserDetailsDto = z.infer<typeof UserDetailSchema>;
