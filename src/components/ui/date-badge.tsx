import { CalendarClock } from 'lucide-react';

interface DateBadgeProps {
    date: Date | string;
}

function formatDate(isoDate: string) {
    const date = new Date(isoDate);

    const formatter = new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
    });

    return formatter.format(date);
}

export function DateBadge({ date }: DateBadgeProps) {
    return (
        <div className=" flex items-center space-x-4 rounded-md border p-4">
            <CalendarClock />
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{formatDate(date as string)}</p>
            </div>
        </div>
    );
}
