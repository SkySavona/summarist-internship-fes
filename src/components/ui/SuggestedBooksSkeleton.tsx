"use client";

import React from "react";

const SuggestedBooksSkeleton: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Suggested Books</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
            <div className="relative w-full h-48 sm:h-60 mb-4 bg-gray-300 rounded-lg"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedBooksSkeleton;
