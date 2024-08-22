"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const Canceled: React.FC = () => {
  const router = useRouter();

  const handleReturnClick = () => {
    router.push("/choose-plan");
  };

  const handleSupportClick = () => {
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
        <FaTimesCircle className="text-red-500 text-6xl mb-4" />
        <h1 className="text-3xl font-bold text-blue-1">
          Subscription Cancelled
        </h1>
        <p className="text-gray-600 mt-2">
          We're sorry to see you go. If you have any questions or concerns,
          please don't hesitate to contact us.
        </p>
      </motion.div>
      <motion.div
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.3 }}
      >
        <motion.button
          onClick={handleReturnClick}
          className="bg-green-1 text-white py-3 px-6 rounded-md text-lg hover:bg-green-2 transition duration-300 ease-in-out"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Return to Plans
        </motion.button>
        <motion.button
          onClick={handleSupportClick}
          className="bg-gray-200 text-blue-1 py-3 px-6 rounded-md text-lg hover:bg-gray-300 transition duration-300 ease-in-out"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Support
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Canceled;
