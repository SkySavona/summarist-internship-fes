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
        const response = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
        );
        const data: Book[] = await response.json();
        setCurrentBook(data[0]);
      } catch (error) {}
    };

    fetchBooks();
  }, []);

  const handleClick = () => {
    router.push(`/book/${currentBook?.id}`);
  };

  if (!currentBook) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl text-blue-1 font-semibold mb-4 mt-4">
        Selected Just For You
      </h2>
      <div
        className="bg-orange-100 p-4 rounded-lg flex flex-col md:flex-row items-center mb-6 cursor-pointer "
        onClick={handleClick}
      >
        <div className="flex-1 mb-4 md:mb-0 md:mr-4 pl-4">
          <h3 className="text-xl text-blue-1 font-bold text-center md:text-left mb-2">
            {currentBook.title}
          </h3>
          <h4 className="text-md text-gray-600  text-center md:text-left">
            {currentBook.subTitle}
          </h4>
          <p className="text-blue-1 text-center italic pb-2 md:text-left">
            {currentBook.author}
          </p>
          <div className="flex justify-center md:justify-start items-center mt-2">
            <button className="bg-black text-white rounded-full p-2 mr-2 hover:bg-gray-300 transition-colors duration-300 ease-in-out">
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
                  strokeWidth={6}
                  d="M9.5 7.5l6 4.5-6 4.5v-9z"
                />
              </svg>
            </button>
            <span className="text-gray-600">3 mins 23 secs</span>
          </div>
        </div>
        <div className="flex-shrink-0 mx-auto md:mx-4 mb-4 md:mb-0">
          <Image
            src={currentBook.imageLink}
            alt={currentBook.title}
            width={200}
            height={300}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectedBook;
