import { z } from 'zod';
export const createServiceSchema = z.object({
    body: z.object({
        title: z.string().min(3, 'Title must be at least 3 characters'),
        description: z.string().optional(),
        price: z.number().positive('Price must be positive'),
        durationMins: z.number().positive('Duration must be positive').optional(),
        categoryId: z.string().min(1, 'Category ID is required'),
    }),
});
export const updateServiceSchema = z.object({
    body: z.object({
        title: z.string().min(3, 'Title must be at least 3 characters').optional(),
        description: z.string().optional(),
        price: z.number().positive('Price must be positive').optional(),
        durationMins: z.number().positive('Duration must be positive').optional(),
        categoryId: z.string().optional(),
        isActive: z.boolean().optional(), // 👈 Add this
    }),
});
//# sourceMappingURL=services.validation.js.map