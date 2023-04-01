import type { Stripe as StripeType } from 'stripe';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {

    constructor(private readonly configService: ConfigService) {
        this.stripe = new Stripe(this.configService.get("STRIPE_SECRET_KEY"), {
            apiVersion: "2022-11-15",
            typescript: true,
        })
    }

    private stripe: StripeType;

    async generatePaymentSession() {
        try {
            const session = await this.stripe.checkout.sessions.create({
                line_items: [
                    {
                        //use custom products instead of using products ids from stripe.com
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: "T-shirt",
                                images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dCUyMHNoaXJ0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60"],
                                description: "Comfortable cotton t-shirt",
                            },

                            // how much does the product cost in the lowest currency unit e.g. for usd it is cents, for eur it is cents, for gbp it is pence
                            unit_amount: 1000,
                        },
                        quantity: 1,

                        // users will be able to adjust the quantity of the product in the checkout page
                        adjustable_quantity: {
                            enabled: true,
                            minimum: 1,
                        },

                    }
                ],
                mode: "payment",
                submit_type: "pay",
                // can implement different payment such as google pay, apple pay, etc.
                payment_method_types: ["card"],

                // collect customers' billing addresses, can be set to required all the time
                billing_address_collection: "auto",

                // can implement shipping's options using stripe shipments
                //shipping_options: [
                //  {shipping_rate: "shipment id from stripe.com"}
                // ]

                success_url: this.configService.get("STRIPE_SUCCESS_URL"),
                cancel_url: this.configService.get("STRIPE_CANCEL_URL"),

                // add metadata to the session for retrieval from webhook
                metadata: {
                    customerId: "c_12345",
                    orderId: "o_12345",
                }

            })

            return [session.url, null]
        } catch (error) {
            console.log(error)
            return [null, "Error generating payment session"]
        }
    }

    verifyStriptWebhookSignature(body: any, signature: string): [any | null, null | string] {
        try {
            const event = this.stripe.webhooks.constructEvent(body, signature, this.configService.get("STRIPE_WEBHOOK_SECRET"))

            return [event, null]
        } catch (error) {
            console.log(error)
            return [null, "Error verifying stripe webhook signature"]
        }
    }

    async retrieveSession(sessionId: string): Promise<[any | null, string | null]> {
        try {

            const session = await this.stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] })

            //session.line_items include all products in the session, if you added metadata to the session, you can retrieve it here
            return [session, null]
        } catch (error) {
            return [null, "Error retrieving session"]
        }
    }
}
