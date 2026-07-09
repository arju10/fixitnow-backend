import { z } from 'zod';
export declare const createServiceSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        price: z.ZodNumber;
        durationMins: z.ZodOptional<z.ZodNumber>;
        categoryId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateServiceSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
        durationMins: z.ZodOptional<z.ZodNumber>;
        categoryId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>['body'];
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>['body'];
//# sourceMappingURL=services.validation.d.ts.map