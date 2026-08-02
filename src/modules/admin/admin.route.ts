import { Router } from 'express';
import {
  getStats,
  getUsers,
  getBookings,
  updateStatus,
  deleteUserController,
} from './admin.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(restrictTo('ADMIN'));

/**
 * @route GET /api/admin/stats
 * @description Get dashboard statistics
 * @access Admin only
 */
router.get('/stats', getStats);

/**
 * @route GET /api/admin/users
 * @description Get all users with filters
 * @access Admin only
 */
router.get('/users', getUsers);

/**
 * @route GET /api/admin/bookings
 * @description Get all bookings
 * @access Admin only
 */
router.get('/bookings', getBookings);

/**
 * @route PATCH /api/admin/users/:id/status
 * @description Update user status (ban/unban)
 * @access Admin only
 */
router.patch('/users/:id/status', updateStatus);

/**
 * @route DELETE /api/admin/users/:id
 * @description Delete a user
 * @access Admin only
 */
router.delete('/users/:id', deleteUserController);

export default router;
