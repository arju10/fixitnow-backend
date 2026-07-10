import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';
import { stripe, createPaymentIntent, retrievePaymentIntent } from '../../lib/stripe';
import type { CreatePaymentInput } from './payments.validation';
import { PaymentProvider, PaymentStatus, BookingStatus } from '@prisma/client';

export const createPayment = async (userId: string, input: CreatePaymentInput) => {
  const { bookingId } = input;

  // Get booking details
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: true,
      technician: {
        include: {
          user: true,
        },
      },
      service: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Check if user owns this booking
  if (booking.customerId !== userId) {
    throw new ApiError(403, 'You can only pay for your own bookings');
  }

  // Check if booking is accepted
  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new ApiError(400, 'Booking must be accepted before payment');
  }

  // Check if payment already exists
  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (existingPayment) {
    throw new ApiError(409, 'Payment already exists for this booking');
  }

  // Create Stripe payment intent
  const paymentIntent = await createPaymentIntent(booking.totalAmount, 'usd', {
    bookingId: booking.id,
    customerId: userId,
    technicianId: booking.technicianId,
    serviceId: booking.serviceId,
  });

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      userId,
      transactionId: paymentIntent.id, // ✅ Changed from providerId to transactionId
      amount: booking.totalAmount,
      method: 'card',
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING,
      // currency field removed - not in schema
    },
  });

  return {
    payment,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
};

export const confirmPayment = async (paymentIntentId: string) => {
  // Retrieve payment intent from Stripe
  const paymentIntent = await retrievePaymentIntent(paymentIntentId);

  // Find payment record by transactionId
  const payment = await prisma.payment.findFirst({
    where: { transactionId: paymentIntentId }, // ✅ Changed from providerId to transactionId
    include: {
      booking: {
        include: {
          customer: true,
          technician: {
            include: {
              user: true,
            },
          },
          service: true,
        },
      },
    },
  });

  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  // Update payment status based on Stripe status
  let status: PaymentStatus;
  let paidAt: Date | null = null;

  switch (paymentIntent.status) {
    case 'succeeded':
      status = PaymentStatus.COMPLETED;
      paidAt = new Date();
      break;
    case 'canceled':
    case 'requires_payment_method':
      status = PaymentStatus.FAILED;
      break;
    default:
      status = PaymentStatus.PENDING;
  }

  // Update payment record
  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status,
      paidAt,
    },
    include: {
      booking: {
        include: {
          customer: true,
          technician: {
            include: {
              user: true,
            },
          },
          service: true,
        },
      },
    },
  });

  // If payment is completed, update booking status to PAID
  if (status === PaymentStatus.COMPLETED) {
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: BookingStatus.PAID },
    });
  }

  return updatedPayment;
};

export const getPaymentHistory = async (userId: string) => {
  return prisma.payment.findMany({
    where: { userId },
    include: {
      booking: {
        include: {
          service: true,
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
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getPaymentById = async (paymentId: string, userId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: {
        include: {
          service: true,
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
        },
      },
    },
  });

  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  if (payment.userId !== userId) {
    throw new ApiError(403, 'You can only view your own payments');
  }

  return payment;
};

export const handleStripeWebhook = async (event: any) => {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await confirmPayment(event.data.object.id);
      break;
    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      await prisma.payment.updateMany({
        where: { transactionId: paymentIntent.id }, // ✅ Changed from providerId to transactionId
        data: { status: PaymentStatus.FAILED },
      });
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};
