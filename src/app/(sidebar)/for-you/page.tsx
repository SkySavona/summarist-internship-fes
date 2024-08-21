"use client";

import React, { useState, useEffect, Suspense } from "react";
import Searchbar from "@/components/SearchBar";
import SelectedBook from "@/components/SelectedBook";
import RecommendedBooksList from "@/components/RecommendedBooksList";
import SuggestedBooks from "@/components/SuggestedBooks";
import SelectedBookSkeleton from "@/components/ui/SelectedBookSkeleton";
import RecommendedBooksListSkeleton from "@/components/ui/RecommendedBooksListSkeleton";
import SuggestedBooksSkeleton from "@/components/ui/SuggestedBooksSkeleton";

const ForYou: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden h-[100vh] relative">
      <main className="flex-1 overflow-y-auto p-4 relative z-2">
        <div className="pr-2 pb-4 border-b w-full border-gray-200 z-2 relative">
          <Searchbar />
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <div
            className={`absolute top-14 left-0 w-full px-4 py-6 transition-opacity duration-500 ease-in-out z-10 ${
              isLoading ? "opacity-100" : "opacity-0"
            }`}
          >
            <SelectedBookSkeleton />
            <RecommendedBooksListSkeleton />
            <SuggestedBooksSkeleton />
          </div>

          <div
            className={`absolute top-14 left-0 w-full px-4 py-6 transition-opacity duration-500 ease-in-out z-10 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          >
            <SelectedBook />
            <RecommendedBooksList />
            <SuggestedBooks />
          </div>
        </Suspense>
      </main>
    </div>
  );
};

export default ForYou;
