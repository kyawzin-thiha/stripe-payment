'use client';
import Image from "next/image";
import Button from "@mui/material/Button"
import CheckoutIcon from "@/assets/svg/checkout.svg";
export default function LandingPage() {
    return (
        <div className="container">
            <h1>Stripe Payment Testing</h1>
            <Button variant="outlined" startIcon={<Image src={CheckoutIcon} alt="checkout-icon" width={25} height={25} />} sx={{borderRadius: 3, mt: 8, py: 1, px: 1}} href={process.env.NEXT_PUBLIC_CHECKOUT_URL} >
                Continue to Checkout
            </Button>
        </div>

    )
}