import { useLocale } from 'next-intl';

import { CalendarClock } from 'lucide-react';

interface DateBadgeProps {
    date: Date | string;
}

function formatDate(date: Date | string, locale: string) {
    const dateObj = date instanceof Date ? date : new Date(date);

    const formatter = new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: 'long',
    });

    return formatter.format(dateObj);
}

export function DateBadge({ date }: DateBadgeProps) {
    const locale = useLocale();

    return (
        <div className="flex items-center space-x-4 rounded-md border p-4">
            <CalendarClock />
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{formatDate(date, locale)}</p>
            </div>
        </div>
    );
}
