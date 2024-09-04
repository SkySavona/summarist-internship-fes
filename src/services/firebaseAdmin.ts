import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: admin.app.App;

export const getFirebaseAdmin = () => {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.split(
      String.raw`\n`
    ).join("\n");
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!projectId || !privateKey || !clientEmail) {
      throw new Error("Firebase service account configuration is missing.");
    }

    try {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey,
        }),
        databaseURL: `https://${projectId}.firebaseio.com`,
      });

      const db = getFirestore(adminApp);
      db.settings({
        ignoreUndefinedProperties: true,
        ssl: true,
        customHeaders: {
          "User-Agent": "Vercel/Serverless",
        },
      });
    } catch (error) {
      throw error;
    }
  } else {
    adminApp = admin.app();
  }
  return adminApp;
};

export const getAdminFirestore = () => {
  const app = getFirebaseAdmin();
  return getFirestore(app);
};
