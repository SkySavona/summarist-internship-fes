import * as admin from 'firebase-admin';

const serviceAccountConfig = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) as admin.ServiceAccount
  : undefined;

let adminApp: admin.app.App;

export const getFirebaseAdmin = () => {
  if (!admin.apps.length) {
    if (!serviceAccountConfig) {
      throw new Error("Firebase service account configuration is missing.");
    }
    
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountConfig), 
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  } else {
    adminApp = admin.app();
  }
  return adminApp;
};
