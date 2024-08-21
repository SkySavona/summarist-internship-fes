'use client';

import React, { useState, useEffect, lazy, Suspense } from "react";
import Searchbar from "@/components/SearchBar";
import SelectedBookSkeleton from "@/components/ui/SelectedBookSkeleton";
import RecommendedBooksListSkeleton from "@/components/ui/RecommendedBooksListSkeleton";
import SuggestedBooksSkeleton from "@/components/ui/SuggestedBooksSkeleton";
import { useLoading } from "@/components/ui/LoadingContext";

// Lazy load the components
const SelectedBook = lazy(() => import("@/components/SelectedBook"));
const RecommendedBooksList = lazy(() => import("@/components/RecommendedBooksList"));
const SuggestedBooks = lazy(() => import("@/components/SuggestedBooks"));

const ForYou: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      // Parallel data fetching
      const fetchPromises = [
        new Promise((resolve) => setTimeout(resolve, 200)), // Simulate data fetching delay
      ];

      await Promise.all(fetchPromises);
      setIsInitialLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden h-[100vh] relative">
      <main className="flex-1 overflow-y-auto p-4 relative z-2">
        <div className="pr-2 pb-4 border-b w-full border-gray-200 z-2 relative">
          <Searchbar />
        </div>

        <div className={`absolute top-14 left-0 w-full px-4 py-6 transition-opacity duration-500 ease-in-out z-10 ${isInitialLoading ? "opacity-100" : "opacity-0"}`}>
          <SelectedBookSkeleton />
          <RecommendedBooksListSkeleton />
          <SuggestedBooksSkeleton />
        </div>

        <div className={`absolute top-14 left-0 w-full px-4 py-6 transition-opacity duration-500 ease-in-out z-10 ${isInitialLoading ? "opacity-0" : "opacity-100"}`}>
          <Suspense fallback={<SelectedBookSkeleton />}>
            <SelectedBook />
          </Suspense>
          
          <Suspense fallback={<RecommendedBooksListSkeleton />}>
            <RecommendedBooksList />
          </Suspense>
          
          <Suspense fallback={<SuggestedBooksSkeleton />}>
            <SuggestedBooks />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default ForYou;