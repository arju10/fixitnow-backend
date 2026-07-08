import { type Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T | null | undefined;
  errorDetails?: any;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T | null,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  errorDetails?: any,
  statusCode: number = 400
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    errorDetails: errorDetails?.message || errorDetails || message,
  };
  return res.status(statusCode).json(response);
};
