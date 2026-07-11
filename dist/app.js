import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, {} from 'express';
import config from './config';
import { notFoundHandler, globalErrorHandler } from './middleware/error.middleware';
import { sendResponse } from './utils/ApiResponse';
// Import routes
import authRoutes from './modules/auth/auth.route';
import userRoutes from './modules/users/users.route';
import adminRoutes from './modules/admin/admin.route';
import adminProfileRoutes from './modules/admin-profile/admin-profile.route';
import categoryRoutes from './modules/categories/categories.route';
import serviceRoutes from './modules/services/services.route';
import technicianRoutes from './modules/technicians/technicians.route';
import bookingRoutes from './modules/bookings/bookings.route';
import customerRoutes from './modules/customer/customer.route';
import reviewRoutes from './modules/reviews/reviews.route';
import paymentRoutes from './modules/payments/payments.route';
const app = express();
app.use(cors({
    origin: config.cors_origin,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Health check
app.get('/health', (req, res) => {
    sendResponse(res, 200, 'Server is healthy', {
        status: 'OK',
        timestamp: new Date().toISOString(),
    });
});
// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin-profile', adminProfileRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
// 404 handler
app.use(notFoundHandler);
// Global error handler
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map