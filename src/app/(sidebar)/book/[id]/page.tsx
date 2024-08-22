"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { Book } from "@/types/index";
import { PiBookmarkSimple } from "react-icons/pi";
import {
  FaStar,
  FaRegClock,
  FaBook,
  FaMicrophone,
  FaLightbulb,
} from "react-icons/fa";
import Image from "next/image";
import Searchbar from "@/components/SearchBar";
import { motion } from "framer-motion";
import { getFirebaseAuth } from "@/services/firebaseConfig";
import { User } from "firebase/auth";
import usePremiumStatus from "@/stripe/usePremiumStatus";
import SkeletonBookDetails from "@/components/ui/SkeletonBookDetails"; 

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const BookDetails: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [audioDuration, setAudioDuration] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const isPremium = usePremiumStatus(user);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (typeof id !== "string") return;

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
        setError("Failed to load book details. Please try again later.");
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  useEffect(() => {
    if (book?.audioLink) {
      const audio = new Audio(book.audioLink);
      audio.addEventListener("loadedmetadata", () => {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        setAudioDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      });

      audio.addEventListener("error", () => {
        console.error("Error loading audio file");
        setAudioDuration("Duration not available");
      });

      audio.load();
    } else {
      setAudioDuration("Audio not available");
    }
  }, [book]);

  const handleReadOrListen = () => {
    if (!book) return;

    if (book.subscriptionRequired) {
      if (!user) {
        // User is not signed in
        router.push("/signin");
      } else if (!isPremium) {
        // User is signed in but not subscribed
        router.push("/choose-plan");
      } else {
        // User is signed in and subscribed
        router.push(`/player/${id}`);
      }
    } else {
      // Non-premium book, allow access
      router.push(`/player/${id}`);
    }
  };

  if (!book && !error) {
    return <SkeletonBookDetails />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Book Not Found
        </h1>
        <p className="text-gray-600">The requested book could not be found.</p>
      </div>
    );
  }

  function handleAddToLibrary(event: React.MouseEvent<HTMLButtonElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Suspense fallback={<SkeletonBookDetails />}>
      <div className="flex flex-1 overflow-hidden h-[100vh]">
        <main className="flex-1 overflow-y-auto p-4">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <div className="pr-2 pb-4 border-b w-full border-gray-200">
              <Searchbar />
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-6xl mx-auto p-8"
          >
            <motion.div
              variants={fadeInUp}
              className="flex flex-col-reverse md:flex-row justify-between items-start md:items-start"
            >
              <div className="md:w-2/3">
                <motion.h1
                  variants={fadeInUp}
                  className="text-blue-1 text-3xl md:text-4xl font-bold mt-4 md:mt-0"
                >
                  {book.title}
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  className="text-blue-1 text-md md:text-lg mt-2"
                >
                  {book.author}
                </motion.p>
                <motion.p
                  variants={fadeInUp}
                  className="text-gray-2 text-sm md:text-md mt-1 border-b pb-4 border-gray-300"
                >
                  {book.subTitle}
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-wrap mt-4 text-blue-1 text-xs md:text-sm space-x-6"
                >
                  <div className="flex items-center">
                    <FaStar className="text-yellow-500 mr-2" />
                    <span>
                      {book.averageRating.toFixed(1)} (
                      {book.totalRating} ratings)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaRegClock className="mr-2" />
                    <span>{audioDuration || "Loading duration..."}</span>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-wrap mt-4 text-xs md:text-sm space-x-6 border-b pb-4 border-gray-300"
                >
                  <div className="flex text-blue-1 items-center">
                    <FaMicrophone className="mr-2" />
                    <span>{book.type}</span>
                  </div>
                  <div className="flex text-blue-1 items-center">
                    <FaLightbulb className="mr-2" />
                    <span>{book.keyIdeas.length} Key ideas</span>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="flex items-center mt-8 space-x-4"
                >
                  <button
                    onClick={handleReadOrListen}
                    className="bg-blue-1 text-white px-4 py-2 rounded-md flex items-center text-sm md:text-base"
                  >
                    <FaBook className="mr-2" />
                    {book.subscriptionRequired && !isPremium
                      ? "Subscribe to Read"
                      : "Read"}
                  </button>
                  <button
                    onClick={handleReadOrListen}
                    className="bg-blue-1 text-white px-4 py-2 rounded-md flex items-center text-sm md:text-base"
                  >
                    <FaMicrophone className="mr-2" />
                    {book.subscriptionRequired && !isPremium
                      ? "Subscribe to Listen"
                      : "Listen"}
                  </button>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex mt-6">
                  <button
                    onClick={handleAddToLibrary}
                    className="text-blue-2 flex items-center text-sm md:text-base"
                  >
                    <PiBookmarkSimple className="mr-2" />
                    Add title to My Library
                  </button>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="mt-8 border-b pb-4 border-gray-300"
                >
                  <h2 className="text-lg md:text-xl font-semibold text-blue-1">
                    What's It About?
                  </h2>
                  <div className="flex flex-wrap mt-2 space-x-2">
                    {book.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-blue-1 px-3 py-1 mt-4 rounded-md text-xs md:text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-gray-1 text-sm md:text-base">
                    {book.bookDescription}
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp} className="mt-8 ">
                  <h2 className="text-lg md:text-xl font-semibold text-blue-1">
                    About The Author
                  </h2>
                  <p className="mt-4 text-gray-1 text-sm md:text-base">
                    {book.authorDescription}
                  </p>
                </motion.div>
              </div>

              <motion.div
                variants={fadeInUp}
                className="relative w-full h-80 mt-4 md:mt-0 md:w-80 md:h-80"
              >
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
              </motion.div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </Suspense>
  );
};

export default BookDetails;
