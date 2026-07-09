import { Router } from 'express';
import { getAllServicesController, getSingleServiceController, getMyServicesController, createServiceController, updateServiceController, deleteServiceController, } from './services.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createServiceSchema, updateServiceSchema } from './services.validation';
const router = Router();
// Public routes
router.get('/', getAllServicesController);
router.get('/:id', getSingleServiceController);
// Protected routes (Technician + Admin)
router.use(protect);
// Get my services - Technician only
router.get('/my', restrictTo('TECHNICIAN'), getMyServicesController);
// Create service - Technician only
router.post('/', restrictTo('TECHNICIAN'), validate(createServiceSchema), createServiceController);
// Update service - Technician (own) or Admin
router.put('/:id', validate(updateServiceSchema), updateServiceController);
// Delete service - Technician (own) or Admin
router.delete('/:id', deleteServiceController);
export default router;
//# sourceMappingURL=services.route.js.map