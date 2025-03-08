'use client';

import { useTranslations } from 'next-intl';

import { Monitor, Moon, Sun } from 'lucide-react';

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
import { useTheme } from '@/hooks/use-theme';

type Theme = 'light' | 'dark' | 'system';

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const t = useTranslations('theme-switcher');

    const themeIcons = {
        light: <Sun className="text-foreground" />,
        dark: <Moon className="text-foreground" />,
        system: <Monitor className="text-foreground" />,
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="px-3 py-3 [&>svg]:size-8" asChild>
                <Button variant="outline">{themeIcons[theme as Theme]}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left" className="w-56 mt-6">
                <DropdownMenuLabel>{t('choose')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={theme} onValueChange={value => setTheme(value as Theme)}>
                    <DropdownMenuRadioItem value="light">
                        <Sun className="mr-2 h-4 w-4" />
                        <span>{t('light')}</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                        <Moon className="mr-2 h-4 w-4" />
                        <span>{t('dark')}</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>{t('system')}</span>
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
