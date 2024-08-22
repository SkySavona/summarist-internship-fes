"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
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
  onLoginSuccess?: () => void;
}

const LoginButton: React.FC<ButtonProps> = ({
  className = "",
  children,
  user,
  loading = false,
  onLoginSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSignOutPopup, setShowSignOutPopup] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
      setShowSignOutPopup(true);
      setTimeout(() => {
        setShowSignOutPopup(false);
      }, 3000);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsModalOpen(false);
    if (onLoginSuccess) {
      onLoginSuccess();
    }

    if (pathname === "/") {
      router.push("/for-you");
    }
  };

  const handleClick = () => {
    if (user) {
      handleSignOut();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        className={`bg-green-1 text-white w-full max-w-[300px] h-10 rounded transition-colors duration-200 hover:bg-green-2 flex items-center justify-center ${className}`}
        onClick={handleClick}
        disabled={loading || isSigningOut}
      >
        {loading || isSigningOut ? <FaSpinner className="animate-spin" /> : children}
      </button>
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}  
      />
      {showSignOutPopup && (
        <div className="fixed bottom-4 right-4 bg-green-1 text-white p-4 rounded-md shadow-lg z-50">
          Successfully signed out!
        </div>
      )}
    </>
  );
};

export default LoginButton;
