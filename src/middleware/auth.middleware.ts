import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { verifyToken } from '../utils/jwt';
import { catchAsync } from '../utils/catchAsync';
import { prisma } from '../lib/prisma';

export interface AuthUser {
  id: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const protect = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'You are not logged in. Please provide a valid token.');
  }

  const token = authHeader.split(' ')[1];

  // Check if token exists
  if (!token) {
    throw new ApiError(401, 'Invalid token format.');
  }

  const decoded = verifyToken(token);

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

  if (!user) {
    throw new ApiError(401, 'The user belonging to this token no longer exists.');
  }

  if (user.status === 'BANNED') {
    throw new ApiError(403, 'Your account has been banned. Contact support.');
  }

  req.user = { id: user.id, role: user.role, email: user.email };
  next();
});

// Role-based access control
export const restrictTo = (...roles: Array<'CUSTOMER' | 'TECHNICIAN' | 'ADMIN'>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'You are not logged in.');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action.');
    }

    next();
  };
};
