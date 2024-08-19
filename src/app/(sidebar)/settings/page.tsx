"use client";

import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import LoginDefault from '@/components/LoginDefault';

const Settings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>('');

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch subscription plan from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setSubscriptionPlan(userDoc.data().subscriptionPlan || 'No plan');
          } else {
            setSubscriptionPlan('No plan');
          }
        } catch (error) {
          console.error('Error fetching subscription plan:', error);
          setSubscriptionPlan('Error fetching plan');
        }
      } else {
        setUser(null);
        setSubscriptionPlan('');
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <div> <LoginDefault onLoginSuccess={function (): void {
      throw new Error('Function not implemented.');
    } }/></div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-blue-1 mb-8">Settings</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-blue-1 mb-2">Your Subscription Plan</h2>
        <p className="text-blue-1">{subscriptionPlan || 'Loading...'}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-blue-1 mb-2">Email</h2>
        <p className="text-blue-1">{user.email}</p>
      </div>
      
      {/* Add more settings sections as needed */}
    </div>
  );
};

export default Settings;