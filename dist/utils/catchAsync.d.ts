import type { Request, Response, NextFunction, RequestHandler } from 'express';
export declare const catchAsync: (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=catchAsync.d.ts.map