import type { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
export declare const validate: (schema: ZodObject<any>) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.middleware.d.ts.map