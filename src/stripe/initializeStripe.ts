import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

const initializeStripe = async (): Promise<Stripe | null> => {
    if (!stripePromise) {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
            return null;
        }
        stripePromise = loadStripe(publishableKey);
    }
    return stripePromise;
}

export default initializeStripe;