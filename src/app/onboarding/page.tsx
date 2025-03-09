'use client';

import { type FormEvent, useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STUDY_GROUPS = ['КИ21-22Б', 'КИ22-23Б', 'КИ23-24Б', 'КИ24-25Б'];

const COUNTRY_CODES = ['kz', 'uz', 'kg', 'tj'] as const;

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [country, setCountry] = useState('');
    const [studyGroup, setStudyGroup] = useState('');
    const t = useTranslations('onboarding');
    const tCountries = useTranslations('countries');

    useEffect(() => {
        const userCountry = session?.user?.country;
        const userStudyGroup = session?.user?.study_group;
        const hasRequiredData = Boolean(userCountry && userStudyGroup);

        if (hasRequiredData) {
            router.replace('/');
        }
    }, [session, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const hasCountry = Boolean(country);
        const hasStudyGroup = Boolean(studyGroup);
        const hasAllFields = hasCountry && hasStudyGroup;

        if (!hasAllFields) {
            return;
        }

        setLoading(true);
        try {
            console.log('Sending data:', { country, study_group: studyGroup });
            const response = await fetch('/api/users/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country, study_group: studyGroup }),
            });

            const data = await response.json();
            console.log('Response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            // Wait for session update to complete
            await update({
                ...session,
                user: { ...session?.user, country, study_group: studyGroup },
            });

            // Force a hard reload to ensure middleware picks up the new session
            window.location.href = '/';
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error instanceof Error ? error.message : 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const hasCountry = Boolean(country);
    const hasStudyGroup = Boolean(studyGroup);
    // biome-ignore lint/complexity/useSimplifiedLogicExpression: <explanation>
    const isSubmitDisabled = !hasCountry || !hasStudyGroup || loading;

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-sm rounded-lg border p-6 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold">{t('title')}</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
                    <div className="space-y-2">
                        <label htmlFor="country" className="text-sm font-medium">
                            {t('country.label')}
                        </label>
                        <Select value={country} onValueChange={setCountry} name="country">
                            <SelectTrigger id="country">
                                <SelectValue placeholder={t('country.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {COUNTRY_CODES.map(code => (
                                    <SelectItem key={code} value={code}>
                                        {tCountries(code)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="study-group" className="text-sm font-medium">
                            {t('studyGroup.label')}
                        </label>
                        <Select value={studyGroup} onValueChange={setStudyGroup} name="study-group">
                            <SelectTrigger id="study-group">
                                <SelectValue placeholder={t('studyGroup.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {STUDY_GROUPS.map(group => (
                                    <SelectItem key={group} value={group}>
                                        {group}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
                        {loading ? t('submit.loading') : t('submit.default')}
                    </Button>
                </form>
            </div>
        </div>
    );
}
