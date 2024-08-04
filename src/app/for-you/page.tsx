"use client";

import React from "react";
import LeftSidebar from "@/components/LeftSideBar";
import { sidebarLinks } from "@/constants";
import SearchBar from "@/components/SearchBar";

const ForYouPage = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <LeftSidebar sidebarLinks={sidebarLinks} />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="pr-2 pb-4 border-b w-full border-gray-200">
          <SearchBar />
        </div>
        {/* Your main content goes here */}
        <h1>For You Page</h1>
        {/* Add more content as needed */}
      </main>
    </div>
  );
};

export default ForYouPage;
