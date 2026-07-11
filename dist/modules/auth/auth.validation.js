import { z } from 'zod';
import { Role } from '@prisma/client';
export const registerSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        name: z.string().min(2, 'Name must be at least 2 characters'),
        phone: z.string().optional(),
        role: z.enum([Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN]),
    }),
});
export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(1, 'Password is required'),
    }),
});
//# sourceMappingURL=auth.validation.js.map