import type { Request, Response } from 'express';
import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import {
  getDashboardStats,
  getAllUsers,
  getAllBookings,
  updateUserStatus,
  deleteUser,
} from './admin.service';

/**
 * Get dashboard statistics
 */
export const getStats = catchAsync(async (req: Request, res: Response) => {
  console.log('📊 Admin stats requested');
  const stats = await getDashboardStats();
  sendResponse(res, 200, 'Dashboard stats fetched successfully', stats);
});

/**
 * Get all users
 */
export const getUsers = catchAsync(async (req: Request, res: Response) => {
  console.log('👥 Admin users requested');
  const { role, status } = req.query;
  const filters = {
    role: role as string,
    status: status as string,
  };
  const users = await getAllUsers(filters);
  sendResponse(res, 200, 'Users fetched successfully', users);
});

/**
 * Get all bookings (admin view)
 */
export const getBookings = catchAsync(async (req: Request, res: Response) => {
  console.log('📋 Admin bookings requested');
  const { status, page, limit } = req.query;
  const filters = {
    status: status as string,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
  };
  const result = await getAllBookings(filters);
  sendResponse(res, 200, 'Bookings fetched successfully', result);
});

/**
 * Update user status (ban/unban)
 */
export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  console.log('🔄 Updating user status');
  const { id } = req.params;
  const { status } = req.body;

  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid user ID');
  }

  if (!status || !['ACTIVE', 'BANNED'].includes(status)) {
    throw new ApiError(400, 'Invalid status. Must be ACTIVE or BANNED');
  }

  const user = await updateUserStatus(id, status);
  sendResponse(res, 200, `User status updated to ${status}`, user);
});

/**
 * Delete a user (admin only)
 */
export const deleteUserController = catchAsync(async (req: Request, res: Response) => {
  console.log('🗑️ Admin deleting user');
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid user ID');
  }

  await deleteUser(id);
  sendResponse(res, 200, 'User deleted successfully');
});
