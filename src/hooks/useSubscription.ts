import { useState, useEffect } from 'react';
import { auth } from '@/services/firebase'; // Adjust the import path as needed

export const useSubscription = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      const user = auth.currentUser;
      if (user) {
        // Here, you would typically make an API call to your backend
        // to check the user's subscription status
        // For now, we'll just set a placeholder value
        setIsSubscribed(true); // Replace this with actual logic
      } else {
        setIsSubscribed(false);
      }
      setLoading(false);
    };

    checkSubscription();
  }, []);

  return { isSubscribed, loading };
};