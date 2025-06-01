import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

/**
 * Server component utility to require authentication
 * Will redirect to login if not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  return session;
}
