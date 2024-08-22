import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getFunctions, Functions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let functions: Functions | undefined;

const initializeFirebase = (): void => {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      functions = getFunctions(app);

      if (!functions) {
        throw new Error("Firebase functions failed to initialize");
      }

    } catch (error) {
      console.error("Error initializing Firebase:", error);
      throw error; 
    }
  } else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);
  }
};

initializeFirebase();

if (!functions) {
  throw new Error("Firebase functions not initialized");
}

const googleProvider = new GoogleAuthProvider();

const createCheckoutSession = httpsCallable(functions, "ext-firestore-stripe-payments-createCheckoutSession");
const createPortalLink = httpsCallable(functions, "ext-firestore-stripe-payments-createPortalLink");

export {
  app,
  auth,
  db,
  functions,
  googleProvider,
  firebaseConfig,
  createCheckoutSession,
  createPortalLink
};

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    throw new Error("Firebase app is not initialized");
  }
  return app;
};

export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }
  return auth;
};

export const getFirebaseDb = (): Firestore => {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized");
  }
  return db;
};

export const getFirebaseFunctions = (): Functions => {
  if (!functions) {
    throw new Error("Firebase functions are not initialized");
  }
  return functions;
};
