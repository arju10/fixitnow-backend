import { z } from 'zod';
export declare const createBookingSchema: z.ZodObject<{
    body: z.ZodObject<{
        serviceId: z.ZodString;
        scheduledAt: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateBookingStatusSchema: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodEnum<{
            ACCEPTED: "ACCEPTED";
            DECLINED: "DECLINED";
            IN_PROGRESS: "IN_PROGRESS";
            COMPLETED: "COMPLETED";
            CANCELLED: "CANCELLED";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>['body'];
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>['body'];
//# sourceMappingURL=bookings.validation.d.ts.map