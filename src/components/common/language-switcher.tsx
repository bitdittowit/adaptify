'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Locale, locales } from '@/i18n/config';
import { setUserLocale } from '@/services/locale';

export function LanguageSwitcher() {
    const locale = useLocale();
    const t = useTranslations('language-switcher');

    const changeLanguage = async (value: string) => {
        const locale = value as Locale;
        await setUserLocale(locale);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="px-3 py-3 [&>svg]:size-8" asChild>
                <Button variant="outline">
                    <Languages className="text-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left" className="w-56 mt-6">
                <DropdownMenuLabel>{t('choose')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={locale} onValueChange={changeLanguage}>
                    {locales.map(locale => (
                        <DropdownMenuRadioItem key={locale} value={locale}>
                            {t(locale)}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
