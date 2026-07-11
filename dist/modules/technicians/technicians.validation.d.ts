import { z } from 'zod';
export declare const updateTechnicianProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        bio: z.ZodOptional<z.ZodString>;
        experienceYrs: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const createAvailabilitySlotSchema: z.ZodObject<{
    body: z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        startTime: z.ZodString;
        endTime: z.ZodString;
        isActive: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UpdateTechnicianProfileInput = z.infer<typeof updateTechnicianProfileSchema>['body'];
export type CreateAvailabilitySlotInput = z.infer<typeof createAvailabilitySlotSchema>['body'];
//# sourceMappingURL=technicians.validation.d.ts.map