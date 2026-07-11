import {} from 'express';
export const sendSuccess = (res, message, data, statusCode = 200) => {
    const response = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(response);
};
export const sendError = (res, message, errorDetails, statusCode = 400) => {
    const response = {
        success: false,
        message,
        errorDetails: errorDetails?.message || errorDetails || message,
    };
    return res.status(statusCode).json(response);
};
//# sourceMappingURL=response.js.map