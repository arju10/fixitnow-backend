import { z } from 'zod';
export declare const createPaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        bookingId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const confirmPaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        paymentIntentId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>['body'];
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>['body'];
//# sourceMappingURL=payments.validation.d.ts.map