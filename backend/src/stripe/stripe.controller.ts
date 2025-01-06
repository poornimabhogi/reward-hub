import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() product: {
    name: string;
    price: number;
    quantity: number;
  }) {
    const session = await this.stripeService.createCheckoutSession(product);
    return { url: session.url };
  }
}