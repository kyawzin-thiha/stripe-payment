import { Controller, Get, HttpException, Response } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) { }

    @Get("create-checkout-session")
    async createCheckoutSession(@Response() res) {
        const [redirectUrl, error] = await this.stripeService.generatePaymentSession();

        if (error) {
            throw new HttpException(error, 500);
        }

        res.redirect(redirectUrl);
    }
}
