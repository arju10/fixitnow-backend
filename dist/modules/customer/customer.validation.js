import { z } from 'zod';
export const updateCustomerProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
    }),
});
//# sourceMappingURL=customer.validation.js.map