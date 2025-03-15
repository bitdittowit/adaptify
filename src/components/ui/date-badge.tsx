import { useLocale } from 'next-intl';

import { CalendarClock } from 'lucide-react';

import { cn } from '@/lib/utils';

interface DateBadgeProps {
    date: Date | string;
    className?: string;
}

function formatDate(date: Date | string, locale: string) {
    const dateObj = date instanceof Date ? date : new Date(date);

    const formatter = new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: 'long',
    });

    return formatter.format(dateObj);
}

export function DateBadge({ date, className }: DateBadgeProps) {
    const locale = useLocale();

    return (
        <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
            <CalendarClock className="h-4 w-4 shrink-0" />
            <span className="text-sm">{formatDate(date, locale)}</span>
        </div>
    );
}
