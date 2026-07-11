import type { Request, Response, NextFunction } from 'express';
export declare const restrictTo: (...roles: Array<"CUSTOMER" | "TECHNICIAN" | "ADMIN">) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map