import { Router } from 'express';
import {
  createPaymentController,
  confirmPaymentController,
  getPaymentController,
  getMyPaymentsController,
  stripeWebhookController,
  refundPaymentController,
} from './payments.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createPaymentSchema, confirmPaymentSchema } from './payments.validation';

const router = Router();

// ============================================
// PUBLIC WEBHOOK ROUTE
// ============================================

// Stripe webhook (no auth - Stripe uses signature verification)
router.post('/webhook', stripeWebhookController);

// ============================================
// PROTECTED ROUTES
// ============================================

router.use(protect);

// Create payment
router.post(
  '/create',
  restrictTo('CUSTOMER'),
  validate(createPaymentSchema),
  createPaymentController
);

// Confirm payment (could be called by frontend after successful payment)
router.post(
  '/confirm',
  restrictTo('CUSTOMER'),
  validate(confirmPaymentSchema),
  confirmPaymentController
);

// Get my payment history
router.get('/', getMyPaymentsController);

// Get payment by ID
router.get('/:id', getPaymentController);

// Refund payment (admin or customer who paid)
router.post('/:id/refund', refundPaymentController);

export default router;
