"use client";

import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirebaseAuth } from "@/services/firebaseConfig";
import Searchbar from "@/components/SearchBar";
import LoginDefault from "@/components/LoginDefault";

const Help: React.FC = () => {
  const auth = getFirebaseAuth();
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setToastMessage("Your message was sent successfully");
      setToastType("success");
      setShowToast(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setToastMessage("Error sending message. Please try again.");
      setToastType("error");
      setShowToast(true);
    }

    setTimeout(() => setShowToast(false), 3000);
  };

  if (!user) {
    return <LoginDefault onLoginSuccess={() => {}} />;
  }

  const inputClassName = "w-full p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-green-1 focus:border-transparent";

  return (
    <div className="pt-4">
      <div className="pr-2 pb-4 border-b w-full border-gray-200 z-2 relative">
        <Searchbar />
      </div>

      <div className="mx-auto p-24 pt-8">
        <h1 className="text-3xl font-bold text-blue-1 mb-8 md:text-md mt-1 border-b pb-4 border-gray-300">
          Help & Support
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-1 mb-4">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-blue-1 mb-1">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-blue-1 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-blue-1 mb-1">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className={`${inputClassName} h-32`}
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-green-1 text-white px-4 py-2 rounded transition ease-in-out duration-300 hover:bg-green-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {showToast && (
        <div className={`fixed bottom-4 right-4 ${toastType === 'success' ? 'bg-green-1' : 'bg-red-500'} text-white p-4 rounded-md shadow-lg z-50`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Help;