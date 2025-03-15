import { useTranslations } from 'next-intl';

import { Calendar } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Schedule } from '@/types';

interface ScheduleBadgeProps {
    schedule: Schedule;
    className?: string;
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export function ScheduleBadge({ schedule, className }: ScheduleBadgeProps) {
    const t = useTranslations();

    const activeDays = daysOfWeek.filter(day => schedule[day].length > 0);

    if (activeDays.length === 0) {
        return null;
    }

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="text-sm">{t('task.schedule')}</span>
            </div>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {activeDays.map(day => (
                    <div key={day} className="flex flex-col gap-1.5">
                        <Badge
                            variant="outline"
                            className={cn(
                                'px-2 py-0.5 h-auto font-normal text-xs w-fit',
                                day === 'saturday' || day === 'sunday' ? 'text-destructive' : '',
                            )}
                        >
                            {t(`days.${day}`)}
                        </Badge>
                        <div className="flex flex-wrap gap-1.5">
                            {schedule[day].map(timeRange => (
                                <Badge
                                    key={timeRange}
                                    variant="secondary"
                                    className="px-2 py-0.5 h-auto font-normal text-xs"
                                >
                                    {timeRange}
                                </Badge>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
