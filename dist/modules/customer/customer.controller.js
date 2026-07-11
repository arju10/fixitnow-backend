import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import { getCustomerProfile, updateCustomerProfile, getCustomerBookings } from './customer.service';
export const getMyProfileController = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
    }
    if (req.user.role !== 'CUSTOMER') {
        throw new ApiError(400, 'Access denied. Customer only.');
    }
    const profile = await getCustomerProfile(req.user.id);
    sendResponse(res, 200, 'Customer profile fetched successfully', profile);
});
export const updateMyProfileController = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
    }
    if (req.user.role !== 'CUSTOMER') {
        throw new ApiError(400, 'Access denied. Customer only.');
    }
    const input = req.body;
    const profile = await updateCustomerProfile(req.user.id, input);
    sendResponse(res, 200, 'Customer profile updated successfully', profile);
});
export const getMyBookingsController = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
    }
    if (req.user.role !== 'CUSTOMER') {
        throw new ApiError(400, 'Access denied. Customer only.');
    }
    const bookings = await getCustomerBookings(req.user.id);
    sendResponse(res, 200, 'Bookings fetched successfully', bookings);
});
//# sourceMappingURL=customer.controller.js.map