'use client';

import React, { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Searchbar from "@/components/SearchBar";
import SelectedBookSkeleton from "@/components/ui/SelectedBookSkeleton";
import RecommendedBooksListSkeleton from "@/components/ui/RecommendedBooksListSkeleton";
import SuggestedBooksSkeleton from "@/components/ui/SuggestedBooksSkeleton";
import { useLoading } from "@/components/ui/LoadingContext";

const SelectedBook = lazy(() => import("@/components/SelectedBook"));
const RecommendedBooksList = lazy(() => import("@/components/RecommendedBooksList"));
const SuggestedBooks = lazy(() => import("@/components/SuggestedBooks"));

const ForYou: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate data fetching delay
      setIsInitialLoading(false);
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.8, // Slight delay to smooth the transition
        staggerChildren: 0.3,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-1 overflow-hidden h-[100vh] relative">
      <main className="flex-1 overflow-y-auto p-4 relative z-2">
        <div className="pr-2 pb-4 border-b w-full border-gray-200 z-20 relative">
          <Searchbar />
        </div>

        {isInitialLoading ? (
          <div className="absolute top-14 left-0 w-full px-4 py-6 z-10">
            <SelectedBookSkeleton />
            <RecommendedBooksListSkeleton />
            <SuggestedBooksSkeleton />
          </div>
        ) : (
          <motion.div
            className="absolute top-14 left-0 w-full px-4 py-6 z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Suspense fallback={<SelectedBookSkeleton />}>
              <motion.div variants={itemVariants}>
                <SelectedBook />
              </motion.div>
            </Suspense>

            <Suspense fallback={<RecommendedBooksListSkeleton />}>
              <motion.div variants={itemVariants}>
                <RecommendedBooksList />
              </motion.div>
            </Suspense>

            <Suspense fallback={<SuggestedBooksSkeleton />}>
              <motion.div variants={itemVariants}>
                <SuggestedBooks />
              </motion.div>
            </Suspense>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ForYou;
