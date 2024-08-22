import { NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdmin } from "@/services/firebaseAdmin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

async function updateUserDocument(firestore: any, uid: string, data: any) {
  const userRef = firestore.collection("users").doc(uid);
  await userRef.set(data, { merge: true });
}

async function createLibraryDocument(
  firestore: any,
  uid: string,
  bookData: any
) {
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
}

export async function POST(req: Request) {
  try {
    const { priceId, success_url, cancel_url, uid, bookData } =
      await req.json();

    if (!priceId || !success_url || !uid) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const firestore = getFirestore(getFirebaseAdmin());

    const userDoc = await firestore.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
      priceId === "price_1Ppg1XRpLrmHfjrMuDkIbZGr" ||
      priceId === "price_1Ppg2VRpLrmHfjrMN3kq31Ux"
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
