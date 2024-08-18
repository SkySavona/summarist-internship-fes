"use client";
import React, { useEffect, useState } from "react";
import { Book } from "@/types/index";
import RecommendedBookCard from "@/components/RecommendedBookCard";

const RecommendedBooksList: React.FC = () => {
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        const response = await fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended');
        const data: Book[] = await response.json();
        setRecommendedBooks(data.slice(0, 5)); 
      } catch (error) {
        console.error("Error fetching recommended books:", error);
      }
    };

    fetchRecommendedBooks();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
      <p className="text-gray-600 mb-4">We think you'll like these</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recommendedBooks.map((book) => (
          <RecommendedBookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedBooksList;
