import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51OxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxY');

export const createCheckoutSession = async (product: {
  name: string;
  price: number;
  quantity: number;
}) => {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to initialize');

  // Create a Stripe Checkout Session
  const { error } = await stripe.redirectToCheckout({
    mode: 'payment',
    lineItems: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100, // Stripe expects amount in cents
        },
        quantity: product.quantity,
      },
    ],
    successUrl: `${window.location.origin}/shop?success=true`,
    cancelUrl: `${window.location.origin}/shop?canceled=true`,
  });

  if (error) {
    throw new Error(error.message);
  }
};