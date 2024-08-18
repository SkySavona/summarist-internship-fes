"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Book } from "@/types/index";
import { PiBookmarkSimple } from "react-icons/pi";
import { FaStar, FaRegClock, FaBook, FaMicrophone, FaLightbulb } from "react-icons/fa";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import Searchbar from "@/components/Searchbar";

const BookDetails: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { isSubscribed, loading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data: Book = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const handleReadOrListen = () => {
    if (authLoading || subscriptionLoading) {
      return;
    }

    if (!isLoggedIn) {
      alert("Please log in to proceed.");
    } else if (book?.subscriptionRequired && !isSubscribed) {
      router.push("https://summarist.vercel.app/choose-plan");
    } else {
      router.push(`/player/${id}`);
    }
  };

  const handleAddToLibrary = () => {
    if (authLoading) {
      return;
    }

    if (!isLoggedIn) {
      alert("Please log in to add this book to your library.");
    } else {
      alert("Book added to your library!");
    }
  };

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-1 overflow-hidden h-[100vh]">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="pr-2 pb-4 border-b w-full border-gray-200">
          <Searchbar />
        </div>
        <div className="max-w-6xl mx-auto p-8 ">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-start">
            <div className="md:w-2/3 ">
              <h1 className="text-blue-1 text-4xl font-bold">
                {book.title}
              </h1>
              <p className="text-blue-1 text-lg mt-2">{book.author}</p>
              <p className="text-blue-1 text-md mt-1 border-b pb-4 border-gray-300">{book.subTitle}</p>

              <div className="flex flex-wrap mt-4 text-blue-1 text-sm space-x-6 ">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-2" />
                  <span>
                    {book.averageRating.toFixed(1)} ({book.totalRating} ratings)
                  </span>
                </div>
                <div className="flex items-center">
                  <FaRegClock className="mr-2" />
                  <span>{book.audioLink ? 'Audio available' : 'No audio'}</span>
                </div>
              </div>

              <div className="flex flex-wrap mt-4 text-sm space-x-6 border-b pb-4 border-gray-300">
                <div className="flex text-blue-1 items-center">
                  <FaMicrophone className="mr-2" />
                  <span>{book.type}</span>
                </div>
                <div className="flex text-blue-1 items-center">
                  <FaLightbulb className="mr-2" />
                  <span>{book.keyIdeas.length} Key ideas</span>
                </div>
              </div>

              <div className="flex items-center mt-8 space-x-4">
                <button
                  onClick={handleReadOrListen}
                  className="bg-blue-1 text-white px-4 py-2 rounded-md flex items-center"
                  disabled={authLoading || subscriptionLoading}
                >
                  <FaBook className="mr-2" />
                  Read
                </button>
                <button
                  onClick={handleReadOrListen}
                  className="bg-blue-1 text-white px-4 py-2 rounded-md flex items-center"
                  disabled={authLoading || subscriptionLoading}
                >
                  <FaMicrophone className="mr-2" />
                  Listen
                </button>
              </div>

              <div className="flex mt-6">
                <button
                  onClick={handleAddToLibrary}
                  className="text-blue-2 flex items-center"
                  disabled={authLoading}
                >
                  <PiBookmarkSimple className="mr-2" />
                  Add title to My Library
                </button>
              </div>

              <div className="mt-8 border-b pb-4 border-gray-300">
                <h2 className="text-xl font-semibold text-blue-1">
                  What's it about?
                </h2>
                <div className="flex flex-wrap mt-2 space-x-2">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-1 text-white px-3 py-1 rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-gray-1">{book.bookDescription}</p>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-blue-1">
                  About the author
                </h2>
                <p className="mt-4 text-gray-1">{book.authorDescription}</p>
              </div>
            </div>
            <div className="relative w-80 h-80 mt-4 md:mt-0 md:ml-8">
              <Image
                src={book.imageLink}
                alt={book.title}
                fill
                className="object-cover rounded-lg shadow-lg"
              />
              {book.subscriptionRequired && (
                <div className="absolute top-2 right-2 bg-blue-1 text-white text-xs px-2 py-1 rounded-full">
                  Premium
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetails;
