"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirebaseAuth } from "@/services/firebaseConfig";
import Searchbar from "@/components/SearchBar";
import LoginDefault from "@/components/LoginDefault";
import Link from "next/link";

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Settings: React.FC = () => {
  const auth = getFirebaseAuth();
  const [user] = useAuthState(auth);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("Loading...");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("Loading...");
  const [trialEndDate, setTrialEndDate] = useState<string>("Loading...");
  const [timeLeft, setTimeLeft] = useState<string>("Loading...");
  const [userEmail, setUserEmail] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPremiumStatus = async () => {
      if (!user) return;

      try {
        console.log("Fetching premium status...");
        const response = await fetch("/api/premium-status", {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        });
        const data = await response.json();
        console.log("Premium status response:", data);

        if (!isMounted) return;

        if (data.isPremium) {
          console.log("Setting subscription plan to Premium");
          setSubscriptionPlan(data.subscriptionName || "Premium");
          // Capitalize the subscription status
          setSubscriptionStatus(capitalizeFirstLetter(data.subscriptionStatus || "Unknown"));

          if (data.subscriptionStatus === "trialing" && data.trialEnd) {
            const trialEnd = new Date(data.trialEnd);
            const now = new Date();
            
            setTrialEndDate(trialEnd.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }));

            const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            setTimeLeft(`${daysLeft} days`);
          } else {
            setTrialEndDate("N/A");
            setTimeLeft("N/A");
          }
        } else {
          console.log("Setting subscription plan to No active subscription");
          setSubscriptionPlan("No active subscription");
          setSubscriptionStatus("N/A");
          setTrialEndDate("N/A");
          setTimeLeft("N/A");
        }
      } catch (error) {
        console.error("Error fetching premium status:", error);
        if (isMounted) {
          setSubscriptionPlan("Error fetching plan");
          setSubscriptionStatus("Error");
          setTrialEndDate("Error");
          setTimeLeft("Error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      setIsLoading(true);
      setUserEmail(user.email || "No email available");
      fetchPremiumStatus();
    } else {
      setSubscriptionPlan("No user logged in");
      setSubscriptionStatus("N/A");
      setTrialEndDate("N/A");
      setTimeLeft("N/A");
      setUserEmail("No user logged in");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!user) {
    return (
      <LoginDefault
        onLoginSuccess={() => {
          console.log("Login successful");
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
        {isLoading ? (
          <p>Loading subscription details...</p>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-blue-1 mb-2">
                Your Subscription Plan
              </h2>
              <p className="text-blue-1">{subscriptionPlan}</p>
            </div>
            {subscriptionPlan !== "No active subscription" && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-blue-1 mb-2">
                    Subscription Status
                  </h2>
                  <p className="text-blue-1">{subscriptionStatus}</p>
                </div>
                {subscriptionStatus === "Trialing" && (
                  <>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-blue-1 mb-2">
                        Trial End Date
                      </h2>
                      <p className="text-blue-1">{trialEndDate}</p>
                    </div>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-blue-1 mb-2">
                        Time Left in Trial
                      </h2>
                      <p className="text-blue-1">{timeLeft}</p>
                    </div>
                  </>
                )}
              </>
            )}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-blue-1 mb-2">Email</h2>
              <p className="text-blue-1">{userEmail}</p>
            </div>
            {subscriptionPlan === "No active subscription" && (
              <Link
                href="/choose-plan"
                className="bg-green-1 text-white px-4 py-2 rounded transition ease-in-out duration-300 hover:bg-green-2"
              >
                Subscribe Now
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;