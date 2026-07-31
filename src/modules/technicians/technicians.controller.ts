import type { Request, Response } from 'express';
import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import {
  getTechnicianProfileByUserId,
  getTechnicianProfileByProfileId,
  getAllTechnicians,
  updateTechnicianProfile,
  addAvailabilitySlot,
  getAvailabilitySlots,
  updateAvailabilitySlot,
  removeAvailabilitySlot,
} from './technicians.service';
import type {
  UpdateTechnicianProfileInput,
  CreateAvailabilitySlotInput,
  UpdateAvailabilitySlotInput,
} from './technicians.validation';

/**
 * Get current technician's profile (using authenticated user ID)
 */
export const getMyProfileController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  console.log('📍 getMyProfileController - userId:', req.user.id);
  const profile = await getTechnicianProfileByUserId(req.user.id);
  sendResponse(res, 200, 'Technician profile fetched successfully', profile);
});

/**
 * Get all technicians (public)
 */
export const getAllTechniciansController = catchAsync(async (req: Request, res: Response) => {
  console.log('📍 getAllTechniciansController called');
  const { location } = req.query;
  const filters = {
    location: location as string,
  };
  const technicians = await getAllTechnicians(filters);
  sendResponse(res, 200, 'Technicians fetched successfully', technicians);
});

/**
 * Get technician by profile ID (public)
 * ✅ FIXED: Now calls getTechnicianProfileByProfileId
 */
export const getTechnicianByIdController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log('📍 getTechnicianByIdController - id:', id);

  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid technician ID');
  }

  // ✅ CORRECT: Get single technician by profile ID
  const profile = await getTechnicianProfileByProfileId(id);
  sendResponse(res, 200, 'Technician profile fetched successfully', profile);
});

/**
 * Update current technician's profile
 */
export const updateMyProfileController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  console.log('📍 updateMyProfileController - userId:', req.user.id);
  const input = req.body as UpdateTechnicianProfileInput;
  const profile = await updateTechnicianProfile(req.user.id, input);
  sendResponse(res, 200, 'Technician profile updated successfully', profile);
});

/**
 * Get my availability slots
 */
export const getMyAvailabilitySlotsController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  console.log('📍 getMyAvailabilitySlotsController - userId:', req.user.id);
  const slots = await getAvailabilitySlots(req.user.id);
  sendResponse(res, 200, 'Availability slots fetched successfully', slots);
});

/**
 * Add availability slot
 */
export const addAvailabilitySlotController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  console.log('📍 addAvailabilitySlotController - userId:', req.user.id);
  const input = req.body as CreateAvailabilitySlotInput;
  const slot = await addAvailabilitySlot(req.user.id, input);
  sendResponse(res, 201, 'Availability slot added successfully', slot);
});

/**
 * Update availability slot
 */
export const updateAvailabilitySlotController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const { id } = req.params;
  console.log('📍 updateAvailabilitySlotController - slotId:', id, 'userId:', req.user.id);

  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid slot ID');
  }

  const input = req.body as UpdateAvailabilitySlotInput;
  const slot = await updateAvailabilitySlot(id, req.user.id, input);
  sendResponse(res, 200, 'Availability slot updated successfully', slot);
});

/**
 * Remove availability slot
 */
export const removeAvailabilitySlotController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const { id } = req.params;
  console.log('📍 removeAvailabilitySlotController - slotId:', id, 'userId:', req.user.id);

  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid slot ID');
  }

  await removeAvailabilitySlot(id, req.user.id);
  sendResponse(res, 200, 'Availability slot removed successfully');
});
