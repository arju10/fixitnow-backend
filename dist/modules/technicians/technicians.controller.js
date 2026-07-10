import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import { getTechnicianProfile, getAllTechnicians, updateTechnicianProfile, addAvailabilitySlot, getAvailabilitySlots, removeAvailabilitySlot, } from './technicians.service';
export const getMyProfileController = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
    }
    const profile = await getTechnicianProfile(req.user.id);
    sendResponse(res, 200, 'Technician profile fetched successfully', profile);
});
export const getAllTechniciansController = catchAsync(async (req, res) => {
    const { location } = req.query;
    const filters = {
        location: location,
    };
    const technicians = await getAllTechnicians(filters);
    sendResponse(res, 200, 'Technicians fetched successfully', technicians);
});
export const getTechnicianByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        throw new ApiError(400, 'Invalid technician ID');
    }
    const profile = await getTechnicianProfile(id);
    sendResponse(res, 200, 'Technician profile fetched successfully', profile);
});
export const updateMyProfileController = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
    }
    const input = req.body;
    const profile = await updateTechnicianProfile(req.user.id, input);
    sendResponse(res, 200, 'Technician profile updated successfully', profile);
});
export const addAvailabilitySlotController = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
    }
    const input = req.body;
    const slot = await addAvailabilitySlot(req.user.id, input);
    sendResponse(res, 201, 'Availability slot added successfully', slot);
});
export const getMyAvailabilitySlotsController = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
    }
    const slots = await getAvailabilitySlots(req.user.id);
    sendResponse(res, 200, 'Availability slots fetched successfully', slots);
});
export const removeAvailabilitySlotController = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
    }
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        throw new ApiError(400, 'Invalid slot ID');
    }
    await removeAvailabilitySlot(id, req.user.id);
    sendResponse(res, 200, 'Availability slot removed successfully');
});
//# sourceMappingURL=technicians.controller.js.map