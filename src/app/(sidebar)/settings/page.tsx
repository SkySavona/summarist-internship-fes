"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { getFirebaseAuth } from "@/services/firebaseConfig";
import Searchbar from "@/components/SearchBar";
import LoginDefault from "@/components/LoginDefault";
import Link from "next/link";

interface SubscriptionData {
  status: string;
  role: string;
  current_period_end: { seconds: number; nanoseconds: number };
}

const Settings: React.FC = () => {
  const auth = getFirebaseAuth();
  const [user] = useAuthState(auth);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("Loading...");
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string>("Loading...");
  const [userEmail, setUserEmail] = useState<string>("Loading...");

  useEffect(() => {
    if (user) {
      setUserEmail(user.email || "No email available");

      const fetchPremiumStatus = async () => {
        try {
          const response = await fetch('/api/premium-status', {
            headers: {
              'Authorization': `Bearer ${await user.getIdToken()}`
            }
          });
          const data = await response.json();
          console.log("Premium status response:", data);
          
          if (data.isPremium) {
            setSubscriptionPlan("Premium");
          } else {
            setSubscriptionPlan("No active subscription");
          }
        } catch (error) {
          console.error("Error fetching premium status:", error);
          setSubscriptionPlan("Error fetching plan");
        }
      };

      fetchPremiumStatus();

      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      const subscriptionsRef = doc(db, "users", user.uid, "subscriptions", "sub_1PvKEgRpLrmHfjrMNE2Isfcb");

      const unsubscribe = onSnapshot(subscriptionsRef, (doc) => {
        if (doc.exists()) {
          const subscriptionData = doc.data() as SubscriptionData;
          console.log("Subscription data:", subscriptionData);

          if (subscriptionData.status === 'active' && subscriptionData.role === 'Premium') {
            setSubscriptionPlan("Premium");
            const endDate = new Date(subscriptionData.current_period_end.seconds * 1000);
            setSubscriptionEndDate(endDate.toLocaleDateString());
          } else if (subscriptionData.status === 'trialing') {
            setSubscriptionPlan("Trialing");
            const endDate = new Date(subscriptionData.current_period_end.seconds * 1000);
            setSubscriptionEndDate(endDate.toLocaleDateString());
          } else {
            setSubscriptionPlan("No active subscription");
            setSubscriptionEndDate("N/A");
          }
        } else {
          setSubscriptionPlan("No subscription data");
          setSubscriptionEndDate("N/A");
        }
      }, (error) => {
        console.error("Error fetching subscription:", error);
        setSubscriptionPlan("Error fetching plan");
        setSubscriptionEndDate("N/A");
      });

      return () => unsubscribe();
    } else {
      setSubscriptionPlan("No user logged in");
      setSubscriptionEndDate("N/A");
      setUserEmail("No user logged in");
    }
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
        {subscriptionPlan === "Premium" && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-1 mb-2">
              Subscription End Date
            </h2>
            <p className="text-blue-1">{subscriptionEndDate}</p>
          </div>
        )}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-1 mb-2">Email</h2>
          <p className="text-blue-1">{userEmail}</p>
        </div>
        {subscriptionPlan !== "Premium" && subscriptionPlan !== "Trialing" && (
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