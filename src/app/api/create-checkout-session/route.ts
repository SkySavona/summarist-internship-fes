import { NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdmin } from "@/services/firebaseAdmin";
import Stripe from "stripe";

const env = process.env.NODE_ENV || "development";
console.log(`[ENV] Current environment: ${env}`);

const config: { [key: string]: any } = {
  development: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY_TEST,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST,
    products: {
      premiumMonthly: {
        priceId: "price_1Ppg2VRpLrmHfjrMN3kq31Ux", // test premium monthly
        productId: "prod_Qh4Ak2lhk3ZvIi",
      },
      premiumYearly: {
        priceId: "price_1Ppg1XRpLrmHfjrMuDkIbZGr", // test premium yearly
        productId: "prod_Qh49vea9psPMhn",
      },
    },
  },
  production: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY_LIVE,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE,
    products: {
      premiumMonthly: {
        priceId: "price_1PpsV3RpLrmHfjrM9Cq0K4we", // live premium monthly
        productId: "prod_QhOCBH8vWYXTOI",
      },
      premiumYearly: {
        priceId: "price_1PpsU8RpLrmHfjrMNkKbH9yl", // live premium yearly
        productId: "prod_QhOBQAMoYtGNRg",
      },
    },
  },
  test: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY_TEST,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST,
    products: {
      premiumMonthly: {
        priceId: "price_1Ppg2VRpLrmHfjrMN3kq31Ux", // test premium monthly
        productId: "prod_Qh4Ak2lhk3ZvIi",
      },
      premiumYearly: {
        priceId: "price_1Ppg1XRpLrmHfjrMuDkIbZGr", // test premium yearly
        productId: "prod_Qh49vea9psPMhn",
      },
    },
  },
};

console.log(`[STRIPE] Secret Key: ${config[env].stripeSecretKey}`);
console.log(`[STRIPE] Publishable Key: ${config[env].stripePublishableKey}`);

let stripe: Stripe;
try {
  stripe = new Stripe(config[env].stripeSecretKey ?? "", {
    apiVersion: "2024-06-20",
  });
  console.log("[STRIPE] Stripe instance created successfully");
} catch (error) {
  console.error("[STRIPE] Error creating Stripe instance:", error);
  throw error;
}

async function updateUserDocument(firestore: any, uid: string, data: any) {
  try {
    console.log(`[FIRESTORE] Updating user document for UID: ${uid} with data:`, data);
    const userRef = firestore.collection("users").doc(uid);
    await userRef.set(data, { merge: true });
    console.log(`[FIRESTORE] User document updated successfully for UID: ${uid}`);
  } catch (error) {
    console.error(`[FIRESTORE] Failed to update user document for UID: ${uid}`, error);
    throw new Error(`Failed to update user document for ${uid}`);
  }
}

async function createLibraryDocument(
  firestore: any,
  uid: string,
  bookData: any
) {
  try {
    console.log(`[FIRESTORE] Creating library document for UID: ${uid} with book data:`, bookData);
    const libraryRef = firestore.collection("library").doc(uid);
    await libraryRef.set(
      {
        books: [
          {
            bookId: bookData.id,
            title: bookData.title,
            subscriptionRequired: true,
            addedAt: FieldValue.serverTimestamp(),
          },
        ],
      },
      { merge: true }
    );
    console.log(`[FIRESTORE] Library document created successfully for UID: ${uid}`);
  } catch (error) {
    console.error(`[FIRESTORE] Failed to create library document for UID: ${uid}`, error);
    throw new Error(`Failed to create library document for ${uid}`);
  }
}

async function ensureUserDocumentExists(
  firestore: any,
  uid: string,
  userData: any
) {
  try {
    console.log(`[FIRESTORE] Ensuring user document exists for UID: ${uid}`);
    const userRef = firestore.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log(`[FIRESTORE] User document does not exist for UID: ${uid}. Creating new document.`);
      await userRef.set(userData);
    } else {
      console.log(`[FIRESTORE] User document already exists for UID: ${uid}`);
    }
  } catch (error) {
    console.error(`[FIRESTORE] Failed to ensure user document for UID: ${uid}`, error);
    throw new Error(`Failed to ensure user document for ${uid}`);
  }
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

    console.log("[FIREBASE] Initializing Firebase Admin");
    const firebaseAdmin = getFirebaseAdmin();
    console.log("[FIREBASE] Firebase Admin initialized successfully");

    console.log("[FIRESTORE] Getting Firestore instance");
    const firestore = getFirestore(firebaseAdmin);
    console.log("[FIRESTORE] Firestore instance obtained successfully");

    console.log(`[FIRESTORE] Fetching user document for UID: ${uid}`);
    const userDoc = await firestore.collection("users").doc(uid).get();
    let userData = userDoc.data();
    console.log("[FIRESTORE] Fetched user document:", userData);

    if (!userData) {
      console.log(`[FIRESTORE] User data is missing for UID: ${uid}. Creating new user data.`);
      userData = {
        email: "user@example.com",
        createdAt: FieldValue.serverTimestamp(),
      };
      await ensureUserDocumentExists(firestore, uid, userData);
      console.log(`[FIRESTORE] New user data created for UID: ${uid}`);
    }

    let customerId = userData.stripeCustomerId;

    if (!customerId) {
      console.log(`[STRIPE] Stripe customer ID not found for UID: ${uid}. Creating new Stripe customer.`);
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: { firebaseUID: uid },
      });
      customerId = customer.id;
      console.log(`[STRIPE] Created new Stripe customer with ID: ${customerId}`);

      console.log(`[FIRESTORE] Updating user document with Stripe customer ID`);
      await updateUserDocument(firestore, uid, {
        stripeCustomerId: customerId,
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

    console.log("[FIRESTORE] Updating user document with checkout session info");
    await updateUserDocument(firestore, uid, {
      latestCheckoutSession: {
        sessionId: session.id,
        created: FieldValue.serverTimestamp(),
        mode: session.mode,
        priceId,
        success_url,
        cancel_url,
      },
      subscriptionStatus: "active",
      subscriptionPriceId: priceId,
      firebaseRole: firebaseRole,
    });

    if (bookData) {
      console.log("[FIRESTORE] Creating library document with book data");
      await createLibraryDocument(firestore, uid, bookData);
    }

    console.log("[API] Returning successful response with session ID:", session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("[API] Detailed error in create-checkout-session:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}