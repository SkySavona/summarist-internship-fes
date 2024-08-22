"use client";

import React from "react";

const SelectedBookSkeleton: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl text-blue-1 font-semibold mb-4 mt-4">
        Selected Just For You
      </h2>
      <div className="bg-orange-100 p-4 rounded-lg flex flex-col md:flex-row items-center mb-6 animate-pulse cursor-pointer">
        <div className="flex-1 mb-4 md:mb-0 md:mr-4 pl-4">
          <div className="bg-gray-300 rounded w-1/2 h-8 md:h-8 mb-2"></div>
          <div className="bg-gray-300 rounded w-1/2 h-6 mb-2"></div>
          <div className="bg-gray-300 rounded w-1/4 h-4 mb-4"></div>
          <div className="flex justify-center md:justify-start items-center mt-2">
            <div className="bg-gray-300 rounded-full w-10 h-10 mr-2"></div>
            <div className="bg-gray-300 rounded w-20 h-4"></div>
          </div>
        </div>
        <div className="flex-shrink-0 mx-auto md:mx-4 mb-4 md:mb-0">
          <div className="bg-gray-300 rounded-lg w-40 h-60"></div>
        </div>
      </div>
    </div>
  );
};

export default SelectedBookSkeleton;
