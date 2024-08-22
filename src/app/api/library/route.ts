import { NextRequest, NextResponse } from 'next/server';
import { firebaseConfig } from '@/services/firebaseConfig';  
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  const { userId, book, action } = await request.json();

  if (!userId || !book || !action) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const userLibraryRef = doc(firestore, 'libraries', userId);
    const userLibraryDoc = await getDoc(userLibraryRef);

    let currentLibrary = userLibraryDoc.exists() ? userLibraryDoc.data()?.books || [] : [];

    if (action === 'add') {
      currentLibrary.push(book);
    } else if (action === 'remove') {
      currentLibrary = currentLibrary.filter((savedBook: any) => savedBook.id !== book.id);
    } else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    await setDoc(userLibraryRef, { books: currentLibrary }, { merge: true });

    return NextResponse.json({ message: 'Library updated successfully' });
  } catch (error) {
    console.error('Error updating user library:', error);
    return NextResponse.json({ message: 'Failed to update library' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const userLibraryRef = doc(firestore, 'libraries', userId);
    const userLibraryDoc = await getDoc(userLibraryRef);

    if (!userLibraryDoc.exists()) {
      return NextResponse.json({ books: [] });
    }

    const books = userLibraryDoc.data()?.books || [];
    return NextResponse.json({ books });
  } catch (error) {
    console.error('Error fetching user library:', error);
    return NextResponse.json({ message: 'Failed to fetch library' }, { status: 500 });
  }
}
