import { z } from 'zod';

export const CreateOrderItemDtoSchema = z.object({
  productId: z.string(),  
  quantity: z.number(),   
  color: z.string(),            
});

const VaNumberSchema = z.object({
  bank: z.string(),
  va_number: z.string(),
});

export const CreateOrderStatusDtoSchema = z.object({
  transaction_id: z.string().nullable(),
  gross_amount: z.string().nullable(),
  currency: z.string().nullable(),
  payment_type: z.string().nullable(),
  signature_key: z.string().nullable(),
  transaction_status: z.string().nullable(),
  fraud_status: z.string().nullable(),
  status_message: z.string().nullable(),
  merchant_id: z.string().nullable(),
  va_numbers: z.array(VaNumberSchema).nullable(),
  payment_amounts: z.array(z.any()).nullable(),
  transaction_time: z.string().nullable(),
  settlement_time: z.string().nullable(),
  expiry_time: z.string().nullable(),
  updated_at: z.date().nullable(),
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
  shippingCost: z.number(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderDtoSchema>;
export type CreatePriceShippingDto = z.infer<typeof CreatePriceShippingDtoSchema>;
