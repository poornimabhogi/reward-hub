import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (product: {
  name: string;
  price: number;
  quantity: number;
}) => {
  try {
    // Create checkout session on backend
    const response = await fetch('http://0.0.0.0:3000/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    const { url } = await response.json();
    
    // Redirect to checkout
    window.location.href = url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create checkout session');
  }
};