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
    const customerDoc = await firestore.collection('customers').doc(uid).get();
    const customerData = customerDoc.data();

    let isPremium = false;
    if (customerData?.subscriptions) {
      const activeSubscription = Object.values(customerData.subscriptions).find(
        (sub: any) => sub.status === 'active' || sub.status === 'trialing'
      );
      isPremium = !!activeSubscription;
    }

    return NextResponse.json({ isPremium });
  } catch (error) {
    console.error('Error checking premium status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}