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
//# sourceMappingURL=payments.validation.js.map