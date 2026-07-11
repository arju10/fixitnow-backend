import { type Response } from 'express';
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T | null | undefined;
    errorDetails?: any;
}
export declare const sendSuccess: <T>(res: Response, message: string, data?: T | null, statusCode?: number) => Response;
export declare const sendError: (res: Response, message: string, errorDetails?: any, statusCode?: number) => Response;
//# sourceMappingURL=response.d.ts.map