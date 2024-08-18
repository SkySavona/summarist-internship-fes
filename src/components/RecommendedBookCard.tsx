"use client";

import React from "react";
import { Book } from "@/types/index";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface RecommendedBookCardProps {
  book: Book;
  onClick?: () => void;
}

const RecommendedBookCard: React.FC<RecommendedBookCardProps> = ({ book, onClick }) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/book/${book.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full h-60 mb-4">
        <Image
          src={book.imageLink}
          alt={book.title}
          fill
          style={{ objectFit: 'contain' }}
          onError={(e) => {
            e.currentTarget.src = "/placeholder-image.jpg"; 
            //  TODO: Replace with actual error handling logic
          }}
        />
        {book.subscriptionRequired && (
          <div className="absolute bottom-50 left-40 bg-blue-1 text-white text-xs px-2 py-1 rounded-full">
            Premium
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold">{book.title}</h3>
      <p className="text-gray-600">{book.author}</p>
      <p className="text-sm text-gray-600">{book.subTitle}</p>
      <div className="flex items-center mt-2">
        {/* Add any additional information here */}
      </div>
      <div className="flex items-center text-sm text-gray-600 mt-2">
        {/* Example for time and rating */}
        <span>03:24 mins</span> 
        {/* //TODO: Replace with actual time  */}
      </div>
    </div>
  );
};

export default RecommendedBookCard;
