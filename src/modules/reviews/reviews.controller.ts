import type { Request, Response } from 'express';
import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import {
  createReview,
  getReviewsByTechnician,
  getMyReviews,
  getAverageRating,
  updateReview,
  deleteReview,
} from './reviews.service';

/**
 * Create a review
 */
export const create = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const { bookingId, rating, comment } = req.body;

  if (!bookingId) {
    throw new ApiError(400, 'Booking ID is required');
  }

  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, 'Rating must be between 1 and 5');
  }

  const review = await createReview(req.user.id, {
    bookingId,
    rating,
    comment,
  });

  sendResponse(res, 201, 'Review created successfully', review);
});

/**
 * Get reviews by technician ID
 * ✅ Fixed: Handle string | string[] type
 */
export const getTechnicianReviews = catchAsync(async (req: Request, res: Response) => {
  const { technicianId } = req.params;

  if (!technicianId) {
    throw new ApiError(400, 'Technician ID is required');
  }

  // ✅ Ensure technicianId is a string
  const id = Array.isArray(technicianId) ? technicianId[0] : technicianId;

  const reviews = await getReviewsByTechnician(id);
  sendResponse(res, 200, 'Reviews fetched successfully', reviews);
});

/**
 * Get my reviews (authenticated customer)
 */
export const getMyReviewsController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const reviews = await getMyReviews(req.user.id);
  sendResponse(res, 200, 'My reviews fetched successfully', reviews);
});

/**
 * Get average rating for a technician
 * ✅ Fixed: Handle string | string[] type
 */
export const getRating = catchAsync(async (req: Request, res: Response) => {
  const { technicianId } = req.params;

  if (!technicianId) {
    throw new ApiError(400, 'Technician ID is required');
  }

  // ✅ Ensure technicianId is a string
  const id = Array.isArray(technicianId) ? technicianId[0] : technicianId;

  const rating = await getAverageRating(id);
  sendResponse(res, 200, 'Rating fetched successfully', rating);
});

/**
 * Update a review
 * ✅ Fixed: Handle string | string[] type
 */
export const update = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!id) {
    throw new ApiError(400, 'Review ID is required');
  }

  // ✅ Ensure id is a string
  const reviewId = Array.isArray(id) ? id[0] : id;

  const review = await updateReview(reviewId, req.user.id, { rating, comment });
  sendResponse(res, 200, 'Review updated successfully', review);
});

/**
 * Delete a review
 * ✅ Fixed: Handle string | string[] type
 */
export const remove = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, 'Review ID is required');
  }

  // ✅ Ensure id is a string
  const reviewId = Array.isArray(id) ? id[0] : id;

  await deleteReview(reviewId, req.user.id);
  sendResponse(res, 200, 'Review deleted successfully');
});
