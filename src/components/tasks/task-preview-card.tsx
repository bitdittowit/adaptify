import type { ComponentProps } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Clock } from 'lucide-react';

import { TaskStatus } from '@/components/tasks/task-status';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DateBadge } from '@/components/ui/date-badge';
import { LocalizedText } from '@/components/ui/localized-text';
import { useBreakpoint } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { Schedule, Task } from '@/types';

type TaskPreviewCardProps = ComponentProps<typeof Card> & { task: Task };

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export function TaskPreviewCard({ className, task, ...props }: TaskPreviewCardProps) {
    const t = useTranslations();
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'xs' || breakpoint === 'sm';

    const schedule = task.schedule as Schedule;
    const scheduleDays = schedule ? DAYS.filter(day => schedule[day]?.length > 0) : [];

    return (
        <Link href={`/tasks/id/${task.id}`} className="block w-full">
            <Card
                className={cn(
                    'w-full h-full transition-all duration-200',
                    'hover:shadow-md hover:border-primary/20',
                    className,
                )}
                {...props}
            >
                <CardHeader className={cn('flex-row items-start justify-between gap-4', isMobile ? 'p-3' : 'p-4')}>
                    <div className="space-y-2 min-w-0">
                        <h3 className={cn('font-medium line-clamp-2', isMobile ? 'text-sm' : 'text-base')}>
                            <LocalizedText text={task.title} />
                        </h3>
                        {scheduleDays.length > 0 && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className={cn('shrink-0', isMobile ? 'h-3 w-3' : 'h-4 w-4')} />
                                <div className={cn('flex gap-1 flex-wrap', isMobile ? 'text-[10px]' : 'text-xs')}>
                                    {scheduleDays.map(day => (
                                        <Badge
                                            key={day}
                                            variant="outline"
                                            className={cn(
                                                'px-1 py-0 h-auto font-normal',
                                                isMobile ? 'text-[10px]' : 'text-xs',
                                            )}
                                        >
                                            {t(`days.${day}`).slice(0, 2)}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge variant="secondary" className={isMobile ? 'text-xs' : 'text-sm'}>
                            {task.experience_points} XP
                        </Badge>
                        <TaskStatus status={task.status} />
                    </div>
                </CardHeader>
                {task.picked_date && (
                    <CardContent className={isMobile ? 'px-3 pb-3' : 'px-4 pb-4'}>
                        <DateBadge date={task.picked_date} />
                    </CardContent>
                )}
            </Card>
        </Link>
    );
}
