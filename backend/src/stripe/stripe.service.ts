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

  async handleWebhookEvent(signature: string, payload: Buffer) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        'whsec_your_webhook_secret'
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const amount = paymentIntent.amount / 100; // Convert from cents to dollars
          // Send amount to frontend to update earnings
          this.updateFrontendEarnings(amount);
          console.log('Payment succeeded:', paymentIntent.id, 'Amount:', amount);
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

  private async updateFrontendEarnings(amount: number) {
    // In a real application, you would:
    // 1. Store this in a database
    // 2. Use WebSockets to notify the frontend
    // 3. Update the frontend state
    // For now, we're using localStorage in the frontend
    console.log('Updating earnings:', amount);
  }
}