"use client";

import React, { useState, useEffect, useRef } from "react";
import { CgSearch } from "react-icons/cg";
import SearchBarSkeleton from "@/components/ui/SearchBarSkeleton";
import Link from "next/link";
import Image from 'next/image';

import { usePathname } from "next/navigation";

interface Book {
  id: string;
  title: string;
  author: string;
  subTitle?: string;
  imageLink: string;
}

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setIsDropdownOpen(false);
  }, [pathname]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(true);

    if (query) {
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${query}`
        );

        if (response.ok) {
          const books = await response.json();
          const formattedBooks = books.map((book: any) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            subTitle: book.subTitle,
            imageLink: book.imageLink,
          }));
          setFilteredBooks(formattedBooks);
        } else {
          console.error("Error fetching books:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsSearching(false);
        setIsDropdownOpen(true);
      }
    } else {
      setFilteredBooks([]);
      setIsDropdownOpen(false);
      setIsSearching(false);
    }
  };

  return (
    <div className="relative w-full md:w-1/2 lg:w-1/4 ml-auto" ref={searchBarRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for books"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownOpen(true)}
          className="w-full py-2 px-3 pr-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-1 focus:border-transparent text-blue-1 text-sm"
        />
        <CgSearch
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
      </div>
      {isDropdownOpen && (
        <div className="absolute w-full mt-1 bg-white shadow-lg rounded-md z-10 max-h-60 overflow-y-auto">
          {isSearching ? (
            <SearchBarSkeleton />
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Link href={`/book/${book.id}`} key={book.id}>
                <div className="p-2 hover:bg-gray-100 text-sm flex items-start cursor-pointer">
                <Image
  src={book.imageLink}
  alt={book.title}
  width={48} // w-12 in Tailwind CSS is 48px
  height={64} // h-16 in Tailwind CSS is 64px
  className="object-cover mr-3"
/>
                  <div>
                    <div className="font-semibold">{book.title}</div>
                    <div className="text-xs text-gray-600">{book.author}</div>
                    {book.subTitle && (
                      <div className="text-xs text-gray-500">{book.subTitle}</div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : searchQuery ? (
            <div className="p-2 text-sm text-gray-500">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
