import type { Request, Response, NextFunction } from 'express';
export interface AuthUser {
    id: string;
    role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
    email: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
export declare const protect: (req: Request, res: Response, next: NextFunction) => void;
export declare const restrictTo: (...roles: Array<"CUSTOMER" | "TECHNICIAN" | "ADMIN">) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map