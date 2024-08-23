"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth } from "@/services/firebaseConfig";
import Searchbar from "@/components/SearchBar";
import LoginDefault from "@/components/LoginDefault";
import Link from "next/link";

interface UserDocument {
  firebaseRole: string;
  email: string;
}

const Settings: React.FC = () => {
  const auth = getFirebaseAuth();
  const [user] = useAuthState(auth);
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<string>("Loading...");
  const [userEmail, setUserEmail] = useState<string>("Loading...");

  useEffect(() => {
    const fetchSubscriptionPlan = async () => {
      if (user) {
        setUserEmail(user.email || "No email available");

        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);

        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserDocument;

            if (userData.firebaseRole === "Premium") {
              setSubscriptionPlan("Premium");
            } else {
              setSubscriptionPlan("No active subscription");
            }
          } else {
            setSubscriptionPlan("No subscription data");
          }
        } catch (error) {
          setSubscriptionPlan("Error fetching plan");
        }
      } else {
        setSubscriptionPlan("No user logged in");
        setUserEmail("No user logged in");
      }
    };

    fetchSubscriptionPlan();
  }, [user]);

  if (!user) {
    return (
      <LoginDefault
        onLoginSuccess={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
  }

  return (
    <div className="pt-4">
      <div className="pr-2 pb-4 border-b w-full border-gray-200 z-2 relative">
        <Searchbar />
      </div>

      <div className="mx-auto p-24 pt-8">
        <h1 className="text-3xl font-bold text-blue-1 mb-8 md:text-md mt-1 border-b pb-4 border-gray-300">
          Settings
        </h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-1 mb-2">
            Your Subscription Plan
          </h2>
          <p className="text-blue-1">{subscriptionPlan}</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-1 mb-2">Email</h2>
          <p className="text-blue-1">{userEmail}</p>
        </div>
        {subscriptionPlan !== "Premium" && (
          <Link
            href="/choose-plan"
            className="bg-green-1 text-white px-4 py-2 rounded transition ease-in-out duration-300 hover:bg-green-2"
          >
            Subscribe Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default Settings;
