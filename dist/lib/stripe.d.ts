import Stripe from 'stripe';
export declare const stripe: Stripe;
export declare const createPaymentIntent: (amount: number, currency?: string, metadata?: Record<string, string>) => Promise<Stripe.PaymentIntent>;
export declare const retrievePaymentIntent: (paymentIntentId: string) => Promise<Stripe.PaymentIntent>;
export declare const constructWebhookEvent: (payload: Buffer | string, signature: string, webhookSecret: string) => Stripe.Event;
//# sourceMappingURL=stripe.d.ts.map