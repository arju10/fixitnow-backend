import { Router } from 'express';
import {
  createBookingController,
  getMyBookingsController,
  getBookingController,
  updateBookingStatusController,
  cancelBookingController,
} from './bookings.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createBookingSchema, updateBookingStatusSchema } from './bookings.validation';

const router = Router();

// All routes require authentication
router.use(protect);

// Customer routes
router.post('/', validate(createBookingSchema), createBookingController);
router.get('/', getMyBookingsController);
router.get('/:id', getBookingController);
router.patch('/:id/cancel', cancelBookingController);

// Technician & Admin routes
router.patch('/:id/status', validate(updateBookingStatusSchema), updateBookingStatusController);

export default router;
