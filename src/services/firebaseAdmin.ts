import * as admin from "firebase-admin";

let adminApp: admin.app.App;

export const getFirebaseAdmin = () => {
  if (!admin.apps.length) {
    // Ensure all required environment variables are present
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!projectId || !privateKey || !clientEmail) {
      throw new Error("Firebase service account configuration is missing.");
    }

    adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey,
      }),
      databaseURL: `https://${projectId}.firebaseio.com`,
    });
  } else {
    adminApp = admin.app();
  }
  return adminApp;
};
