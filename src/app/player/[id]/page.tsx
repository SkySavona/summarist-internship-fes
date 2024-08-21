"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AudioProvider } from "@/app/providers/AudioProvider";
import AudioPlayer from "@/components/AudioPlayer";
import { Book } from "@/types/index";
import PlayerPageSidebar from "@/components/PlayerPageSidebar";
import Searchbar from "@/components/SearchBar";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FaCheck } from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface PlayerContentProps {
  book: Book;
  fontSize: string;
  onMarkAsFinished: () => void;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  book,
  fontSize,
  onMarkAsFinished,
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={stagger}
    className="flex flex-1 overflow-hidden h-[100vh]"
  >
    <main className="flex-1 overflow-y-auto p-4">
      <motion.div
        variants={fadeInUp}
        className="pr-2 pb-4 border-b w-full border-gray-200"
      >
        <Searchbar />
      </motion.div>
      <motion.div
        variants={fadeInUp}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-8"
      >
        <h1
          className={`text-[24px] md:text-[32px] text-center font-bold text-blue-1 mb-4 ${fontSize}`}
        >
          {book.title}
        </h1>
        <p
          className={`text-lg md:text-xl text-blue-1 mb-4 text-center ${fontSize}`}
        >
          {book.author}
        </p>
        <div className="w-full border-t mb-4 border-gray-300" />
        <div className={`text-blue-1 mb-8 whitespace-pre-line ${fontSize}`}>
          {book.summary}
        </div>
        <button
          onClick={onMarkAsFinished}
          className="bg-green-500 text-white px-4 py-2 rounded-md mt-8 hover:bg-green-600 transition-colors duration-200 flex items-center justify-center mx-auto"
        >
          <FaCheck className="inline-block mr-2" />
          Mark as Finished
        </button>
      </motion.div>
    </main>
  </motion.div>
);

const PlayerPage: React.FC = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [fontSize, setFontSize] = useState("text-base");

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

  const handleMarkAsFinished = () => {
    if (!book) return;

    // Retrieve the existing finished books from local storage
    const existingFinishedBooks = JSON.parse(
      localStorage.getItem("finishedBooks") || "[]"
    );

    // Check if the book is already in the finished list
    const isAlreadyFinished = existingFinishedBooks.some(
      (savedBook: Book) => savedBook.id === book.id
    );

    if (!isAlreadyFinished) {
      // Add the new book to the finished list
      const updatedFinishedBooks = [...existingFinishedBooks, book];

      // Save the updated finished list to local storage
      localStorage.setItem(
        "finishedBooks",
        JSON.stringify(updatedFinishedBooks)
      );

      alert("Book marked as finished!");
    } else {
      alert("Book is already marked as finished!");
    }
  };

  if (!book) {
    return <LoadingSpinner />;
  }

  return (
    <AudioProvider>
      <div className="flex h-screen relative">
        <PlayerPageSidebar onFontSizeChange={setFontSize} />
        <div className="flex flex-col w-full h-full">
          <PlayerContent
            book={book}
            fontSize={fontSize}
            onMarkAsFinished={handleMarkAsFinished}
          />
          <div className="sticky bottom-0 left-0 w-full bg-white z-10">
            <AudioPlayer book={book} />
          </div>
        </div>
      </div>
    </AudioProvider>
  );
};

export default PlayerPage;
