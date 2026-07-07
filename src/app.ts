import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/error.middleware';
import { sendSuccess } from './utils/response';

import authRoutes from './modules/auth/auth.route';
import userRoutes from './modules/users/users.route';
import categoryRoutes from './modules/categories/categories.route';
import serviceRoutes from './modules/services/services.route';
import technicianRoutes from './modules/technicians/technicians.route';
import bookingRoutes from './modules/bookings/bookings.route';
import paymentRoutes from './modules/payments/payments.route';
import reviewRoutes from './modules/reviews/reviews.route';
import adminRoutes from './modules/admin/admin.route';

const app: Application = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', limiter);

app.get('/health', (req, res) => {
  sendSuccess(res, 'Server is healthy', {
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.use('*', (req, res) => {
  const { sendError } = require('./utils/response');
  sendError(res, 'Route not found', `Cannot ${req.method} ${req.originalUrl}`, 404);
});

app.use(errorHandler);

export default app;
