import { z } from 'zod';
export declare const updateAdminProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        department: z.ZodOptional<z.ZodString>;
        position: z.ZodOptional<z.ZodString>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodString>>;
        isSuperAdmin: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UpdateAdminProfileInput = z.infer<typeof updateAdminProfileSchema>['body'];
//# sourceMappingURL=admin-profile.validation.d.ts.map