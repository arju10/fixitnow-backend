import { z } from 'zod';
import { PaymentProvider } from '@prisma/client';

export const createPaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid('Invalid booking ID format'),
    provider: z.enum([PaymentProvider.STRIPE, PaymentProvider.SSLCOMMERZ]),
  }),
});

export const confirmPaymentSchema = z.object({
  body: z.object({
    transactionId: z.string().min(1, 'Transaction ID is required'),
  }),
});

export const paymentWebhookSchema = z.object({
  body: z.object({
    event: z.string(),
    data: z.any(),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>['body'];
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>['body'];
export type PaymentWebhookInput = z.infer<typeof paymentWebhookSchema>['body'];
