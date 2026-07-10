import { Router } from 'express';
import {
  createReviewController,
  getTechnicianReviewsController,
  getMyReviewsController,
} from './reviews.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createReviewSchema } from './reviews.validation';

const router = Router();

// Public routes
router.get('/technician/:technicianId', getTechnicianReviewsController);

// Protected routes
router.use(protect);

// Customer only - create review
router.post('/', restrictTo('CUSTOMER'), validate(createReviewSchema), createReviewController);

// Technician only - get my reviews
router.get('/my', restrictTo('TECHNICIAN'), getMyReviewsController);

export default router;
