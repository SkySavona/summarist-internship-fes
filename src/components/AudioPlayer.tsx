"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatTime } from "@/lib/formatTime";
import { cn } from "@/lib/utils";
import { useAudio } from "@/app/providers/AudioProvider";
import { Book } from "@/types/index";

interface AudioPlayerProps {
  book: Book;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ book }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.25);
  const { audio, setAudio } = useAudio();
  const [isForwardAnimating, setIsForwardAnimating] = useState(false);
  const [isRewindAnimating, setIsRewindAnimating] = useState(false);

  useEffect(() => {
    setAudio({
      audioUrl: book.audioLink,
      imageUrl: book.imageLink,
      title: book.title,
      author: book.author,
      podcastId: book.id,
    });
  }, [book, setAudio]);

  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  const forward = () => {
    if (audioRef.current && audioRef.current.currentTime + 10 <= duration) {
      audioRef.current.currentTime += 10;
    }
  };

  const handleForwardClick = () => {
    setIsForwardAnimating(true);
    forward();
    setTimeout(() => setIsForwardAnimating(false), 300);
  };

  const rewind = () => {
    if (audioRef.current && audioRef.current.currentTime - 10 >= 0) {
      audioRef.current.currentTime -= 10;
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleRewindClick = () => {
    setIsRewindAnimating(true);
    rewind();
    setTimeout(() => setIsRewindAnimating(false), 300);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      const updateCurrentTime = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      };

      const audioElement = audioRef.current;
      if (audioElement) {
        audioElement.addEventListener("timeupdate", updateCurrentTime);

        return () => {
          audioElement.removeEventListener("timeupdate", updateCurrentTime);
        };
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audio?.audioUrl) {
      setIsPlaying(false); // Ensure the player does not auto-play
    } else {
      audioElement?.pause();
      setIsPlaying(false);
    }
  }, [audio]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className={cn(
        "sticky bottom-0 text-white left-0 flex flex-col bg-blue-1",
        {
          hidden: !audio?.audioUrl || audio?.audioUrl === "",
        }
      )}
    >
      <section className="flex h-auto w-full items-center justify-between px-4 md:px-8 flex-wrap py-2">
        <audio
          ref={audioRef}
          src={audio?.audioUrl}
          className="hidden"
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
        <div className="flex items-center gap-4 max-md:order-2 max-md:w-full max-md:justify-center">
          <Link href={`/podcast/${audio?.podcastId}`}>
            <Image
              src={audio?.imageUrl || "/images/player1.png"}
              width={48}
              height={48}
              alt="player1"
              className="aspect-square rounded-xl max-md:w-12 max-md:h-12"
            />
          </Link>
          <div className="flex w-[140px] flex-col max-md:w-[100px]">
            <h2 className="text-14 truncate font-semibold text-white-1">
              {audio?.title}
            </h2>
            <p className="text-12 font-normal text-white-2">{audio?.author}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6 max-md:order-1 max-md:w-full max-md:justify-center">
          <div className="flex items-center gap-1.5">
            <Image
              src="/icons/reverse.svg"
              width={20}
              height={20}
              alt="-10"
              onClick={handleRewindClick}
              className={`cursor-pointer ${
                isRewindAnimating ? "animate-click" : ""
              }`}
            />
            <span className="text-sm text-white-2 px-1 py-0.5">-10</span>
          </div>
          <Image
            src={isPlaying ? "/icons/Pause.svg" : "/icons/Play.svg"}
            width={28}
            height={28}
            alt="play"
            onClick={togglePlayPause}
            className="max-md:w-6 max-md:h-6"
          />
          <div className="flex items-center gap-1.5">
            <Image
              src="/icons/forward.svg"
              width={20}
              height={20}
              alt="+10"
              onClick={handleForwardClick}
              className={`cursor-pointer ${
                isForwardAnimating ? "animate-click" : ""
              }`}
            />
            <span className="text-sm text-white-2 px-1 py-0.5">+10</span>
          </div>
        </div>
        <div className="flex items-center gap-6 w-1/2 max-md:w-full max-md:justify-center max-md:flex-wrap max-md:order-3 max-md:gap-2">
          <h2 className="text-14 font-normal text-white-2 max-md:hidden">
            {formatTime(currentTime)}
          </h2>
          <div className="w-full h-2 bg-gray-300 rounded-lg relative">
            <div
              className="h-2 bg-blue-500 rounded-lg"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <h2 className="text-14 font-normal text-white-2 max-md:hidden">
            {formatTime(duration)}
          </h2>
        </div>
        <div className="flex items-center  gap-3 max-md:flex-col max-md:mt-2 max-md:order-4">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="cursor-pointer w-20"
            />
            <Image
              src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
              width={20}
              height={20}
              alt="mute unmute"
              onClick={toggleMute}
              className="cursor-pointer  max-md:w-6 max-md:h-6"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AudioPlayer;