"use client";

import React from 'react';

const SearchBarSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="p-2 animate-pulse flex items-start">
          <div className="w-12 h-16 bg-gray-300 rounded mr-3"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SearchBarSkeleton;