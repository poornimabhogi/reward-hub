import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_secret_key', {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(product: {
    name: string;
    price: number;
    quantity: number;
    userId: string;
  }) {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100, // Convert to cents
          },
          quantity: product.quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/shop?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/shop?canceled=true`,
      metadata: {
        userId: product.userId, // Store userId in metadata
      },
    });
  }

  async handleWebhookEvent(signature: string, payload: Buffer) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret'
      );

      console.log('Received webhook event:', event.type);

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const amount = paymentIntent.amount / 100; // Convert from cents to dollars
          const userId = (paymentIntent.metadata as any).userId || 'anonymous';
          console.log('Payment succeeded:', paymentIntent.id, 'Amount:', amount, 'User:', userId);
          this.updateFrontendEarnings(amount, userId);
          break;
        
        case 'charge.succeeded':
          const charge = event.data.object as Stripe.Charge;
          console.log('Charge succeeded:', charge.id);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return { received: true };
    } catch (err) {
      console.error('Webhook error:', err.message);
      throw new Error(`Webhook Error: ${err.message}`);
    }
  }

  private async updateFrontendEarnings(amount: number, userId: string) {
    console.log('Updating earnings for user:', userId, 'Amount:', amount);
    // The frontend will handle storing this in localStorage per user
    // In a production environment, this should be stored in a database
  }
}