import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

export default async function LoginPage() {
    const session = await getServerSession();
    const t = await getTranslations('auth.login');

    if (session) {
        redirect('/');
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-sm rounded-lg border p-6 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold">{t('title')}</h1>
                <form>
                    <GoogleSignInButton>{t('googleButton')}</GoogleSignInButton>
                </form>
            </div>
        </div>
    );
}
