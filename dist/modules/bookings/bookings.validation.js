import { z } from 'zod';
export const createBookingSchema = z.object({
    body: z.object({
        serviceId: z.string().min(1, 'Service ID is required'),
        scheduledAt: z.string().datetime({ message: 'Invalid date format' }),
        notes: z.string().optional(),
    }),
});
export const updateBookingStatusSchema = z.object({
    body: z.object({
        status: z.enum(['ACCEPTED', 'DECLINED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
    }),
});
//# sourceMappingURL=bookings.validation.js.map