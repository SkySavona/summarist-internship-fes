import { NextResponse } from "next/server";
import Stripe from "stripe";
import axios from "axios";
import { google } from "googleapis";

const env = process.env.NODE_ENV || "development";
console.log(`[ENV] Current environment: ${env}`);

const config: { [key: string]: any } = {
  development: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY_TEST,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST,
    products: {
      premiumMonthly: {
        priceId: "price_1Ppg2VRpLrmHfjrMN3kq31Ux",
        productId: "prod_Qh4Ak2lhk3ZvIi",
      },
      premiumYearly: {
        priceId: "price_1Ppg1XRpLrmHfjrMuDkIbZGr",
        productId: "prod_Qh49vea9psPMhn",
      },
    },
  },
  production: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY_LIVE,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE,
    products: {
      premiumMonthly: {
        priceId: "price_1PpsV3RpLrmHfjrM9Cq0K4we",
        productId: "prod_QhOCBH8vWYXTOI",
      },
      premiumYearly: {
        priceId: "price_1PpsU8RpLrmHfjrMNkKbH9yl",
        productId: "prod_QhOBQAMoYtGNRg",
      },
    },
  },
};


console.log(`[STRIPE] Secret Key: ${config[env].stripeSecretKey}`);
console.log(`[STRIPE] Publishable Key: ${config[env].stripePublishableKey}`);

const stripe = new Stripe(config[env].stripeSecretKey ?? "", {
  apiVersion: "2024-06-20",
});

async function getAccessToken() {
  const scopes = ["https://www.googleapis.com/auth/datastore"];
  const jwtClient = new google.auth.JWT(
    process.env.FIREBASE_CLIENT_EMAIL,
    undefined,
    process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes
  );
  const tokens = await jwtClient.authorize();
  return tokens.access_token;
}

async function firestoreRequest(method: string, path: string, data?: any) {
  const accessToken = await getAccessToken();
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
  const url = `${baseUrl}${path}`;
  
  try {
    const response = await axios({
      method,
      url,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data,
    });
    return response.data;
  } catch (error) {
    console.error(`Firestore API error:`, ((error as any).response?.data || (error as any).message) as any);
    throw error;
  }
}

async function getUserDocument(uid: string) {
  console.log(`[FIRESTORE] Fetching user document for UID: ${uid}`);
  const response = await firestoreRequest('GET', `/users/${uid}`);
  console.log("[FIRESTORE] Fetched user document:", response);
  return response.fields;
}

async function updateUserDocument(uid: string, data: any) {
  console.log(`[FIRESTORE] Updating user document for UID: ${uid} with data:`, data);
  await firestoreRequest('PATCH', `/users/${uid}`, { fields: data });
  console.log(`[FIRESTORE] User document updated successfully for UID: ${uid}`);
}

async function createLibraryDocument(uid: string, bookData: any) {
  console.log(`[FIRESTORE] Creating library document for UID: ${uid} with book data:`, bookData);
  await firestoreRequest('PATCH', `/library/${uid}`, {
    fields: {
      books: {
        arrayValue: {
          values: [{
            mapValue: {
              fields: {
                bookId: { stringValue: bookData.id },
                title: { stringValue: bookData.title },
                subscriptionRequired: { booleanValue: true },
                addedAt: { timestampValue: new Date().toISOString() },
              },
            },
          }],
        },
      },
    },
  });
  console.log(`[FIRESTORE] Library document created successfully for UID: ${uid}`);
}

export async function POST(req: Request) {
  console.log("[API] POST request received at /api/create-checkout-session");
  try {
    const requestBody = await req.json();
    console.log("[API] Request body:", requestBody);

    const { priceId, success_url, cancel_url, uid, bookData } = requestBody;

    if (!priceId || !success_url || !uid) {
      console.error("[API] Missing required parameters");
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    let userData = await getUserDocument(uid);

    if (!userData) {
      console.log(`[FIRESTORE] User data is missing for UID: ${uid}. Creating new user data.`);
      userData = {
        email: { stringValue: "user@example.com" },
        createdAt: { timestampValue: new Date().toISOString() },
      };
      await updateUserDocument(uid, userData);
    }

    let customerId = userData.stripeCustomerId?.stringValue;

    if (!customerId) {
      console.log(`[STRIPE] Stripe customer ID not found for UID: ${uid}. Creating new Stripe customer.`);
      const customer = await stripe.customers.create({
        email: userData.email.stringValue,
        metadata: { firebaseUID: uid },
      });
      customerId = customer.id;
      console.log(`[STRIPE] Created new Stripe customer with ID: ${customerId}`);

      await updateUserDocument(uid, {
        stripeCustomerId: { stringValue: customerId },
      });
    }

    console.log("[STRIPE] Creating Stripe Checkout session...");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url,
      cancel_url,
      metadata: bookData
        ? { bookId: bookData.id, bookTitle: bookData.title }
        : undefined,
    });
    console.log("[STRIPE] Stripe Checkout session created successfully:", session.id);

    let firebaseRole = "Basic";
    if (
      priceId === config[env].products.premiumMonthly.priceId ||
      priceId === config[env].products.premiumYearly.priceId
    ) {
      firebaseRole = "Premium";
    }
    console.log(`[API] Determined Firebase role: ${firebaseRole}`);

    await updateUserDocument(uid, {
      latestCheckoutSession: {
        mapValue: {
          fields: {
            sessionId: { stringValue: session.id },
            created: { timestampValue: new Date().toISOString() },
            mode: { stringValue: session.mode },
            priceId: { stringValue: priceId },
            success_url: { stringValue: success_url },
            cancel_url: { stringValue: cancel_url },
          },
        },
      },
      subscriptionStatus: { stringValue: "active" },
      subscriptionPriceId: { stringValue: priceId },
      firebaseRole: { stringValue: firebaseRole },
    });

    if (bookData) {
      await createLibraryDocument(uid, bookData);
    }

    console.log("[API] Returning successful response with session ID:", session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("[API] Detailed error in create-checkout-session:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as any).message },
      { status: 500 }
    );
  }
}