"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Searchbar from "./SearchBar";
import LoginButton from "./auth/LoginButton";

interface LoginDefaultProps {
  message?: string;
  onLoginSuccess: () => void;
}

const LoginDefault: React.FC<LoginDefaultProps> = ({
  message = "Log in to your account to see your details.",
  onLoginSuccess,
}) => {
  return (
    <>
    <div className="pt-4"></div>
      <div className="pr-2 pb-4 border-b w-full border-gray-200 z-2 relative">
        <Searchbar />
      </div>
      <div className="flex flex-col items-center justify-center p-4 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center items-center w-96 h-72 ml-6">
            <div className="relative w-full h-full flex justify-center items-center">
              <Image
                src="/assets/login.png"
                alt="Login illustration"
                fill
                sizes="100%"
                className="object-contain"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-blue-1 mb-4">{message}</h2>
          <div className="flex justify-center items-center">
            <LoginButton onLoginSuccess={onLoginSuccess}>Log In</LoginButton>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginDefault;
