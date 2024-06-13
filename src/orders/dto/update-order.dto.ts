import { z } from 'zod';
import { CreateOrderItemDtoSchema, CreateOrderStatusDtoSchema, CreateShippingDetailsDtoSchema, CreatePaymentsDtoSchema } from './create-order.dto';

export const UpdateOrderDtoSchema = z.object({
  userId: z.string(),                        
  total: z.number(),                          
  couponsId: z.string().optional(),            
  items: z.array(CreateOrderItemDtoSchema), 
  statusHistory: z.array(CreateOrderStatusDtoSchema), 
  shippingDetails: CreateShippingDetailsDtoSchema, 
  payments: z.array(CreatePaymentsDtoSchema), 
  shippingCost: z.number(),
});

export type UpdateOrderDto = z.infer<typeof UpdateOrderDtoSchema>;
