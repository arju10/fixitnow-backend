import { Router } from 'express';
import {
  create,
  getTechnicianReviews,
  getMyReviewsController,
  getRating,
  update,
  remove,
} from './reviews.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/technician/:technicianId', getTechnicianReviews);
router.get('/technician/:technicianId/rating', getRating);

// Protected routes
router.use(protect);

router.post('/', restrictTo('CUSTOMER'), create);
router.get('/my', restrictTo('CUSTOMER'), getMyReviewsController);
router.put('/:id', restrictTo('CUSTOMER'), update);
router.delete('/:id', restrictTo('CUSTOMER'), remove);

export default router;
