import { NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdmin } from "@/services/firebaseAdmin";
import Stripe from "stripe";

const env = process.env.NODE_ENV || "development";
console.log(`Environment: ${env}`);

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

console.log(`Stripe Secret Key: ${config[env].stripeSecretKey}`);
console.log(`Stripe Publishable Key: ${config[env].stripePublishableKey}`);

const stripe = new Stripe(config[env].stripeSecretKey ?? "", {
  apiVersion: "2024-06-20",
});

async function updateUserDocument(firestore: any, uid: string, data: any) {
  try {
    console.log(`Updating user document for UID: ${uid} with data:`, data);
    const userRef = firestore.collection("users").doc(uid);
    await userRef.set(data, { merge: true });
    console.log(`User document updated successfully for UID: ${uid}`);
  } catch (error) {
    console.error(`Failed to update user document for UID: ${uid}`, error);
    throw new Error(`Failed to update user document for ${uid}`);
  }
}

async function createLibraryDocument(
  firestore: any,
  uid: string,
  bookData: any
) {
  try {
    console.log(`Creating library document for UID: ${uid} with book data:`, bookData);
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
    console.log(`Library document created successfully for UID: ${uid}`);
  } catch (error) {
    console.error(`Failed to create library document for UID: ${uid}`, error);
    throw new Error(`Failed to create library document for ${uid}`);
  }
}

async function ensureUserDocumentExists(
  firestore: any,
  uid: string,
  userData: any
) {
  try {
    console.log(`Ensuring user document exists for UID: ${uid}`);
    const userRef = firestore.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log(`User document does not exist for UID: ${uid}. Creating new document.`);
      await userRef.set(userData);
    } else {
      console.log(`User document already exists for UID: ${uid}`);
    }
  } catch (error) {
    console.error(`Failed to ensure user document for UID: ${uid}`, error);
    throw new Error(`Failed to ensure user document for ${uid}`);
  }
}

export async function POST(req: Request) {
  try {
    console.log("Received request at /api/create-checkout-session");
    const requestBody = await req.json();
    console.log("Request body:", requestBody);

    const { priceId, success_url, cancel_url, uid, bookData } = requestBody;

    if (!priceId || !success_url || !uid) {
      console.error("Missing required parameters");
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const firestore = getFirestore(getFirebaseAdmin());
    console.log("Initialized Firestore");

    const userDoc = await firestore.collection("users").doc(uid).get();
    let userData = userDoc.data();
    console.log("Fetched user document:", userData);

    if (!userData) {
      console.log(`User data is missing for UID: ${uid}. Creating new user data.`);
      userData = {
        email: "user@example.com",
        createdAt: FieldValue.serverTimestamp(),
      };
      await ensureUserDocumentExists(firestore, uid, userData);
    }

    let customerId = userData.stripeCustomerId;

    if (!customerId) {
      console.log(`Stripe customer ID not found for UID: ${uid}. Creating new Stripe customer.`);
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: { firebaseUID: uid },
      });
      customerId = customer.id;
      console.log(`Created new Stripe customer with ID: ${customerId}`);

      await updateUserDocument(firestore, uid, {
        stripeCustomerId: customerId,
      });
    }

    console.log("Creating Stripe Checkout session...");
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
    console.log("Stripe Checkout session created successfully:", session.id);

    let firebaseRole = "Basic";
    if (
      priceId === config[env].products.premiumMonthly.priceId ||
      priceId === config[env].products.premiumYearly.priceId
    ) {
      firebaseRole = "Premium";
    }

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
      await createLibraryDocument(firestore, uid, bookData);
    }

    console.log("Returning successful response with session ID:", session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error in create-checkout-session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
