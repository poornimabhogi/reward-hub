import { Controller, Post, Body, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { Request } from 'express';
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

  // New webhook endpoint
  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    return this.stripeService.handleWebhookEvent(signature, request.rawBody);
  }
}