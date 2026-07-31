import type { Request, Response } from 'express';
import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import {
  createPayment,
  confirmPayment,
  getPaymentById,
  getUserPayments,
  handleStripeWebhook,
  refundPayment,
} from './payments.service';
import type { CreatePaymentInput, ConfirmPaymentInput } from './payments.validation';

/**
 * Create a payment
 */
export const createPaymentController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  console.log('💰 createPaymentController - userId:', req.user.id);
  const input = req.body as CreatePaymentInput;
  const payment = await createPayment(req.user.id, input);

  sendResponse(res, 201, 'Payment created successfully', payment);
});

/**
 * Confirm payment
 */
export const confirmPaymentController = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.body as ConfirmPaymentInput;
  console.log('💰 confirmPaymentController - transactionId:', transactionId);

  const payment = await confirmPayment(transactionId);
  sendResponse(res, 200, 'Payment confirmed successfully', payment);
});

/**
 * Get payment by ID
 */
export const getPaymentController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const { id } = req.params;
  // ✅ Fix: Ensure id is a string
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid payment ID');
  }

  console.log('💰 getPaymentController - id:', id, 'userId:', req.user.id);

  const payment = await getPaymentById(id, req.user.id, req.user.role);
  sendResponse(res, 200, 'Payment fetched successfully', payment);
});

/**
 * Get user's payment history
 */
export const getMyPaymentsController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  console.log('💰 getMyPaymentsController - userId:', req.user.id);
  const payments = await getUserPayments(req.user.id, req.user.role);
  sendResponse(res, 200, 'Payments fetched successfully', payments);
});

/**
 * Stripe webhook handler
 */
export const stripeWebhookController = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  console.log('💰 stripeWebhookController - signature:', signature ? '✅' : '❌');

  // In production, verify webhook signature
  // const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);

  // For now, parse the event from the body
  const event = req.body;
  await handleStripeWebhook(event);

  sendResponse(res, 200, 'Webhook processed successfully');
});

/**
 * Refund payment
 */
export const refundPaymentController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const { id } = req.params;
  // ✅ Fix: Ensure id is a string
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid payment ID');
  }

  console.log('💰 refundPaymentController - id:', id, 'userId:', req.user.id);

  const payment = await refundPayment(id, req.user.id, req.user.role);
  sendResponse(res, 200, 'Payment refunded successfully', payment);
});
