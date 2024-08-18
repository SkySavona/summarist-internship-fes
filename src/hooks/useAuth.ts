import { useState, useEffect } from 'react';
import { auth } from '@/services/firebase'; 
import { User } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    loading,
  };
};