import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-06-24.dahlia',
});

async function test() {
  try {
    console.log('🔄 Testing Stripe connection...');
    console.log('📋 Secret Key:', process.env.STRIPE_SECRET_KEY ? '✅ Loaded' : '❌ Not found');
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    
    console.log('✅ Stripe connected successfully!');
    console.log('📋 Payment Intent ID:', paymentIntent.id);
    console.log('📋 Client Secret:', paymentIntent.client_secret);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

test();
