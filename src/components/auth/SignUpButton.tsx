'use client';

import React, { useState } from "react";
import { User } from "firebase/auth";
import AuthModal from "./AuthModal";
import { FaSpinner } from "react-icons/fa";

interface SignUpButtonProps {
  className?: string;
  children: React.ReactNode;
  user?: User | null | undefined;
  loading?: boolean;
  onSignUpSuccess?: () => void;
}

const SignUpButton: React.FC<SignUpButtonProps> = ({
  className = "",
  children,
  user,
  loading = false,
  onSignUpSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (!user) {
      setIsModalOpen(true);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className={`bg-green-1 text-white w-full max-w-[300px] h-10 rounded transition-colors duration-200 hover:bg-green-2 flex items-center justify-center ${className}`}
        onClick={handleClick}
        disabled={loading || !!user}
      >
        {loading ? <FaSpinner className="animate-spin" /> : children}
      </button>
      <AuthModal
        isOpen={isModalOpen}
        onClose={handleClose}
        initialView="signup"
        onSignUpSuccess={onSignUpSuccess}
      />
    </>
  );
};

export default SignUpButton;