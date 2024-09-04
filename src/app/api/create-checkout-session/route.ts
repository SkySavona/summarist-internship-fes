import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

console.log("[ENV] Using test environment for all deployments");

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
      }),
    });
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw error;
  }
}

const db = getFirestore();

async function getUserDocument(uid: string) {
  console.log(`[FIRESTORE] Fetching user document for UID: ${uid}`);
  const docRef = db.collection("users").doc(uid);
  const doc = await docRef.get();
  if (!doc.exists) {
    console.log(`[FIRESTORE] No user document found for UID: ${uid}`);
    return null;
  }
  console.log(`[FIRESTORE] User document found: ${JSON.stringify(doc.data())}`);
  return doc.data();
}

async function getOrCreateUserData(uid: string) {
  let userData = await getUserDocument(uid);

  if (!userData || !userData.email) {
    console.log(`[AUTH] No user data found, fetching from Firebase Auth for UID: ${uid}`);
    const userRecord = await getAuth().getUser(uid);
    userData = {
      email: userRecord.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    console.log(`[FIRESTORE] Creating new user data for UID: ${uid} with email: ${userRecord.email}`);
    await db.collection("users").doc(uid).set(userData, { merge: true });
  }

  console.log(`[FIRESTORE] User data ready for UID: ${uid}: ${JSON.stringify(userData)}`);
  return userData;
}

export async function POST(req: Request) {
  try {
    const { priceId, success_url, cancel_url, uid } = await req.json();

    console.log(`[REQUEST] Received POST request with params: 
      priceId: ${priceId}, 
      success_url: ${success_url}, 
      cancel_url: ${cancel_url}, 
      uid: ${uid}`);

    if (!priceId || !success_url || !cancel_url || !uid) {
      console.error(`[REQUEST ERROR] Missing required parameters: 
        priceId: ${priceId}, 
        success_url: ${success_url}, 
        cancel_url: ${cancel_url}, 
        uid: ${uid}`);
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const userData = await getOrCreateUserData(uid);

    // Determine the trial period (7 days for yearly plan, none for monthly plan)
    let trial_period_days = 0;
    if (priceId === "price_1Ppg1XRpLrmHfjrMuDkIbZGr") {
      // Assuming this priceId corresponds to the "Premium Plus Yearly" plan
      trial_period_days = 7;
      console.log(`[TRIAL] 7-day trial applied for priceId: ${priceId}`);
    } else {
      console.log(`[TRIAL] No trial applied for priceId: ${priceId}`);
    }

    // Save checkout session info in Firestore
    const checkoutSessionData = {
      price: priceId,
      success_url,
      cancel_url,
      trial_period_days, // Save the trial period dynamically in Firestore
      created: admin.firestore.FieldValue.serverTimestamp(),
      mode: "subscription",
    };

    console.log(`[FIRESTORE] Writing checkout session data to Firestore for UID: ${uid}`);
    console.log(`[FIRESTORE] Checkout session data: ${JSON.stringify(checkoutSessionData)}`);

    const docRef = await db
      .collection("users")
      .doc(uid)
      .collection("checkout_sessions")
      .add(checkoutSessionData);

    console.log(`[FIRESTORE] Successfully written checkout session with doc ID: ${docRef.id}`);

    return NextResponse.json({ success: true, docId: docRef.id });
  } catch (error) {
    console.error("[API] Detailed error in create-checkout-session:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as any).message },
      { status: 500 }
    );
  }
}
