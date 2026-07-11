export class ApiError extends Error {
    statusCode;
    errorDetails;
    constructor(statusCode, message, errorDetails = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorDetails = errorDetails;
        Error.captureStackTrace(this, this.constructor);
    }
}
//# sourceMappingURL=ApiError.js.map