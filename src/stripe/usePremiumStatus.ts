"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

export default function usePremiumStatus(user: User | null) {
  const [premiumStatus, setPremiumStatus] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);

      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setPremiumStatus(
            userData.subscriptionStatus === 'active' || 
            userData.subscriptionStatus === 'trialing'
          );
        } else {
          setPremiumStatus(false);
        }
      });

      return () => unsubscribe();
    } else {
      setPremiumStatus(false);
    }
  }, [user]);

  return premiumStatus;
}