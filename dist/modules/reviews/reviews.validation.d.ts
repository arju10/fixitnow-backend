import { z } from 'zod';
export declare const createReviewSchema: z.ZodObject<{
    body: z.ZodObject<{
        bookingId: z.ZodString;
        rating: z.ZodNumber;
        comment: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];
//# sourceMappingURL=reviews.validation.d.ts.map