import { stripe } from './src/lib/stripe';

async function testStripe() {
  try {
    console.log('🔄 Testing Stripe connection...');
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    
    console.log('✅ Stripe connected successfully!');
    console.log('📋 Payment Intent ID:', paymentIntent.id);
    console.log('📋 Client Secret:', paymentIntent.client_secret);
    
  } catch (error) {
    console.error('❌ Stripe connection failed:', error);
  }
}

testStripe();
