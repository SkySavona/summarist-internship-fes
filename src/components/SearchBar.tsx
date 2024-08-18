"use client";

import React, { useState, useEffect } from "react";
import { CgSearch } from "react-icons/cg";

interface Book {
  id: string;
  title: string;
}

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    try {
      const response = await fetch(
        `https://librivox.org/api/feed/audiobooks/search?q=${query}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  };

  return (
    <div className="relative w-1/4 ml-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for books"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-1 px-3 pr-8 rounded-full border  border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-1 focus:border-transparent text-blue-1 text-sm "
        />
        <CgSearch
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={16}
        />
      </div>
      {searchResults.length > 0 && (
        <div className="absolute w-full mt-1 bg-white shadow-lg rounded-md z-10">
          {searchResults.map((book) => (
            <div key={book.id} className="p-2 hover:bg-gray-100 text-sm">
              {book.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
