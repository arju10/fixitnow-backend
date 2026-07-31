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

// ✅ IMPORTANT: Specific routes MUST come BEFORE dynamic routes

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all technicians
router.get('/', getAllTechniciansController);

// ============================================
// PROTECTED ROUTES (Technician only)
// ============================================

// These must come BEFORE the /:id route!
router.use(protect);

// Profile routes (specific)
router.get('/profile', restrictTo('TECHNICIAN'), getMyProfileController);
router.put(
  '/profile',
  restrictTo('TECHNICIAN'),
  validate(updateTechnicianProfileSchema),
  updateMyProfileController
);

// Availability routes (specific)
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

// ============================================
// DYNAMIC ROUTE (must come LAST)
// ============================================

// Get technician by profile ID (public)
router.get('/:id', getAllTechniciansController);

export default router;
