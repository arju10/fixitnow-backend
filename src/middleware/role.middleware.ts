import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const restrictTo = (...roles: Array<'CUSTOMER' | 'TECHNICIAN' | 'ADMIN'>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action.'));
    }
    next();
  };
};
