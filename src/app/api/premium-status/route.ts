import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdmin } from '@/services/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No valid authorization header' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth(getFirebaseAdmin()).verifyIdToken(token);
    const uid = decodedToken.uid;

    const firestore = getFirestore(getFirebaseAdmin());
    const userDoc = await firestore.collection('users').doc(uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPremium = userData.subscriptionStatus === 'active' || userData.subscriptionStatus === 'trialing';

    return NextResponse.json({ isPremium });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
