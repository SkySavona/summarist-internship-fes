import { NextResponse } from 'next/server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getFirebaseAdmin } from '@/services/firebaseAdmin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: Request) {
  try {
    const { priceId, success_url, cancel_url, uid } = await req.json();

    if (!priceId || !success_url || !uid) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Capture the referrer URL and provide a fallback if it's null
    const referrerUrl = req.headers.get('referer') || cancel_url;

    const firestore = getFirestore(getFirebaseAdmin());

    // Get user data
    const userDoc = await firestore.collection('users').doc(uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has a Stripe customer ID
    let customerId = userData.stripeCustomerId;

    if (!customerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: { firebaseUID: uid }
      });
      customerId = customer.id;

      // Update user document with Stripe customer ID
      await firestore.collection('users').doc(uid).update({ stripeCustomerId: customerId });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url,
      cancel_url: referrerUrl || undefined, // Ensure cancel_url is a string or undefined
    });

    // Create a checkout session document in Firestore
    await firestore
      .collection('users')
      .doc(uid)
      .collection('checkout_sessions')
      .add({
        sessionId: session.id,
        created: FieldValue.serverTimestamp(),
        mode: session.mode,
        priceId,
        success_url,
        cancel_url: referrerUrl || undefined,
      });

    console.log('Checkout session created:', session.id);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
