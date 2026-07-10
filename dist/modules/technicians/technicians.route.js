import { Router } from 'express';
import { getMyProfileController, getAllTechniciansController, getTechnicianByIdController, updateMyProfileController, addAvailabilitySlotController, getMyAvailabilitySlotsController, removeAvailabilitySlotController, } from './technicians.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { updateTechnicianProfileSchema, createAvailabilitySlotSchema, } from './technicians.validation';
const router = Router();
// Public routes
router.get('/', getAllTechniciansController);
router.get('/:id', getTechnicianByIdController);
// Protected routes (Technician only)
router.use(protect);
router.get('/profile', restrictTo('TECHNICIAN'), getMyProfileController);
router.put('/profile', restrictTo('TECHNICIAN'), validate(updateTechnicianProfileSchema), updateMyProfileController);
// Availability slots (Technician only)
router.post('/availability', restrictTo('TECHNICIAN'), validate(createAvailabilitySlotSchema), addAvailabilitySlotController);
router.get('/availability', restrictTo('TECHNICIAN'), getMyAvailabilitySlotsController);
router.delete('/availability/:id', restrictTo('TECHNICIAN'), removeAvailabilitySlotController);
export default router;
//# sourceMappingURL=technicians.route.js.map