import type { Request, Response } from 'express';
import type { CreateBookingInput, UpdateBookingStatusInput } from './bookings.validation';

export interface IBooking {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  scheduledAt: Date;
  status: string;
  totalAmount: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookingWithDetails extends IBooking {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  technician: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    };
  };
  service: {
    id: string;
    title: string;
    price: number;
    category: {
      id: string;
      name: string;
    };
  };
  payment?: {
    id: string;
    status: string;
    amount: number;
  } | null;
  review?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
}

export interface IBookingService {
  createBooking(customerId: string, input: CreateBookingInput): Promise<IBookingWithDetails>;
  getBookings(userId: string, role: string): Promise<IBookingWithDetails[]>;
  getBookingById(bookingId: string, userId: string, role: string): Promise<IBookingWithDetails>;
  updateBookingStatus(
    bookingId: string,
    status: string,
    userId: string,
    role: string
  ): Promise<IBookingWithDetails>;
  cancelBooking(bookingId: string, userId: string): Promise<IBookingWithDetails>;
}

export interface IBookingController {
  createBooking: (req: Request, res: Response) => Promise<void>;
  getMyBookings: (req: Request, res: Response) => Promise<void>;
  getBooking: (req: Request, res: Response) => Promise<void>;
  updateBookingStatus: (req: Request, res: Response) => Promise<void>;
  cancelBooking: (req: Request, res: Response) => Promise<void>;
}
