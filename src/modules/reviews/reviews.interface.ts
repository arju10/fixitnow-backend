import type { Request, Response } from 'express';
import type { CreateReviewInput } from './reviews.validation';

export interface IReview {
  id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

export interface IReviewWithDetails extends IReview {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    profileImage: string | null;
  };
  technician: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      profileImage: string | null;
    };
  };
  booking: {
    id: string;
    service: {
      id: string;
      title: string;
      price: number;
    };
  };
}

export interface IReviewService {
  createReview(customerId: string, input: CreateReviewInput): Promise<IReviewWithDetails>;
  getReviewsByTechnician(technicianId: string): Promise<IReviewWithDetails[]>;
  getAverageRating(technicianId: string): Promise<{ averageRating: number; totalReviews: number }>;
  getMyReviews(technicianId: string): Promise<IReviewWithDetails[]>;
}

export interface IReviewController {
  createReview: (req: Request, res: Response) => Promise<void>;
  getTechnicianReviews: (req: Request, res: Response) => Promise<void>;
  getMyReviews: (req: Request, res: Response) => Promise<void>;
}
