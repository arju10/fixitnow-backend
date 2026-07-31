import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';
import { stripe } from '../../lib/stripe'; // ✅ Fixed import path
import type { CreatePaymentInput } from './payments.validation';
import { PaymentStatus, BookingStatus } from '@prisma/client';

/**
 * Create a payment for a booking
 */
export const createPayment = async (userId: string, input: CreatePaymentInput) => {
  const { bookingId, provider } = input;

  console.log('💰 Creating payment for booking:', bookingId, 'provider:', provider);

  // 1. Get booking details
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

  // 2. Check if user owns this booking
  if (booking.customerId !== userId) {
    throw new ApiError(403, 'You can only pay for your own bookings');
  }

  // 3. Check if booking is accepted
  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new ApiError(400, 'Booking must be accepted before payment');
  }

  // 4. Check if payment already exists
  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (existingPayment) {
    throw new ApiError(409, 'Payment already exists for this booking');
  }

  // 5. Generate transaction ID
  const transactionId = `FIX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // 6. Create payment intent based on provider
  let providerTransactionId: string;

  if (provider === 'STRIPE') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(booking.totalAmount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          bookingId: booking.id,
          customerId: userId,
          technicianId: booking.technicianId,
          transactionId,
        },
        description: `Payment for booking ${booking.id}`,
      });
      providerTransactionId = paymentIntent.id;
    } catch (error) {
      console.error('Stripe error:', error);
      throw new ApiError(500, 'Failed to create Stripe payment intent');
    }
  } else {
    // SSLCommerz - For now, we'll simulate it
    providerTransactionId = `SSLC_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    console.log('💰 SSLCommerz payment simulated:', providerTransactionId);
  }

  // 7. Create payment record
  const newPayment = await prisma.payment.create({
    data: {
      bookingId,
      userId,
      transactionId,
      amount: booking.totalAmount,
      method: 'card',
      provider,
      providerTransactionId,
      status: PaymentStatus.PENDING,
    },
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  console.log('💰 Payment created:', newPayment.id, 'transactionId:', transactionId);

  // 8. Return payment with client secret for Stripe
  if (provider === 'STRIPE') {
    return {
      ...newPayment,
      clientSecret: providerTransactionId, // In real implementation, you'd get this from Stripe
    };
  }

  return newPayment;
};

/**
 * Confirm payment (webhook or manual)
 */
export const confirmPayment = async (transactionId: string) => {
  console.log('💰 Confirming payment for transactionId:', transactionId);

  // 1. Find payment by transaction ID
  const existingPayment = await prisma.payment.findUnique({
    where: { transactionId },
    include: {
      booking: true,
    },
  });

  if (!existingPayment) {
    throw new ApiError(404, 'Payment not found');
  }

  if (existingPayment.status === PaymentStatus.COMPLETED) {
    throw new ApiError(400, 'Payment already completed');
  }

  // 2. Update payment status to COMPLETED
  const updatedPayment = await prisma.$transaction(async (tx) => {
    // Update payment
    const payment = await tx.payment.update({
      where: { id: existingPayment.id },
      data: {
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    });

    // Update booking status to PAID
    await tx.booking.update({
      where: { id: payment.bookingId },
      data: { status: BookingStatus.PAID },
    });

    return payment;
  });

  console.log('💰 Payment confirmed:', updatedPayment.id);

  return updatedPayment;
};

/**
 * Get payment by ID
 */
export const getPaymentById = async (paymentId: string, userId: string, userRole: string) => {
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  // Check access: customer who paid, admin, or technician of the booking
  if (
    userRole !== 'ADMIN' &&
    payment.userId !== userId &&
    payment.booking.technician.userId !== userId
  ) {
    throw new ApiError(403, 'You do not have access to this payment');
  }

  return payment;
};

/**
 * Get user's payment history
 */
export const getUserPayments = async (userId: string, userRole: string) => {
  const where: any = {};

  if (userRole === 'ADMIN') {
    // Admin can see all payments
  } else if (userRole === 'TECHNICIAN') {
    // Technician can see payments for their bookings
    const technician = await prisma.technicianProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (technician) {
      where.booking = {
        technicianId: technician.id,
      };
    }
  } else {
    // Customer can see their own payments
    where.userId = userId;
  }

  return prisma.payment.findMany({
    where,
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Handle Stripe webhook
 */
export const handleStripeWebhook = async (event: any) => {
  console.log('💰 Stripe webhook received:', event.type);

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const transactionId = paymentIntent.metadata?.transactionId;

      if (transactionId) {
        try {
          await confirmPayment(transactionId);
          console.log('💰 Payment confirmed via webhook:', transactionId);
        } catch (error) {
          console.error('💰 Webhook error:', error);
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const transactionId = paymentIntent.metadata?.transactionId;

      if (transactionId) {
        await prisma.payment.update({
          where: { transactionId },
          data: { status: PaymentStatus.FAILED },
        });
        console.log('💰 Payment failed:', transactionId);
      }
      break;
    }

    default:
      console.log('💰 Unhandled webhook event:', event.type);
  }
};

/**
 * Refund payment (optional)
 */
export const refundPayment = async (paymentId: string, userId: string, userRole: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: true,
    },
  });

  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  if (userRole !== 'ADMIN' && payment.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to refund this payment');
  }

  if (payment.status !== PaymentStatus.COMPLETED) {
    throw new ApiError(400, 'Only completed payments can be refunded');
  }

  // In production, you would call Stripe refund API here
  // await stripe.refunds.create({ payment_intent: payment.providerTransactionId });

  const updatedPayment = await prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.REFUNDED },
    });

    await tx.booking.update({
      where: { id: payment.bookingId },
      data: { status: BookingStatus.CANCELLED },
    });

    return updated;
  });

  console.log('💰 Payment refunded:', paymentId);
  return updatedPayment;
};
