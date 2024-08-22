"use client";

import React from "react";
import { User } from "firebase/auth";
import { FaSpinner } from "react-icons/fa";

interface SidebarLoginButtonProps {
  className?: string;
  children: React.ReactNode;
  user?: User | null | undefined;
  loading?: boolean;
  onClick?: () => void;
}

const SidebarLoginButton: React.FC<SidebarLoginButtonProps> = ({
  className = "",
  children,
  user,
  loading = false,
  onClick,
}) => {
  return (
    <button
      className={`bg-green-1 text-white w-full max-w-[300px] h-10 rounded transition-colors duration-200 hover:bg-green-2 flex items-center justify-center ${className}`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <FaSpinner className="animate-spin" /> : children}
    </button>
  );
};

export default SidebarLoginButton;