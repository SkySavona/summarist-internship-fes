import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";


if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
      }),
    });
  } catch (error) {
    throw error;
  }
}

const db = getFirestore();

async function getUserDocument(uid: string) {
  const docRef = db.collection("users").doc(uid);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  }
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

    let trial_period_days = 0;
    if (priceId === "price_1Ppg1XRpLrmHfjrMuDkIbZGr") {
      trial_period_days = 7;
    } else {
    }

    const checkoutSessionData = {
      price: priceId,
      success_url,
      cancel_url,
      trial_period_days, 
      created: admin.firestore.FieldValue.serverTimestamp(),
      mode: "subscription",
    };


    const docRef = await db
      .collection("users")
      .doc(uid)
      .collection("checkout_sessions")
      .add(checkoutSessionData);


    return NextResponse.json({ success: true, docId: docRef.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as any).message },
      { status: 500 }
    );
  }
}
