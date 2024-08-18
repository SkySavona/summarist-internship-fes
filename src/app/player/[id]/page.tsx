"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AudioProvider } from '@/app/providers/AudioProvider';
import AudioPlayer from '@/components/AudioPlayer';
import { Book } from '@/types/index';
import PlayerPageSidebar from '@/components/PlayerPageSidebar';
import Searchbar from '@/components/Searchbar';

const PlayerContent = ({ book, fontSize }: { book: Book, fontSize: string }) => {
  return (
    <>
    <div className="flex flex-1 overflow-hidden h-[100vh]">
    <main className="flex-1 overflow-y-auto p-4">
      <div className="pr-2 pb-4 border-b w-full border-gray-200">
        <Searchbar />
      </div>
    <div className="flex-1 overflow-y-auto px-8 py-8">
      <h1 className={`text-[36px] font-bold text-blue-1 mb-4 ${fontSize}`}>
        {book.title}
      </h1>
      <p className={`text-xl text-blue-1 mb-4 ${fontSize}`}>{book.author}</p>
      <div className={`text-blue-1 mb-8 whitespace-pre-line ${fontSize}`}>
        {book.summary}
      </div>
    </div>
    </main>
    </div>
    </>
  );
};

const PlayerPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [fontSize, setFontSize] = useState("text-base");

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data: Book = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <AudioProvider>
      <div className="flex h-screen relative">
        <PlayerPageSidebar onFontSizeChange={setFontSize} />
        <div className="flex flex-col w-full h-full">
          <PlayerContent book={book} fontSize={fontSize} />
          <div className="sticky bottom-0 left-0 w-full bg-white z-10">
            <AudioPlayer book={book} />
          </div>
        </div>
      </div>
    </AudioProvider>
  );
};

export default PlayerPage;
