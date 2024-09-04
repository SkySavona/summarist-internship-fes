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
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.split(
          String.raw`\n`
        ).join("\n"),
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
  const docRef = db.collection("users").doc(uid);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  return doc.data();
}

async function getOrCreateUserData(uid: string) {
  let userData = await getUserDocument(uid);

  if (!userData || !userData.email) {
    const userRecord = await getAuth().getUser(uid);
    userData = {
      email: userRecord.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection("users").doc(uid).set(userData, { merge: true });
  }

  return userData;
}

export async function POST(req: Request) {
  try {
    const { priceId, success_url, cancel_url, uid } = await req.json();

    if (!priceId || !success_url || !cancel_url || !uid) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const userData = await getOrCreateUserData(uid);

    // Add a new document to the checkout_sessions sub-collection
    const docRef = await db
      .collection("users")
      .doc(uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url,
        cancel_url,
        created: admin.firestore.FieldValue.serverTimestamp(),
        mode: "subscription",
      });

    // The Stripe Firestore Extension will handle creating the session ID and redirecting the user

    return NextResponse.json({ success: true, docId: docRef.id });
  } catch (error) {
    console.error("[API] Detailed error in create-checkout-session:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as any).message },
      { status: 500 }
    );
  }
}
