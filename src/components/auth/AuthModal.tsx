"use client";

import React, { useState, Suspense } from "react";
import dynamic from 'next/dynamic';
import LoadingSpinner from "../ui/LoadingSpinner";

const AuthModalContent = dynamic(() => import('./AuthModalContent'), { 
  ssr: false,
  loading: () => <LoadingSpinner />
});

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSuccess = () => {
    if (!isLoading && onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Suspense fallback={<LoadingSpinner />}>
        {isLoading ? (
         <div className="w-full h-full flex justify-center items-center bg-white bg-opacity-90">
         <LoadingSpinner />
       </div>
        ) : (
          <AuthModalContent 
            onClose={handleClose} 
            onLoginSuccess={handleLoginSuccess} 
          />
        )}
      </Suspense>
    </div>
  );
};

export default AuthModal;