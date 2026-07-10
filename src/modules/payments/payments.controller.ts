import type { Request, Response } from 'express';
import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import {
  createPayment,
  confirmPayment,
  getPaymentHistory,
  getPaymentById,
  handleStripeWebhook,
} from './payments.service';
import type { CreatePaymentInput, ConfirmPaymentInput } from './payments.validation';
import { stripe } from '../../lib/stripe';

export const createPaymentController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const input = req.body as CreatePaymentInput;
  const result = await createPayment(req.user.id, input);
  sendResponse(res, 201, 'Payment initiated successfully', result);
});

export const confirmPaymentController = catchAsync(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body as ConfirmPaymentInput;
  const payment = await confirmPayment(paymentIntentId);
  sendResponse(res, 200, 'Payment confirmed successfully', payment);
});

export const getPaymentHistoryController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const payments = await getPaymentHistory(req.user.id);
  sendResponse(res, 200, 'Payment history fetched successfully', payments);
});

export const getPaymentByIdController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated');
  }

  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid payment ID');
  }

  const payment = await getPaymentById(id, req.user.id);
  sendResponse(res, 200, 'Payment fetched successfully', payment);
});

export const webhookController = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new ApiError(500, 'Webhook secret not configured');
  }

  const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  await handleStripeWebhook(event);
  sendResponse(res, 200, 'Webhook processed successfully');
});
