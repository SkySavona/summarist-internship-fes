"use client";

import React, { useEffect, useState } from "react";
import { Book } from "@/types/index";
import RecommendedBookCard from "@/components/RecommendedBookCard"; // Import the card component
import Searchbar from "@/components/Searchbar";

const MyLibrary: React.FC = () => {
  const [library, setLibrary] = useState<Book[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<Book[]>([]);

  useEffect(() => {
    // Retrieve the library books from local storage on component mount
    const savedLibrary: Book[] = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    setLibrary(savedLibrary);

    // Retrieve the finished books from local storage on component mount
    const savedFinishedBooks: Book[] = JSON.parse(localStorage.getItem('finishedBooks') || '[]');
    setFinishedBooks(savedFinishedBooks);
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden h-[100vh]">
      <main className="flex-1 overflow-y-auto p-4">
        <div className="pr-2 pb-4 border-b w-full border-gray-200">
          <Searchbar />
        </div>
        <div className="max-w-6xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-blue-1 mb-8 md:text-md mt-1 border-b pb-4 border-gray-300">My Library</h1>
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

          <h2 className="text-2xl font-bold text-blue-1 mt-12 mb-8">Finished</h2>
          {finishedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {finishedBooks.map((book) => (
                <RecommendedBookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't finished any books yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyLibrary;
