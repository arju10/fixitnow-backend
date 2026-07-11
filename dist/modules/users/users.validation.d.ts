import { z } from 'zod';
export declare const updateUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        profileImage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateUserStatusSchema: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodEnum<{
            ACTIVE: "ACTIVE";
            BANNED: "BANNED";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>['body'];
//# sourceMappingURL=users.validation.d.ts.map