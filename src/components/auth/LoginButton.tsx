"use client";
import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import AuthModal from "./AuthModal";
import { FaSpinner } from "react-icons/fa";

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  user?: User | null | undefined;
  loading?: boolean;
}

const LoginButton: React.FC<ButtonProps> = ({
  className = "",
  children,
  user,
  loading = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSignOutPopup, setShowSignOutPopup] = useState(false);

  const handleClick = async () => {
    if (user) {
      setIsSigningOut(true);
      try {
        await signOut(auth);
        setShowSignOutPopup(true);
      } catch (error) {
        console.error("Error signing out:", error);
      } finally {
        setIsSigningOut(false);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSignOutPopup) {
      timer = setTimeout(() => {
        setShowSignOutPopup(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSignOutPopup]);

  const buttonContent = () => {
    if (loading || isSigningOut) {
      return <FaSpinner className="animate-spin" />;
    }
    if (user) {
      return "Sign Out";
    }
    return children;
  };

  return (
    <>
      <button
        className={`bg-green-1 text-white w-full max-w-[300px] h-10 rounded transition-colors duration-200 hover:bg-green-2 flex items-center justify-center ${className}`}
        onClick={handleClick}
        disabled={loading || isSigningOut}
      >
        {buttonContent()}
      </button>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {showSignOutPopup && (
        <div className="fixed bottom-4 right-4 bg-green-1 text-white p-4 rounded-md shadow-lg">
          Successfully signed out!
        </div>
      )}
    </>
  );
};

export default LoginButton;
