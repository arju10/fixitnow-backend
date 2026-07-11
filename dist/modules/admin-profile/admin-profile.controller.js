import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import { getAdminProfile, updateAdminProfile } from './admin-profile.service';
export const getMyAdminProfileController = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
    }
    if (req.user.role !== 'ADMIN') {
        throw new ApiError(403, 'Access denied. Admin only.');
    }
    const profile = await getAdminProfile(req.user.id);
    sendResponse(res, 200, 'Admin profile fetched successfully', profile);
});
export const updateMyAdminProfileController = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
    }
    if (req.user.role !== 'ADMIN') {
        throw new ApiError(403, 'Access denied. Admin only.');
    }
    const input = req.body;
    const profile = await updateAdminProfile(req.user.id, input);
    sendResponse(res, 200, 'Admin profile updated successfully', profile);
});
//# sourceMappingURL=admin-profile.controller.js.map