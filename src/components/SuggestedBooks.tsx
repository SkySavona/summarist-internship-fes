"use client";

import React, { useEffect, useState } from "react";
import { Book } from "@/types/index";
import RecommendedBookCard from "@/components/RecommendedBookCard";

const SuggestedBooks: React.FC = () => {
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchSuggestedBooks = async () => {
      try {
        const response = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
        );
        const data: Book[] = await response.json();
        setSuggestedBooks(data.slice(0, 5));
      } catch (error) {}
    };

    fetchSuggestedBooks();
  }, []);

  return (
    <div>
      <h2 className="text-xl text-blue-1 font-semibold mb-2 mt-8">
        Suggested Books
      </h2>
      <p className="text-gray-600 mb-4">Browse these books</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {suggestedBooks.map((book) => (
          <RecommendedBookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedBooks;
