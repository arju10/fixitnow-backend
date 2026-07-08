import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateUserProfile,
  updateStatus,
  deleteUserProfile,
  getStats,
} from './users.controller';
import { restrictTo } from '../../middleware/role.middleware';
import { protect } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { updateUserSchema, updateUserStatusSchema } from './users.validation';

const router = Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.get('/', restrictTo('ADMIN'), getUsers);
router.get('/stats', restrictTo('ADMIN'), getStats);
router.patch('/:id/status', restrictTo('ADMIN'), validate(updateUserStatusSchema), updateStatus);

// User routes
router.get('/:id', getUser);
router.put('/:id', validate(updateUserSchema), updateUserProfile);
router.delete('/:id', deleteUserProfile);

export default router;
