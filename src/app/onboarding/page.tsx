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
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Example study groups: КИ21-22Б, КИ22-23Б, КИ23-24Б, КИ24-25Б
const STUDY_GROUP_PATTERN = /[А-ЯЁа-яё\d]+[-–—][А-ЯЁа-яё\d]+/;

const COUNTRY_CODES = [
  'kz',
  'uz',
  'kg',
  'tj',
  'by',
  'ua',
  'md',
  'am',
  'az',
  'ge',
  'ee',
  'lv',
  'lt',
  'tm',
] as const;
const SEX_OPTIONS = ['male', 'female'] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState('');
  const [studyGroup, setStudyGroup] = useState('');
  const [studyGroupError, setStudyGroupError] = useState<string | null>(null);
  const [sex, setSex] = useState('');
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>();
  const t = useTranslations('onboarding');
  const tCountries = useTranslations('countries');
  const locale = useLocale();

  useEffect(() => {
    const userCountry = session?.user?.country;
    const userStudyGroup = session?.user?.study_group;
    const userSex = session?.user?.sex;
    if (userCountry && userStudyGroup && userSex) {
      router.replace('/');
    }
  }, [session, router]);

  const validateStudyGroup = (value: string) => {
    if (!value) {
      setStudyGroupError(null);
      return false;
    }

    if (!STUDY_GROUP_PATTERN.test(value)) {
      setStudyGroupError(t('studyGroup.validationError'));
      return false;
    }

    setStudyGroupError(null);
    return true;
  };

  const handleStudyGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStudyGroup(value);
    validateStudyGroup(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const hasCountry = Boolean(country);
    const isStudyGroupValid = validateStudyGroup(studyGroup);
    const hasSex = Boolean(sex);
    const hasRequiredFields = hasCountry && isStudyGroupValid && hasSex;

    if (!hasRequiredFields) {
      setError('Country, valid study group and sex are required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/users/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          study_group: studyGroup,
          sex,
          arrival_date: arrivalDate,
        }),
      });

      const data = await response.json();

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
      setError(
        error instanceof Error ? error.message : 'Failed to update profile',
      );
    } finally {
      setLoading(false);
    }
  };

  const hasCountry = Boolean(country);
  const hasSex = Boolean(sex);
  const isStudyGroupValid = Boolean(studyGroup) && !studyGroupError;
  const isSubmitDisabled =
    loading || !(hasCountry && isStudyGroupValid && hasSex);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">{t('title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

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
            <Input
              value={studyGroup}
              onChange={handleStudyGroupChange}
              name="study-group"
              placeholder={t('studyGroup.placeholder')}
              pattern={STUDY_GROUP_PATTERN.source}
            />
            {studyGroupError && (
              <div className="text-sm text-destructive">{studyGroupError}</div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="arrival-date" className="text-sm font-medium">
              {t('arrivalDate.label')}
            </label>
            <p className="text-sm text-muted-foreground mb-2">
              {t('arrivalDate.description')}
            </p>
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
              <PopoverContent className="w-[340px] p-0" align="start">
                <Calendar
                  mode="single"
                  selected={arrivalDate}
                  onSelect={setArrivalDate}
                  initialFocus
                  disabled={date => date < new Date()}
                  className="rounded-md border"
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
