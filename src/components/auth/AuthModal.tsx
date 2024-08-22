'use client';

import React, { useState, Suspense } from "react";
import dynamic from 'next/dynamic';
import LoadingSpinner from "../ui/LoadingSpinner";

interface AuthModalContentProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  onSignUpSuccess: () => void;
  initialView: "login" | "signup";
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthModalContent = dynamic<AuthModalContentProps>(() => 
  import('@/components/auth/AuthModalContent').then((mod) => mod.default as React.ComponentType<AuthModalContentProps>), 
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "signup";
  onSignUpSuccess?: () => void;
  onLoginSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = "login",
  onSignUpSuccess,
  onLoginSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSuccess = () => {
    setIsLoading(false);
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const handleSignUpSuccess = () => {
    setIsLoading(false);
    if (onSignUpSuccess) {
      onSignUpSuccess();
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
        <AuthModalContent 
          onClose={handleClose} 
          onLoginSuccess={handleLoginSuccess}
          onSignUpSuccess={handleSignUpSuccess}
          initialView={initialView}
          setIsLoading={setIsLoading}
        />
      </Suspense>
    </div>
  );
};

export default AuthModal;