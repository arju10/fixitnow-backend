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
  // ✅ Only include filters if they exist
  const filters: { role?: string; status?: string } = {};
  if (role) filters.role = role as string;
  if (status) filters.status = status as string;

  const users = await getAllUsers(filters);
  sendResponse(res, 200, 'Users fetched successfully', users);
});

/**
 * Get all bookings (admin view)
 * ✅ Fixed: Properly handle optional properties
 */
export const getBookings = catchAsync(async (req: Request, res: Response) => {
  console.log('📋 Admin bookings requested');
  const { status, page, limit } = req.query;

  // ✅ Only include filters if they exist
  const filters: { status?: string; page?: number; limit?: number } = {};
  if (status) filters.status = status as string;
  if (page) filters.page = parseInt(page as string);
  if (limit) filters.limit = parseInt(limit as string);

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
