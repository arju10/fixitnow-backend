import { z } from 'zod';
export const updateAdminProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').optional(),
        phone: z.string().optional(),
        department: z.string().optional(),
        position: z.string().optional(),
        permissions: z.array(z.string()).optional(),
        isSuperAdmin: z.boolean().optional(),
    }),
});
//# sourceMappingURL=admin-profile.validation.js.map