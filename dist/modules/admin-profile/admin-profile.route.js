import { Router } from 'express';
import { getMyAdminProfileController, updateMyAdminProfileController, } from './admin-profile.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { updateAdminProfileSchema } from './admin-profile.validation';
const router = Router();
// All routes require admin authentication
router.use(protect, restrictTo('ADMIN'));
router.get('/profile', getMyAdminProfileController);
router.put('/profile', validate(updateAdminProfileSchema), updateMyAdminProfileController);
export default router;
//# sourceMappingURL=admin-profile.route.js.map