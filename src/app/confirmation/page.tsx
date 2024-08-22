"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const Confirmation: React.FC = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/for-you");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col items-center mb-8"
      >
        <FaCheckCircle className="text-green-1 text-6xl mb-4" />
        <h1 className="text-3xl font-bold text-blue-1">Subscription Confirmed!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for subscribing. You're all set to explore our amazing content.
        </p>
      </motion.div>
      <motion.button
        onClick={handleButtonClick}
        className="bg-green-1 text-white py-3 px-6 rounded-md text-lg hover:bg-green-2 transition duration-300 ease-in-out"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.3 }}
      >
        Go to For You
      </motion.button>
    </div>
  );
};

export default Confirmation;
