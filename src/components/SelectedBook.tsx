"use client";

import React, { useState, useEffect } from "react";
import { Book } from "@/types/index";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SelectedBook: React.FC = () => {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected');
        const data: Book[] = await response.json();
        setCurrentBook(data[0]); 
      } catch (error) {
        console.error("Error fetching selected books:", error);
      }
    };

    fetchBooks();
  }, []);

  if (!currentBook) {
    return null;
  }

  const handleClick = () => {
    router.push(`/book/${currentBook.id}`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 mt-4">Selected Just For You</h2>
      <div
        className="bg-yellow-100 p-4 rounded-lg flex items-center mb-6 cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex-1">
          <h3 className="text-lg font-bold">{currentBook.subTitle}</h3>
        </div>
        <div className="flex-shrink-0 mx-4">
          <Image
            src={currentBook.imageLink}
            alt={currentBook.title}
            width={200}
            height={300}
            className="rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold">{currentBook.title}</h3>
          <p className="text-gray-600">{currentBook.author}</p>
          <div className="flex items-center mt-2">
            <button className="bg-black text-white rounded-full p-2 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-6.364-3.682A1 1 0 007 8.316v7.368a1 1 0 001.388.916l6.364-3.682a1 1 0 000-1.732z"
                />
              </svg>
            </button>
            <span>3 mins 23 secs</span> {/* Adjust this to dynamic duration if available */} 
          </div>
          {/* // TODO:  */}
        </div>
      </div>
    </div>
  );
};

export default SelectedBook;
