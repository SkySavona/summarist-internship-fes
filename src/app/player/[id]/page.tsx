"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AudioProvider } from "@/app/providers/AudioProvider";
import AudioPlayer from "@/components/AudioPlayer";
import { Book } from "@/types/index";
import PlayerPageSidebar from "@/components/PlayerPageSidebar";
import SearchBar from "@/components/SearchBar";
import { motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirebaseAuth } from "@/services/firebaseConfig";
import Link from "next/link";
import LoginDefault from "@/components/LoginDefault";
import { FaCheck } from "react-icons/fa";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "@/services/firebaseConfig";

const firestore = getFirestore(getFirebaseApp());

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
  onToggleFinished: () => void;
  isFinished: boolean;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  book,
  fontSize,
  onToggleFinished,
  isFinished,
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
        <SearchBar />
      </motion.div>
      <motion.div
        variants={fadeInUp}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-8"
      >
        <h1
          className={`md:text-[34px] text-[28px] text-center font-bold text-blue-1 mb-4 leading-normal md:leading-relaxed ${fontSize}`}
        >
          {book.title}
        </h1>
        <p
          className={`text-lg md:text-xl italic text-blue-1 mb-4 text-center ${fontSize}`}
        >
          {book.author}
        </p>
        <div className="w-full border-t mb-4 border-gray-300" />
        <div className={`text-blue-1 mb-8 whitespace-pre-line ${fontSize}`}>
          {book.summary}
        </div>
        <button
          onClick={onToggleFinished}
          className={`${
            isFinished ? "bg-green-1" : "bg-gray-300"
          } text-white px-4 py-2 rounded-md mt-8 hover:bg-green-2 transition-colors duration-200 flex items-center justify-center mx-auto`}
        >
          {isFinished && <FaCheck className="inline-block mr-2" />}
          {isFinished ? "Unmark as Finished" : "Mark as Finished"}
        </button>
      </motion.div>
    </main>
  </motion.div>
);

const PlayerPage: React.FC = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [fontSize, setFontSize] = useState("text-base");
  const auth = getFirebaseAuth();
  const [user, loading, error] = useAuthState(auth);
  const [isPremium, setIsPremium] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showFinishedPopup, setShowFinishedPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      if (user) {
        try {
          const response = await fetch('/api/premium-status', {
            headers: {
              'Authorization': `Bearer ${await user.getIdToken()}`
            }
          });
          const data = await response.json();
          console.log("Premium status response:", data);
          setIsPremium(data.isPremium);
        } catch (error) {
          console.error("Error fetching premium status:", error);
        }
      }
    };

    fetchPremiumStatus();
  }, [user]);

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

  useEffect(() => {
    if (user && book) {
      const userLibraryRef = doc(firestore, "library", user.uid);
      const unsubscribe = onSnapshot(userLibraryRef, (doc) => {
        if (doc.exists()) {
          const userLibrary = doc.data()?.books || [];
          const isBookFinished = userLibrary.some(
            (savedBook: any) => savedBook.id === book.id && savedBook.finished
          );
          setIsFinished(isBookFinished);
        }
      }, (error) => {
        console.error("Error fetching library status:", error);
      });

      return () => unsubscribe();
    }
  }, [user, book]);

  const handleToggleFinished = async () => {
    if (!book || !user) return;

    const userLibraryRef = doc(firestore, "library", user.uid);

    try {
      const userLibraryDoc = await getDoc(userLibraryRef);

      let currentLibrary = userLibraryDoc.exists()
        ? userLibraryDoc.data()?.books || []
        : [];

      const bookIndex = currentLibrary.findIndex(
        (savedBook: any) => savedBook.id === book.id
      );

      if (bookIndex !== -1) {
        currentLibrary[bookIndex].finished = !isFinished;
      } else {
        currentLibrary.push({ ...book, finished: true });
      }

      await setDoc(userLibraryRef, { books: currentLibrary }, { merge: true });
      setPopupMessage(
        isFinished ? "Book unmarked as finished!" : "Book marked as finished!"
      );
      setShowFinishedPopup(true);
      setTimeout(() => setShowFinishedPopup(false), 3000);
    } catch (error) {
      console.error("Error updating library:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <LoginDefault onLoginSuccess={() => {}} />;
  }

  if (!book) {
    return <div>Loading book details...</div>;
  }

  if (book.subscriptionRequired && !isPremium) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Premium Content</h1>
        <p className="mb-4">
          This book is only available to premium subscribers.
        </p>
        <Link
          href="/choose-plan"
          className="bg-green-1 text-white px-4 py-2 rounded hover:bg-green-2 transition-colors ease-in-out"
        >
          Subscribe Now
        </Link>
      </div>
    );
  }

  return (
    <AudioProvider>
      <div className="flex h-screen relative">
        <PlayerPageSidebar onFontSizeChange={setFontSize} />
        <div className="flex flex-col w-full h-full lg:ml-64">
          <PlayerContent
            book={book}
            fontSize={fontSize}
            onToggleFinished={handleToggleFinished}
            isFinished={isFinished}
          />
          <div className="sticky bottom-0 left-0 w-full bg-white z-10">
            <AudioPlayer book={book} />
          </div>
        </div>
      </div>
      {showFinishedPopup && (
        <div className="fixed bottom-4 right-4 bg-green-1 text-white p-4 rounded-md shadow-lg z-50">
          {popupMessage}
        </div>
      )}
    </AudioProvider>
  );
};

export default PlayerPage;