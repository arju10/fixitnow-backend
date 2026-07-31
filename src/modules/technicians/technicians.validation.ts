import { z } from 'zod';

export const updateTechnicianProfileSchema = z.object({
  body: z.object({
    bio: z.string().optional(),
    experienceYrs: z.number().min(0).optional(),
    location: z.string().optional(),
  }),
});

export const createAvailabilitySlotSchema = z.object({
  body: z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    isActive: z.boolean().default(true),
  }),
});

export const updateAvailabilitySlotSchema = z.object({
  body: z.object({
    dayOfWeek: z.number().min(0).max(6).optional(),
    startTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional(),
    endTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

export type UpdateTechnicianProfileInput = z.infer<typeof updateTechnicianProfileSchema>['body'];
export type CreateAvailabilitySlotInput = z.infer<typeof createAvailabilitySlotSchema>['body'];
export type UpdateAvailabilitySlotInput = z.infer<typeof updateAvailabilitySlotSchema>['body'];
