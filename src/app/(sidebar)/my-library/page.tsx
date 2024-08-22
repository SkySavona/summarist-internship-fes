"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Book } from "@/types/index";
import RecommendedBookCard from "@/components/RecommendedBookCard";
import SearchBar from "@/components/SearchBar";
import LoginDefault from "@/components/LoginDefault";
import { getFirebaseAuth } from "@/services/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "@/services/firebaseConfig";

const firestore = getFirestore(getFirebaseApp());

const MyLibrary: React.FC = () => {
  const auth = getFirebaseAuth();
  const [user, loading] = useAuthState(auth);
  const [library, setLibrary] = useState<Book[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<Book[]>([]);
  const [hydrated, setHydrated] = useState(false); // Track if hydration has occurred

  useEffect(() => {
    setHydrated(true); // Mark as hydrated on client side
  }, []);

  useEffect(() => {
    if (user && hydrated) {
      const fetchLibrary = async () => {
        try {
          const userLibraryRef = doc(firestore, 'libraries', user.uid);
          const userLibraryDoc = await getDoc(userLibraryRef);

          if (userLibraryDoc.exists()) {
            const allBooks = userLibraryDoc.data()?.books || [];

            // Separate the books into finished and unfinished categories
            const finished = allBooks.filter((book: any) => book.finished);
            const unfinished = allBooks.filter((book: any) => !book.finished);

            setLibrary(unfinished);
            setFinishedBooks(finished);
          } else {
            setLibrary([]);
            setFinishedBooks([]);
          }
        } catch (error) {
          console.error("Error fetching library:", error);
        }
      };

      fetchLibrary();
    }
  }, [user, hydrated]);

  if (loading || !hydrated) {
    return <div><LoadingSpinner /></div>; // Ensure spinner shows until hydrated
  }

  if (!user) {
    return <LoginDefault onLoginSuccess={() => {}} />;
  }

  return (
    <div className="flex flex-1 overflow-hidden h-[100vh]">
      <main className="flex-1 overflow-y-auto p-4">
        <div className="pr-2 pb-4 border-b w-full border-gray-200">
          <SearchBar />
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-blue-1 mb-8 md:text-md mt-1 border-b pb-4 border-gray-300">
              My Library
            </h1>
            <h2 className="text-2xl font-bold text-blue-1 mt-12 mb-8">Saved</h2>
            {library.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {library.map((book) => (
                  <RecommendedBookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Your library is empty.</p>
            )}

            <h2 className="text-2xl font-bold text-blue-1 mt-12 mb-8">
              Finished
            </h2>
            {finishedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {finishedBooks.map((book) => (
                  <RecommendedBookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                You haven't finished any books yet.
              </p>
            )}
          </div>
        </Suspense>
      </main>
    </div>
  );
};

export default MyLibrary;
