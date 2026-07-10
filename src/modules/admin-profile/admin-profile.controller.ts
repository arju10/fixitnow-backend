import type { Request, Response } from 'express';
import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import { getAdminProfile, updateAdminProfile } from './admin-profile.service';
import type { UpdateAdminProfileInput } from './admin-profile.validation';

export const getMyAdminProfileController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  if (req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Access denied. Admin only.');
  }

  const profile = await getAdminProfile(req.user.id);
  sendResponse(res, 200, 'Admin profile fetched successfully', profile);
});

export const updateMyAdminProfileController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  if (req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Access denied. Admin only.');
  }

  const input = req.body as UpdateAdminProfileInput;
  const profile = await updateAdminProfile(req.user.id, input);
  sendResponse(res, 200, 'Admin profile updated successfully', profile);
});
