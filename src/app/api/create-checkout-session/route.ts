import { NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdmin } from "@/services/firebaseAdmin";
import Stripe from "stripe";

// Dynamic configuration based on environment
const env = process.env.NODE_ENV || 'development';
const config: { [key: string]: any } = {
  development: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY_TEST,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST,
    products: {
      premiumMonthly: {
        priceId: 'price_1Ppg2VRpLrmHfjrMN3kq31Ux', // test premium monthly
        productId: 'prod_Qh4Ak2lhk3ZvIi'
      },
      premiumYearly: {
        priceId: 'price_1Ppg1XRpLrmHfjrMuDkIbZGr', // test premium yearly
        productId: 'prod_Qh49vea9psPMhn'
      }
    }
  },
  production: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY_LIVE,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE,
    products: {
      premiumMonthly: {
        priceId: 'price_1PpsV3RpLrmHfjrM9Cq0K4we', // live premium monthly
        productId: 'prod_QhOCBH8vWYXTOI'
      },
      premiumYearly: {
        priceId: 'price_1PpsU8RpLrmHfjrMNkKbH9yl', // live premium yearly
        productId: 'prod_QhOBQAMoYtGNRg'
      }
    }
  },
  test: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY_TEST,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST,
    products: {
      premiumMonthly: {
        priceId: 'price_1Ppg2VRpLrmHfjrMN3kq31Ux', // test premium monthly
        productId: 'prod_Qh4Ak2lhk3ZvIi'
      },
      premiumYearly: {
        priceId: 'price_1Ppg1XRpLrmHfjrMuDkIbZGr', // test premium yearly
        productId: 'prod_Qh49vea9psPMhn'
      }
    }
  }
};

const stripe = new Stripe(config[env].stripeSecretKey ?? "", {
  apiVersion: "2024-06-20",
});

async function updateUserDocument(firestore: any, uid: string, data: any) {
  try {
    console.log(`updateUserDocument: Updating user ${uid} with data:`, data);
    const userRef = firestore.collection("users").doc(uid);
    await userRef.set(data, { merge: true });
    console.log(`updateUserDocument: User ${uid} updated successfully.`);
  } catch (error) {
    console.error(`updateUserDocument: Failed to update user ${uid}:`, error);
    throw new Error(`Failed to update user document for ${uid}`);
  }
}

async function createLibraryDocument(
  firestore: any,
  uid: string,
  bookData: any
) {
  try {
    console.log(
      `createLibraryDocument: Creating library document for user ${uid} with book data:`,
      bookData
    );
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
    console.log(
      `createLibraryDocument: Library document for user ${uid} created successfully.`
    );
  } catch (error) {
    console.error(
      `createLibraryDocument: Failed to create library document for user ${uid}:`,
      error
    );
    throw new Error(`Failed to create library document for ${uid}`);
  }
}

async function ensureUserDocumentExists(firestore: any, uid: string, userData: any) {
  try {
    console.log(`ensureUserDocumentExists: Checking existence of user document for UID: ${uid}`);
    const userRef = firestore.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log(`ensureUserDocumentExists: User document not found. Creating new document for UID: ${uid}`);
      await userRef.set(userData);
      console.log(`ensureUserDocumentExists: User document created for UID: ${uid}`);
    } else {
      console.log(`ensureUserDocumentExists: User document already exists for UID: ${uid}`);
    }
  } catch (error) {
    console.error(`ensureUserDocumentExists: Failed to ensure user document for UID: ${uid}:`, error);
    throw new Error(`Failed to ensure user document for ${uid}`);
  }
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    console.log("POST: Received request with body:", requestBody);

    const { priceId, success_url, cancel_url, uid, bookData } = requestBody;

    if (!priceId || !success_url || !uid) {
      console.error("POST: Missing required parameters:", {
        priceId,
        success_url,
        cancel_url,
        uid,
        bookData,
      });
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    console.log("POST: Parameters received:", {
      priceId,
      success_url,
      cancel_url,
      uid,
      bookData,
    });

    const firestore = getFirestore(getFirebaseAdmin());
    console.log("POST: Firestore initialized.");

    const userDoc = await firestore.collection("users").doc(uid).get();
    let userData = userDoc.data();

    // Ensure the user document exists in Firestore
    if (!userData) {
      console.log(`POST: User document not found for UID: ${uid}. Creating a new user document.`);
      userData = {
        email: "user@example.com", // Replace with actual email or fetch from request if available
        createdAt: FieldValue.serverTimestamp(),
        // other default data as necessary
      };
      await ensureUserDocumentExists(firestore, uid, userData);
    }

    let customerId = userData.stripeCustomerId;
    console.log("POST: Stripe customer ID:", customerId);

    if (!customerId) {
      console.log("POST: Creating new Stripe customer for UID:", uid);
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: { firebaseUID: uid },
      });
      customerId = customer.id;
      console.log("POST: Stripe customer created with ID:", customerId);

      await updateUserDocument(firestore, uid, {
        stripeCustomerId: customerId,
      });
    }

    console.log("POST: Creating Stripe checkout session.");
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
    console.log("POST: Stripe checkout session created:", session.id);

    let firebaseRole = "Basic";
    if (
      priceId === config[env].products.premiumMonthly.priceId ||
      priceId === config[env].products.premiumYearly.priceId
    ) {
      firebaseRole = "Premium";
    }
    console.log("POST: Firebase role assigned:", firebaseRole);

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
      console.log("POST: Creating library document for book data.");
      await createLibraryDocument(firestore, uid, bookData);
    }

    console.log("POST: Response successful, session ID:", session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("POST: Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
