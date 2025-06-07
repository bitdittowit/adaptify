'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAdmin } from '@/hooks/use-admin';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAdmin = useIsAdmin();
  
  useEffect(() => {
    if (isAdmin === false) {
      // Only redirect if we're sure the user is not an admin
      // This prevents flashing during loading
      router.replace('/');
    }
  }, [isAdmin, router]);
  
  // Show nothing while checking or if not admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse">Checking access...</div>
      </div>
    );
  }
  
  // Show children if admin
  return <>{children}</>;
} 