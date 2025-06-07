'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';

/**
 * Hook to check if the current user is an admin
 * @returns {boolean} True if the user is an admin
 */
export function useIsAdmin(): boolean {
  const { data: session } = useNextAuthSession();
  return session?.user?.role === 'admin' || false;
}

/**
 * Hook to get the current user's role
 * @returns {string | undefined} The user's role, or undefined if not authenticated
 */
export function useUserRole(): string | undefined {
  const { data: session } = useNextAuthSession();
  return session?.user?.role;
}
