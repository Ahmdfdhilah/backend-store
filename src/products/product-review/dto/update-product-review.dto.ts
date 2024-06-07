import { z } from 'zod';

export const UpdateProductReviewDtoSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export type UpdateProductReviewDto = z.infer<typeof UpdateProductReviewDtoSchema>;
