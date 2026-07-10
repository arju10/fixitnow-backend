import { Router } from 'express';
import {
  createPaymentController,
  confirmPaymentController,
  getPaymentHistoryController,
  getPaymentByIdController,
  webhookController,
} from './payments.controller';
import { protect } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createPaymentSchema, confirmPaymentSchema } from './payments.validation';
import express from 'express';

const router = Router();

// Webhook endpoint (no authentication, raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), webhookController);

// Protected routes
router.use(protect);

router.post('/create', validate(createPaymentSchema), createPaymentController);
router.post('/confirm', validate(confirmPaymentSchema), confirmPaymentController);
router.get('/', getPaymentHistoryController);
router.get('/:id', getPaymentByIdController);

export default router;
