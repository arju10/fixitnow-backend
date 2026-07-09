import { ZodObject } from 'zod';
export const validate = (schema) => {
    return (req, _res, next) => {
        try {
            const parsed = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            req.body = parsed.body ?? req.body;
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
//# sourceMappingURL=validate.middleware.js.map