"use client";

import React from "react";
import Searchbar from "@/components/Searchbar";
import SelectedBook from "@/components/SelectedBook";
import RecommendedBooksList from "@/components/RecommendedBooksList";
import SuggestedBooks from "@/components/SuggestedBooks";

const ForYou: React.FC = () => {
  return (
    <div className="flex flex-1 overflow-hidden h-[100vh]">
      <main className="flex-1 overflow-y-auto p-4">
        <div className="pr-2 pb-4 border-b w-full border-gray-200">
          <Searchbar />
        </div>
        <SelectedBook />
        <RecommendedBooksList />
        <SuggestedBooks />
      </main>
    </div>
  );
};

export default ForYou;
