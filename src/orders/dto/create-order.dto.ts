import { z } from 'zod';

export const CreateOrderItemDtoSchema = z.object({
  productId: z.string(),  
  quantity: z.number(),   
});

export const CreateOrderStatusDtoSchema = z.object({
  status: z.string(),         
  updated_at: z.date(),     
});

export const CreateShippingDetailsDtoSchema = z.object({
  address: z.string(),        
  city: z.string(),           
  postalCode: z.string(),     
  country: z.string(),        
});

export const CreatePaymentsDtoSchema = z.object({
  amount: z.number(),         
  method: z.string(),         
  status: z.string(),         
  paid_at: z.date(),        
});

export const CreatePriceShippingDtoSchema = z.object({
  origin: z.string(),         
  destination: z.string(),    
  weight: z.number(),         
  courier: z.string(),        
});

export const CreateOrderDtoSchema = z.object({
  userId: z.string(),              
  total: z.number(),               
  couponsId: z.string().optional(),          
  items: z.array(CreateOrderItemDtoSchema),    
  statusHistory: z.array(CreateOrderStatusDtoSchema),
  shippingDetails: CreateShippingDetailsDtoSchema,  
  payments: z.array(CreatePaymentsDtoSchema), 
});

export type CreateOrderDto = z.infer<typeof CreateOrderDtoSchema>;
export type CreatePriceShippingDto = z.infer<typeof CreatePriceShippingDtoSchema>;
