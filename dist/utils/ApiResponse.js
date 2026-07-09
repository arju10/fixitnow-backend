export const sendResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        success: true,
        message,
        data: data ?? null,
    });
};
//# sourceMappingURL=ApiResponse.js.map