import { z } from 'zod';

export const UserDetailSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  imgSrc: z.string(),
  gender: z.string(),
  birthDate: z.string(),
});

export type CreateUserDetailsDto = z.infer<typeof UserDetailSchema>;
