import type { Request, Response } from 'express';
import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
} from './users.service';
import type { UpdateUserInput, UpdateUserStatusInput } from './users.validation';

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const { role, status } = req.query;
  const filters = {
    role: role as string,
    status: status as string,
  };
  const users = await getAllUsers(filters);
  sendResponse(res, 200, 'Users fetched successfully', users);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Ensure id is a string
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid user ID');
  }
  const user = await getUserById(id);
  sendResponse(res, 200, 'User fetched successfully', user);
});

export const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id || req.user?.id;
  if (!userId) {
    throw new ApiError(400, 'User ID is required');
  }

  // Ensure userId is a string
  if (typeof userId !== 'string') {
    throw new ApiError(400, 'Invalid user ID');
  }

  // Check if user is updating their own profile or is admin
  if (req.user?.role !== 'ADMIN' && req.user?.id !== userId) {
    throw new ApiError(403, 'You can only update your own profile');
  }

  const input = req.body as UpdateUserInput;
  const user = await updateUser(userId, input);
  sendResponse(res, 200, 'User updated successfully', user);
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid user ID');
  }
  const { status } = req.body as UpdateUserStatusInput;
  const user = await updateUserStatus(id, status);
  sendResponse(res, 200, `User status updated to ${status} successfully`, user);
});

export const deleteUserProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid user ID');
  }
  await deleteUser(id);
  sendResponse(res, 200, 'User deleted successfully');
});

export const getStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await getDashboardStats();
  sendResponse(res, 200, 'Dashboard stats fetched successfully', stats);
});
