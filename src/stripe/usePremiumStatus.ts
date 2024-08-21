"use client";
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import isUserPremium from "./isUserPremium";

export default function usePremiumStatus(user: User | null) {
  const [premiumStatus, setPremiumStatus] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const checkPremiumStatus = async () => {
        const status = await isUserPremium(user);
        setPremiumStatus(status);
      };
      checkPremiumStatus();
    } else {
      setPremiumStatus(false);
    }
  }, [user]);

  return premiumStatus;
}