"use client"

import React from 'react'

const RecommendedBooksListSkeleton: React.FC = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
        <p className="text-gray-600 mb-4">We think you'll like these</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
              <div className="relative w-full h-60 mb-4 bg-gray-300 rounded-lg"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  

export default RecommendedBooksListSkeleton