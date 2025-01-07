import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe('sk_test_your_secret_key', {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(product: {
    name: string;
    price: number;
    quantity: number;
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
    });
  }

  // New method to handle webhook events
  async handleWebhookEvent(signature: string, payload: Buffer) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        'whsec_your_webhook_secret'
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('Payment succeeded:', paymentIntent.id);
          // Here you can add logic to update your database, send emails, etc.
          break;
        
        case 'charge.succeeded':
          const charge = event.data.object;
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
}