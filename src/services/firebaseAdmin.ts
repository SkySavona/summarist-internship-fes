import * as admin from 'firebase-admin';
import serviceAccount from '@/services/summarist-internship-new-455b103a5d6f.json'; 


const serviceAccountConfig = serviceAccount as admin.ServiceAccount;

let adminApp: admin.app.App;

export const getFirebaseAdmin = () => {
  if (!admin.apps.length) {
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