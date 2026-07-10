import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';
import type { CreateReviewInput } from './reviews.validation';
import { BookingStatus } from '@prisma/client';

export const createReview = async (customerId: string, input: CreateReviewInput) => {
  const { bookingId, rating, comment } = input;

  // Check if booking exists
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      technician: true,
      customer: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Check if customer owns this booking
  if (booking.customerId !== customerId) {
    throw new ApiError(403, 'You can only review your own bookings');
  }

  // Check if booking is completed
  if (booking.status !== BookingStatus.COMPLETED) {
    throw new ApiError(400, 'Booking must be completed before leaving a review');
  }

  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: { bookingId },
  });

  if (existingReview) {
    throw new ApiError(409, 'Review already exists for this booking');
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      bookingId,
      customerId,
      technicianId: booking.technicianId,
      rating,
      comment: comment || null,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              profileImage: true,
            },
          },
        },
      },
      booking: {
        include: {
          service: {
            select: {
              id: true,
              title: true,
              price: true,
            },
          },
        },
      },
    },
  });

  // Update technician's average rating
  await updateTechnicianRating(booking.technicianId);

  return review;
};

export const getReviewsByTechnician = async (technicianId: string) => {
  // Check if technician exists
  const technician = await prisma.technicianProfile.findUnique({
    where: { id: technicianId },
  });

  if (!technician) {
    throw new ApiError(404, 'Technician not found');
  }

  return prisma.review.findMany({
    where: { technicianId },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
      booking: {
        include: {
          service: {
            select: {
              id: true,
              title: true,
              price: true,
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

export const getMyReviews = async (userId: string) => {
  // Get technician profile
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technician) {
    throw new ApiError(404, 'Technician profile not found');
  }

  return prisma.review.findMany({
    where: { technicianId: technician.id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
      booking: {
        include: {
          service: {
            select: {
              id: true,
              title: true,
              price: true,
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

export const getAverageRating = async (technicianId: string) => {
  const result = await prisma.review.aggregate({
    where: { technicianId },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  return {
    averageRating: result._avg.rating || 0,
    totalReviews: result._count.rating || 0,
  };
};

// Helper function to update technician's average rating
const updateTechnicianRating = async (technicianId: string) => {
  const result = await prisma.review.aggregate({
    where: { technicianId },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  await prisma.technicianProfile.update({
    where: { id: technicianId },
    data: {
      avgRating: result._avg.rating || 0,
      totalReviews: result._count.rating || 0,
    },
  });
};
