import { z } from 'zod';
export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').optional(),
        phone: z.string().optional(),
        profileImage: z.string().url('Invalid URL').optional(),
    }),
});
export const updateUserStatusSchema = z.object({
    body: z.object({
        status: z.enum(['ACTIVE', 'BANNED']),
    }),
});
//# sourceMappingURL=users.validation.js.map