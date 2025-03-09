import { useTranslations } from 'next-intl';

import { Calendar } from 'lucide-react';

import { daysOfWeek } from '@/constants/days-of-week';
import type { Schedule } from '@/types';

interface ScheduleBadgeProps {
    schedule: Schedule;
}

export function ScheduleBadge({ schedule }: ScheduleBadgeProps) {
    const t = useTranslations();

    return (
        <div className="border p-4 rounded-md grid gap-4">
            <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <h2 className="text-foreground font-semibold leading-none tracking-tight">{t('task.schedule')}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {daysOfWeek.map(day => (
                    <div key={day} className="flex-1">
                        <p className="text-sm font-medium leading-none">{t(`days.${day}`)}</p>
                        {schedule[day].length > 0 ? (
                            <ul className="list-none">
                                {schedule[day].map(timeRange => (
                                    <li key={`${day}-${timeRange}`} className="text-sm">
                                        {timeRange}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">{t('task.noSchedule')}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
