"use client";

import React, { useState, useEffect, useRef } from "react";
import { CgSearch } from "react-icons/cg";
import SearchBarSkeleton from "@/components/ui/SearchBarSkeleton";
import Link from "next/link";
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
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [suggestedResponse, recommendedResponse] = await Promise.all([
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended')
        ]);

        const suggestedBooks = await suggestedResponse.json();
        const recommendedBooks = await recommendedResponse.json();

        const combinedBooks = [...suggestedBooks, ...recommendedBooks].map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          subTitle: book.subTitle,
          imageLink: book.imageLink
        }));

        setAllBooks(combinedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = allBooks.filter(book => 
        book.title.toLowerCase().includes(lowercasedQuery) ||
        book.author.toLowerCase().includes(lowercasedQuery) ||
        (book.subTitle && book.subTitle.toLowerCase().includes(lowercasedQuery))
      );
      setFilteredBooks(filtered);
      setIsDropdownOpen(true);
      setIsSearching(false);
    } else {
      setFilteredBooks([]);
      setIsDropdownOpen(false);
    }
  }, [searchQuery, allBooks]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setIsDropdownOpen(false);
  }, [pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);
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
      {isDropdownOpen && !isInitialLoading && (
        <div className="absolute w-full mt-1 bg-white shadow-lg rounded-md z-10 max-h-60 overflow-y-auto">
          {isSearching ? (
            <SearchBarSkeleton />
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Link href={`/book/${book.id}`} key={book.id}>
                <div className="p-2 hover:bg-gray-100 text-sm flex items-start cursor-pointer">
                  <img src={book.imageLink} alt={book.title} className="w-12 h-16 object-cover mr-3" />
                  <div>
                    <div className="font-semibold">{book.title}</div>
                    <div className="text-xs text-gray-600">{book.author}</div>
                    {book.subTitle && <div className="text-xs text-gray-500">{book.subTitle}</div>}
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
