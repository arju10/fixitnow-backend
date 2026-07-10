import Stripe from 'stripe';
import config from '../config';

if (!config.stripe_secret_key) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(config.stripe_secret_key, {
  apiVersion: '2026-06-24.dahlia',
  typescript: true,
});

export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> => {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
  });
};

export const retrievePaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  return stripe.paymentIntents.retrieve(paymentIntentId);
};

export const constructWebhookEvent = (
  payload: Buffer | string,
  signature: string,
  webhookSecret: string
): Stripe.Event => {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
};
