import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1, 'Booking ID is required'),
  }),
});

export const confirmPaymentSchema = z.object({
  body: z.object({
    paymentIntentId: z.string().min(1, 'Payment Intent ID is required'),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>['body'];
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>['body'];
