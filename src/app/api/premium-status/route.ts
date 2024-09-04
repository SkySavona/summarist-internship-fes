import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdmin } from '@/services/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';

export async function GET(req: Request) {
  console.log('Premium status check initiated');
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header');
      return NextResponse.json({ error: 'No valid authorization header' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    console.log('Bearer token extracted');

    const decodedToken = await getAuth(getFirebaseAdmin()).verifyIdToken(token);
    const uid = decodedToken.uid;
    console.log('User UID from token:', uid);

    const firestore = getFirestore(getFirebaseAdmin());

    const userDoc = await firestore.collection('users').doc(uid).get();
    const userData = userDoc.data();
    console.log('User data fetched:', userData);

    if (!userData) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const subscriptionsSnapshot = await firestore
      .collection('users')
      .doc(uid)
      .collection('subscriptions')
      .get();

    console.log('Subscriptions fetched, count:', subscriptionsSnapshot.size);

    let isPremium = false;
    let activeSubscription = null;

    for (const doc of subscriptionsSnapshot.docs) {
      const subData = doc.data();
      console.log('Subscription data:', subData);

      if (subData.role === 'Premium' && subData.status === 'active') {
        isPremium = true;
        activeSubscription = subData;
        console.log('Active Premium subscription found');
        break;
      }
    }

    console.log('Is user Premium:', isPremium);

    if (!activeSubscription) {
      console.log('No active Premium subscription found');
      return NextResponse.json({ isPremium: false });
    }

    return NextResponse.json({
      isPremium,
      subscriptionStatus: activeSubscription.status,
      subscriptionId: activeSubscription.id || 'unknown',
      subscriptionName: activeSubscription.items[0]?.price.product.name || 'Premium Subscription',
    });

  } catch (error) {
    console.error("Error in premium status check:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}