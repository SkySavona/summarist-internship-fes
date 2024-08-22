'use client';

import React, { Suspense, useEffect } from 'react';
import { LoadingProvider, useLoading } from '@/components/ui/LoadingContext';
import { usePathname, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname, searchParams, setIsLoading]);

  return null;
}

function CustomLoadingSpinner() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
      <LoadingSpinner />
    </div>
  );
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <NavigationEvents />
        <CustomLoadingSpinner />
        {children}
      </Suspense>
    </LoadingProvider>
  );
}
