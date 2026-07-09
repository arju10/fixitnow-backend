import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Application, type Request, type Response } from 'express';
import config from './config';
import { notFoundHandler, globalErrorHandler } from './middleware/error.middleware';
import { sendResponse } from './utils/ApiResponse';

// Import routes
import authRoutes from './modules/auth/auth.route';
import userRoutes from './modules/users/users.route';
import adminRoutes from './modules/admin/admin.route';
import categoryRoutes from './modules/categories/categories.route';
import serviceRoutes from './modules/services/services.route';

const app: Application = express();

app.use(
  cors({
    origin: config.cors_origin,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req: Request, res: Response) => {
  sendResponse(res, 200, 'Server is healthy', {
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

export default app;
