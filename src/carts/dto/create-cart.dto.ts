import { z } from 'zod';

const CreateCartItemDtoSchema = z.object({
  productId: z.string(), 
  quantity: z.number(),   
});

const CreateCartDtoSchema = z.object({
  userId: z.string(),                    
  items: z.array(CreateCartItemDtoSchema), 
});

export type CreateCartItemDto = z.infer<typeof CreateCartItemDtoSchema>;

export type CreateCartDto = z.infer<typeof CreateCartDtoSchema>;
