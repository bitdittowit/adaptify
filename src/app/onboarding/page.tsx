'use client';

import { type FormEvent, useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const STUDY_GROUPS = ['КИ21-22Б', 'КИ22-23Б', 'КИ23-24Б', 'КИ24-25Б'];

const COUNTRY_CODES = ['kz', 'uz', 'kg', 'tj'] as const;
const SEX_OPTIONS = ['male', 'female'] as const;

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [country, setCountry] = useState('');
    const [studyGroup, setStudyGroup] = useState('');
    const [sex, setSex] = useState('');
    const [arrivalDate, setArrivalDate] = useState<Date | undefined>();
    const t = useTranslations('onboarding');
    const tCountries = useTranslations('countries');
    const locale = useLocale();

    useEffect(() => {
        const userCountry = session?.user?.country;
        const userStudyGroup = session?.user?.study_group;
        const userSex = session?.user?.sex;
        const hasRequiredData = Boolean(userCountry && userStudyGroup && userSex);

        if (hasRequiredData) {
            router.replace('/');
        }
    }, [session, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const hasCountry = Boolean(country);
        const hasStudyGroup = Boolean(studyGroup);
        const hasSex = Boolean(sex);
        const hasAllFields = hasCountry && hasStudyGroup && hasSex;

        if (!hasAllFields) {
            return;
        }

        setLoading(true);
        try {
            console.log('Sending data:', {
                country,
                study_group: studyGroup,
                sex,
                arrival_date: arrivalDate,
            });
            const response = await fetch('/api/users/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    country,
                    study_group: studyGroup,
                    sex,
                    arrival_date: arrivalDate ? arrivalDate.toISOString() : null,
                }),
            });

            const data = await response.json();
            console.log('Response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            await update({
                ...session,
                user: {
                    ...session?.user,
                    country,
                    study_group: studyGroup,
                    sex,
                    arrival_date: arrivalDate,
                },
            });

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
    const hasSex = Boolean(sex);
    // biome-ignore lint/complexity/useSimplifiedLogicExpression: <explanation>
    const isSubmitDisabled = !hasCountry || !hasStudyGroup || !hasSex || loading;

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-sm rounded-lg border p-6 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold">{t('title')}</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

                    <div className="space-y-2">
                        <label htmlFor="sex" className="text-sm font-medium">
                            {t('sex.label')}
                        </label>
                        <Select value={sex} onValueChange={setSex} name="sex">
                            <SelectTrigger id="sex">
                                <SelectValue placeholder={t('sex.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {SEX_OPTIONS.map(option => (
                                    <SelectItem key={option} value={option}>
                                        {t(`sex.options.${option}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

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

                    <div className="space-y-2">
                        <label htmlFor="arrival-date" className="text-sm font-medium">
                            {t('arrivalDate.label')}
                        </label>
                        <p className="text-sm text-muted-foreground mb-2">{t('arrivalDate.description')}</p>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="arrival-date"
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !arrivalDate && 'text-muted-foreground',
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {arrivalDate
                                        ? format(arrivalDate, 'PPP', {
                                              locale: locale === 'ru' ? ru : enUS,
                                          })
                                        : t('arrivalDate.placeholder')}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={arrivalDate}
                                    onSelect={setArrivalDate}
                                    initialFocus
                                    disabled={date => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
                        {loading ? t('submit.loading') : t('submit.default')}
                    </Button>
                </form>
            </div>
        </div>
    );
}
