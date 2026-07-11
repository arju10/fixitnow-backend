import { Router } from 'express';
import { getMyProfileController, updateMyProfileController, getMyBookingsController, } from './customer.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { updateCustomerProfileSchema } from './customer.validation';
const router = Router();
// All routes require authentication and customer role
router.use(protect, restrictTo('CUSTOMER'));
router.get('/profile', getMyProfileController);
router.put('/profile', validate(updateCustomerProfileSchema), updateMyProfileController);
router.get('/bookings', getMyBookingsController);
export default router;
//# sourceMappingURL=customer.route.js.map