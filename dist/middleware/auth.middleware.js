import { ApiError } from '../utils/ApiError';
import { verifyToken } from '../utils/jwt';
import { catchAsync } from '../utils/catchAsync';
import { prisma } from '../lib/prisma';
export const protect = catchAsync(async (req, _res, next) => {
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
export const restrictTo = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new ApiError(401, 'You are not logged in.');
        }
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, 'You do not have permission to perform this action.');
        }
        next();
    };
};
//# sourceMappingURL=auth.middleware.js.map