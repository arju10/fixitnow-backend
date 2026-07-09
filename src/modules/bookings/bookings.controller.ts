import type { Request, Response } from 'express';
import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from './bookings.service';
import type { CreateBookingInput, UpdateBookingStatusInput } from './bookings.validation';

export const createBookingController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const input = req.body as CreateBookingInput;
  const booking = await createBooking(req.user.id, input);
  sendResponse(res, 201, 'Booking created successfully', booking);
});

export const getMyBookingsController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const bookings = await getBookings(req.user.id, req.user.role);
  sendResponse(res, 200, 'Bookings fetched successfully', bookings);
});

export const getBookingController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid booking ID');
  }

  const booking = await getBookingById(id, req.user.id, req.user.role);
  sendResponse(res, 200, 'Booking fetched successfully', booking);
});

export const updateBookingStatusController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid booking ID');
  }

  const { status } = req.body as UpdateBookingStatusInput;
  const booking = await updateBookingStatus(id, status, req.user.id, req.user.role);
  sendResponse(res, 200, 'Booking status updated successfully', booking);
});

export const cancelBookingController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid booking ID');
  }

  const booking = await cancelBooking(id, req.user.id);
  sendResponse(res, 200, 'Booking cancelled successfully', booking);
});
