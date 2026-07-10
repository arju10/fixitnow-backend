import { z } from 'zod';
export declare const updateCustomerProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UpdateCustomerProfileInput = z.infer<typeof updateCustomerProfileSchema>['body'];
//# sourceMappingURL=customer.validation.d.ts.map