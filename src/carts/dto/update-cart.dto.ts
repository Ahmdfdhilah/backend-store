import { z } from 'zod';

export const UpdateCartItemDtoSchema = z.object({
  productId: z.string(),  
  quantity: z.number(),   
});

export const UpdateCartDtoSchema = z.object({
  userId: z.string().optional(),                   
  items: z.array(UpdateCartItemDtoSchema),          
});

export type UpdateCartItemDto = z.infer<typeof UpdateCartItemDtoSchema>;

export type UpdateCartDto = z.infer<typeof UpdateCartDtoSchema>;
