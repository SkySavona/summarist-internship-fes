import { NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdmin } from "@/services/firebaseAdmin";
import Stripe from "stripe";

const env = process.env.NODE_ENV || "development";
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

const stripe = new Stripe(config[env].stripeSecretKey ?? "", {
  apiVersion: "2024-06-20",
});

async function updateUserDocument(firestore: any, uid: string, data: any) {
  try {
    const userRef = firestore.collection("users").doc(uid);
    await userRef.set(data, { merge: true });
  } catch (error) {
    throw new Error(`Failed to update user document for ${uid}`);
  }
}

async function createLibraryDocument(
  firestore: any,
  uid: string,
  bookData: any
) {
  try {
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
  } catch (error) {
    throw new Error(`Failed to create library document for ${uid}`);
  }
}

async function ensureUserDocumentExists(
  firestore: any,
  uid: string,
  userData: any
) {
  try {
    const userRef = firestore.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set(userData);
    } else {
    }
  } catch (error) {
    throw new Error(`Failed to ensure user document for ${uid}`);
  }
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();

    const { priceId, success_url, cancel_url, uid, bookData } = requestBody;

    if (!priceId || !success_url || !uid) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const firestore = getFirestore(getFirebaseAdmin());

    const userDoc = await firestore.collection("users").doc(uid).get();
    let userData = userDoc.data();

    if (!userData) {
      userData = {
        email: "user@example.com",
        createdAt: FieldValue.serverTimestamp(),
      };
      await ensureUserDocumentExists(firestore, uid, userData);
    }

    let customerId = userData.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: { firebaseUID: uid },
      });
      customerId = customer.id;

      await updateUserDocument(firestore, uid, {
        stripeCustomerId: customerId,
      });
    }

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

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
