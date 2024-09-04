import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/services/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const firestore = getFirestore(getFirebaseAdmin());

export async function POST(request: NextRequest) {
  try {
    const { book, action } = await request.json();
    
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Missing or invalid authorization header' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth(getFirebaseAdmin()).verifyIdToken(token);
    const userId = decodedToken.uid;

    if (!book || !action) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const userLibraryRef = firestore.doc(`library/${userId}`);
    const userLibraryDoc = await userLibraryRef.get();

    let currentLibrary = userLibraryDoc.exists ? userLibraryDoc.data()?.books || [] : [];

    if (action === 'add') {
      currentLibrary.push(book);
    } else if (action === 'remove') {
      currentLibrary = currentLibrary.filter((savedBook: any) => savedBook.id !== book.id);
    } else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    await userLibraryRef.set({ books: currentLibrary }, { merge: true });

    return NextResponse.json({ message: 'Library updated successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update library' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Missing or invalid authorization header' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth(getFirebaseAdmin()).verifyIdToken(token);
    const userId = decodedToken.uid;

    const userLibraryRef = firestore.doc(`library/${userId}`);
    const userLibraryDoc = await userLibraryRef.get();

    if (!userLibraryDoc.exists) {
      return NextResponse.json({ books: [] });
    }

    const books = userLibraryDoc.data()?.books || [];
    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch library' }, { status: 500 });
  }
}