"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Audio = {
  audioUrl: string;
  imageUrl: string;
  title: string;
  author: string;
  podcastId: string;
} | undefined;

type AudioContextType = {
  audio: Audio;
  setAudio: React.Dispatch<React.SetStateAction<Audio>>;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [audio, setAudio] = useState<Audio>(undefined);

  return (
    <AudioContext.Provider value={{ audio, setAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};