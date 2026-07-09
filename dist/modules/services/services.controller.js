import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import { getAllServices, getSingleService, getServicesByTechnicianId, createNewService, updateSingleService, deleteSingleService, } from './services.service';
import { prisma } from '../../lib/prisma';
export const getAllServicesController = catchAsync(async (req, res) => {
    const { categoryId, minPrice, maxPrice, minRating } = req.query;
    const filters = {};
    if (categoryId) {
        filters.categoryId = categoryId;
    }
    if (minPrice) {
        const price = parseFloat(minPrice);
        if (!isNaN(price)) {
            filters.minPrice = price;
        }
    }
    if (maxPrice) {
        const price = parseFloat(maxPrice);
        if (!isNaN(price)) {
            filters.maxPrice = price;
        }
    }
    if (minRating) {
        const rating = parseFloat(minRating);
        if (!isNaN(rating)) {
            filters.minRating = rating;
        }
    }
    const services = await getAllServices(filters);
    sendResponse(res, 200, 'Services fetched successfully', services);
});
export const getSingleServiceController = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        throw new ApiError(400, 'Invalid service ID');
    }
    const service = await getSingleService(id);
    sendResponse(res, 200, 'Service fetched successfully', service);
});
export const getMyServicesController = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
    }
    const technician = await prisma.technicianProfile.findUnique({
        where: { userId: req.user.id },
    });
    if (!technician) {
        throw new ApiError(404, 'Technician profile not found');
    }
    const services = await getServicesByTechnicianId(technician.id);
    sendResponse(res, 200, 'Services fetched successfully', services);
});
export const createServiceController = catchAsync(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
    }
    const input = req.body;
    const service = await createNewService(req.user.id, input);
    sendResponse(res, 201, 'Service created successfully', service);
});
export const updateServiceController = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        throw new ApiError(400, 'Invalid service ID');
    }
    // Check if user owns the service or is admin
    const service = await prisma.service.findUnique({
        where: { id },
        include: {
            technician: true,
        },
    });
    if (!service) {
        throw new ApiError(404, 'Service not found');
    }
    // ✅ Admin can update any service, Technician can only update own
    if (req.user?.role !== 'ADMIN' && service.technician.userId !== req.user?.id) {
        throw new ApiError(403, 'You can only update your own services');
    }
    const input = req.body;
    const updatedService = await updateSingleService(id, input);
    sendResponse(res, 200, 'Service updated successfully', updatedService);
});
export const deleteServiceController = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        throw new ApiError(400, 'Invalid service ID');
    }
    // Check if user owns the service or is admin
    const service = await prisma.service.findUnique({
        where: { id },
        include: {
            technician: true,
        },
    });
    if (!service) {
        throw new ApiError(404, 'Service not found');
    }
    // ✅ Admin can delete any service, Technician can only delete own
    if (req.user?.role !== 'ADMIN' && service.technician.userId !== req.user?.id) {
        throw new ApiError(403, 'You can only delete your own services');
    }
    await deleteSingleService(id);
    sendResponse(res, 200, 'Service deleted successfully');
});
//# sourceMappingURL=services.controller.js.map