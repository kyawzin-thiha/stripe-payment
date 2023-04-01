import {
    Controller,
    Get,
    Headers,
    HttpException,
    Post,
    RawBodyRequest,
    Request,
    Response,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) { }

    @Get('create-checkout-session')
    async createCheckoutSession(@Response() res) {
        const [redirectUrl, error] =
            await this.stripeService.generatePaymentSession();

        if (error) {
            throw new HttpException(error, 500);
        }

        res.redirect(redirectUrl);
    }

    @Post('webhook')
    async webhook(@Request() req: RawBodyRequest<Request>, @Headers() headers) {
        const signature = headers['stripe-signature'];

        const [event, webhookError] =
            this.stripeService.verifyStriptWebhookSignature(req.rawBody, signature);

        if (webhookError) {
            throw new HttpException(webhookError, 400);
        }

        switch (event.type) {
            case 'checkout.session.completed':
                const [session, sessionError] =
                    await this.stripeService.retrieveSession(event.data.object.id);

                if (sessionError) {
                    throw new HttpException(sessionError, 400);
                }

                console.log(session.metadata);
                // do something with the session metadata and products
                // such as create an order in the database
                // or send an email to the customer
                break;
            case "payment_intent.succeeded":
                // user's payment successful aka payment received
                // complete the order by retrieving the the items form database if you created an order during checkout.session.completed
                break;
            default:
                // do nothing
                break;
        }
    }
}
