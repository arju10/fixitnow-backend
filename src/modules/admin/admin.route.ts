import { Router } from 'express';
import { getAllUsers, getAllBookings, getDashboardStats } from './admin.controller';
import { protect } from '../../middleware/auth.middleware';
import { restrictTo } from '../../middleware/role.middleware';

const router = Router();

// All routes require admin authentication
router.use(protect, restrictTo('ADMIN'));

router.get('/users', getAllUsers);
router.get('/bookings', getAllBookings);
router.get('/stats', getDashboardStats);

export default router;
