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

    const subscriptionsSnapshot = await firestore
      .collection('users')
      .doc(uid)
      .collection('subscriptions')
      .get();


    let isPremium = false;
    let activeSubscription = null;

    for (const doc of subscriptionsSnapshot.docs) {
      const subData = doc.data();

      if (subData.role === 'Premium' && (subData.status === 'active' || subData.status === 'trialing')) {
        isPremium = true;
        activeSubscription = subData;
        break;
      }
    }


    if (!activeSubscription) {
      return NextResponse.json({ isPremium: false });
    }

    let trialEnd = null;
    if (activeSubscription.status === 'trialing' && activeSubscription.trial_end) {
      trialEnd = new Date(activeSubscription.trial_end.seconds * 1000).toISOString();
    }

    return NextResponse.json({
      isPremium,
      subscriptionStatus: activeSubscription.status,
      subscriptionId: activeSubscription.id || 'unknown',
      subscriptionName: activeSubscription.items[0]?.price.product.name || 'Premium Subscription',
      trialEnd: trialEnd
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}