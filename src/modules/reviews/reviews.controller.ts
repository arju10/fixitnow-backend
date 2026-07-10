import type { Request, Response } from 'express';
import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import {
  createReview,
  getReviewsByTechnician,
  getMyReviews,
  getAverageRating,
} from './reviews.service';
import type { CreateReviewInput } from './reviews.validation';

export const createReviewController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  if (req.user.role !== 'CUSTOMER') {
    throw new ApiError(403, 'Only customers can create reviews');
  }

  const input = req.body as CreateReviewInput;
  const review = await createReview(req.user.id, input);
  sendResponse(res, 201, 'Review created successfully', review);
});

export const getTechnicianReviewsController = catchAsync(async (req: Request, res: Response) => {
  const { technicianId } = req.params;
  if (!technicianId || typeof technicianId !== 'string') {
    throw new ApiError(400, 'Invalid technician ID');
  }

  const [reviews, rating] = await Promise.all([
    getReviewsByTechnician(technicianId),
    getAverageRating(technicianId),
  ]);

  sendResponse(res, 200, 'Reviews fetched successfully', {
    reviews,
    ...rating,
  });
});

export const getMyReviewsController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  if (req.user.role !== 'TECHNICIAN') {
    throw new ApiError(403, 'Only technicians can view their reviews');
  }

  const [reviews, rating] = await Promise.all([
    getMyReviews(req.user.id),
    getAverageRating((await getMyReviews(req.user.id))[0]?.technicianId || ''),
  ]);

  sendResponse(res, 200, 'My reviews fetched successfully', {
    reviews,
    ...rating,
  });
});
