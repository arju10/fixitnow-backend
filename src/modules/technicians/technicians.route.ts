import { Router } from 'express';
import {
  getMyProfileController,
  getAllTechniciansController,
  getTechnicianByIdController,
  updateMyProfileController,
  addAvailabilitySlotController,
  getMyAvailabilitySlotsController,
  updateAvailabilitySlotController,
  removeAvailabilitySlotController,
} from './technicians.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  updateTechnicianProfileSchema,
  createAvailabilitySlotSchema,
  updateAvailabilitySlotSchema,
} from './technicians.validation';

const router = Router();

// Public routes
router.get('/', getAllTechniciansController);
router.get('/:id', getTechnicianByIdController);

// Protected routes (Technician only)
router.use(protect);

router.get('/profile', restrictTo('TECHNICIAN'), getMyProfileController);
router.put(
  '/profile',
  restrictTo('TECHNICIAN'),
  validate(updateTechnicianProfileSchema),
  updateMyProfileController
);

// Availability slots (Technician only)
router.get('/availability', restrictTo('TECHNICIAN'), getMyAvailabilitySlotsController);
router.post(
  '/availability',
  restrictTo('TECHNICIAN'),
  validate(createAvailabilitySlotSchema),
  addAvailabilitySlotController
);
router.put(
  '/availability/:id',
  restrictTo('TECHNICIAN'),
  validate(updateAvailabilitySlotSchema),
  updateAvailabilitySlotController
);
router.delete('/availability/:id', restrictTo('TECHNICIAN'), removeAvailabilitySlotController);

export default router;
