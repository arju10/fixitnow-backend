import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';

/**
 * Create a review
 */
export const createReview = async (
  customerId: string,
  input: { bookingId: string; rating: number; comment?: string }
) => {
  const { bookingId, rating, comment } = input;

  console.log('📝 Creating review for booking:', bookingId);

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: true,
      technician: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.customerId !== customerId) {
    throw new ApiError(403, 'You can only review your own bookings');
  }

  if (booking.status !== 'COMPLETED') {
    throw new ApiError(400, 'You can only review completed bookings');
  }

  const existingReview = await prisma.review.findUnique({
    where: { bookingId },
  });

  if (existingReview) {
    throw new ApiError(409, 'You have already reviewed this booking');
  }

  const reviewData: any = {
    bookingId,
    customerId,
    technicianId: booking.technicianId,
    rating,
  };

  if (comment !== undefined) {
    reviewData.comment = comment;
  }

  const review = await prisma.review.create({
    data: reviewData,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  await updateTechnicianRating(booking.technicianId);

  console.log('✅ Review created:', review.id);

  return review;
};

/**
 * Update technician average rating
 */
const updateTechnicianRating = async (technicianId: string) => {
  const reviews = await prisma.review.findMany({
    where: { technicianId },
    select: { rating: true },
  });

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

  await prisma.technicianProfile.update({
    where: { id: technicianId },
    data: {
      avgRating,
      totalReviews,
    },
  });
};

/**
 * Get reviews for a technician (by technician ID)
 */
export const getReviewsByTechnician = async (technicianId: string) => {
  return prisma.review.findMany({
    where: { technicianId },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      booking: {
        select: {
          id: true,
          scheduledAt: true,
          service: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Get reviews by a customer (my reviews)
 */
export const getMyReviews = async (customerId: string) => {
  return prisma.review.findMany({
    where: { customerId },
    include: {
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      booking: {
        select: {
          id: true,
          scheduledAt: true,
          service: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Get average rating for a technician
 */
export const getAverageRating = async (technicianId: string) => {
  const reviews = await prisma.review.aggregate({
    where: { technicianId },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  return {
    avgRating: reviews._avg.rating || 0,
    totalReviews: reviews._count.rating || 0,
  };
};

/**
 * Update a review (customer only)
 */
export const updateReview = async (
  reviewId: string,
  customerId: string,
  input: { rating?: number; comment?: string }
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  if (review.customerId !== customerId) {
    throw new ApiError(403, 'You can only update your own reviews');
  }

  const updateData: any = {};
  if (input.rating !== undefined) {
    updateData.rating = input.rating;
  }
  if (input.comment !== undefined) {
    updateData.comment = input.comment;
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: updateData,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  await updateTechnicianRating(review.technicianId);

  return updatedReview;
};

/**
 * Delete a review (customer only)
 */
export const deleteReview = async (reviewId: string, customerId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  if (review.customerId !== customerId) {
    throw new ApiError(403, 'You can only delete your own reviews');
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  await updateTechnicianRating(review.technicianId);
};
