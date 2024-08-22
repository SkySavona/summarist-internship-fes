"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Clock } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  imageLink: string;
  subscriptionRequired: boolean;
  audioLink: string;
}

interface RecommendedBookCardProps {
  book: Book;
  onClick?: () => void;
}

const RecommendedBookCard: React.FC<RecommendedBookCardProps> = ({ book, onClick }) => {
  const router = useRouter();
  const [audioDuration, setAudioDuration] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudioDuration = async () => {
      try {
        const bookResponse = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${book.id}`);
        const bookData = await bookResponse.json();
        const audioLink = bookData.audioLink;

        if (audioLink) {
          const audio = new Audio(audioLink);
          audio.addEventListener("loadedmetadata", () => {
            const duration = audio.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            setAudioDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`);
          });

          audio.addEventListener("error", () => {
            setAudioDuration("Duration not available");
          });

          audio.load();
        } else {
          setAudioDuration("Audio not available");
        }
      } catch (error) {
        setAudioDuration("Duration not available");
      }
    };

    fetchAudioDuration();
  }, [book.id]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/book/${book.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-[rgba(245,245,245,0.9)] transition-all duration-300 ease-in-out "
    >
      <div className="relative w-full h-60 mb-2">
        <Image
          src={book.imageLink}
          alt={book.title}
          fill
          sizes="(min-width: 640px) 200px, 100px"
          style={{ objectFit: "contain" }}
          onError={(e) => {
            e.currentTarget.src = "/placeholder-image.jpg";
          }}
        />
        {book.subscriptionRequired && (
       <div className="absolute top-2 right-2 bg-blue-1 text-white text-xs px-2 py-1 rounded-full">
       Premium
     </div>
        )}
      </div>
      <h3 className="text-lg font-bold text-center  text-blue-1">{book.title}</h3>
      <p className="text-blue-1 text-center  italic text-sm pb-2">{book.author}</p>
      <p className="text-sm text-gray-600 text-center ">{book.subTitle}</p>
      <div className="flex items-center justify-center text-sm text-center  mx-auto text-gray-600 mt-2">
  {audioDuration && (
    <>
      <Clock size={16} className="mr-1" />
      <span>{audioDuration}</span>
    </>
        )}
      </div>
    </div>
  );
};

export default RecommendedBookCard;
