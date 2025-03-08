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

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const t = useTranslations('theme-switcher');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="px-3 py-3 [&>svg]:size-8" asChild>
                <Button variant="outline">
                    {theme === 'light' && <Sun className="text-foreground" />}
                    {theme === 'dark' && <Moon className="text-foreground" />}
                    {theme === 'system' && <Monitor className="text-foreground" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left" className="w-56 mt-6">
                <DropdownMenuLabel>{t('choose')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={value => setTheme(value as 'light' | 'dark' | 'system')}
                >
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
