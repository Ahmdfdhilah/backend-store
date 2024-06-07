import { z } from 'zod';

export const CreateProductReviewDtoSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string(),
  productId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type CreateProductReviewDto = z.infer<typeof CreateProductReviewDtoSchema>;
