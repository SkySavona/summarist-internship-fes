"use client";

import React, { useState, useEffect } from "react";
import LeftSidebar from "@/components/LeftSideBar";
import { sidebarLinks } from "@/constants";
import SearchBar from "@/components/SearchBar";
import RecommendedBooks from "@/components/RecommendedBooks";
import { Book } from "@/types/Book";

const ForYouPage = () => {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [allBooks, setAllBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3001/books'); // Adjust this URL to your JSON server address
        const data = await response.json();
        setAllBooks(data);
        setCurrentBook(data[0]); // Set the first book as current book
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden">
      <LeftSidebar sidebarLinks={sidebarLinks} />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="pr-2 pb-4 border-b w-full border-gray-200">
          <SearchBar />
        </div>
        <h1 className="text-2xl font-bold my-4">For You Page</h1>
        <div>
          <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
          {currentBook && allBooks.length > 0 && (
            <RecommendedBooks currentBook={currentBook} allBooks={allBooks} />
          )}
        </div>
      </main>
    </div>
  );
};

export default ForYouPage;