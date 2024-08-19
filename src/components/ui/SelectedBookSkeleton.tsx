"use client";

import React from "react";

const SelectedBookSkeleton: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 mt-4">Selected Just For You</h2>
      <div className="bg-orange-100 p-4 rounded-lg flex flex-col md:flex-row items-center mb-6 animate-pulse cursor-pointer">
        <div className="flex-1 mb-4 md:mb-0 md:mr-4">
          <div className="bg-gray-300 rounded w-full h-8 md:h-32"></div>
        </div>
        <div className="flex-shrink-0 mx-0 md:mx-4 mb-4 md:mb-0">
          <div className="bg-gray-300 rounded-lg w-40 h-60"></div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="flex justify-center md:justify-start items-center mt-2">
            <div className="bg-gray-300 rounded-full w-10 h-10 mr-2"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedBookSkeleton;
