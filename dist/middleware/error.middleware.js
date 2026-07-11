import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
export const notFoundHandler = (req, _res, next) => {
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err, _req, res, _next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorDetails = null;
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = err.errorDetails;
    }
    else if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation failed';
        errorDetails = err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = 400;
        if (err.code === 'P2002') {
            message = `Duplicate value for field(s): ${err.meta?.target?.join(', ')}`;
        }
        else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Record not found';
        }
        else {
            message = 'Database request error';
        }
        errorDetails = process.env.NODE_ENV === 'development' ? err.message : null;
    }
    else if (err instanceof Error) {
        message = err.message || message;
        errorDetails = process.env.NODE_ENV === 'development' ? err.stack : null;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
    });
};
//# sourceMappingURL=error.middleware.js.map