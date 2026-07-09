import { z, ZodError } from 'zod';
import { sendError } from '../utils/response';
export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                sendError(res, 'Validation failed', errors, 400);
                return;
            }
            sendError(res, 'Validation failed', error, 400);
        }
    };
};
//# sourceMappingURL=validation.middleware.js.map