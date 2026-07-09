import { Router } from 'express';
import {
  getAllCategoriesController,
  getSingleCategoryController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from './categories.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema } from './categories.validation';

const router = Router();

// Public routes
router.get('/', getAllCategoriesController);
router.get('/:id', getSingleCategoryController);

// Admin only routes
router.post(
  '/',
  protect,
  restrictTo('ADMIN'),
  validate(createCategorySchema),
  createCategoryController
);
router.put(
  '/:id',
  protect,
  restrictTo('ADMIN'),
  validate(updateCategorySchema),
  updateCategoryController
);
router.delete('/:id', protect, restrictTo('ADMIN'), deleteCategoryController);

export default router;
