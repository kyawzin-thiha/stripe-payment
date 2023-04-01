# Stripe Payment Starter Code [Live URL](https://payment.kyawzinthiha.dev)

This is a starter code for configuring stripe payment gateway to use custom products when creating checkout session using stripe prebuilt checkout page. In the example, I've also included web hooks events to manage customer's orders.

**For testing purposes please use the following card information**

- Card No - 4242 4242 4242 4242
- Expire Data - Any future date
- CVV - Any three digit
- Name on Card - Name of your choice

## Required variables

- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_SUCCESS_URL
- STRIPE_CANCEL_URL

## How to start locally?

```bash
npm run dev
```
