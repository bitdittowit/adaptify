import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ArrowRight, Clock, Lock, Trophy } from 'lucide-react';

import { TaskStatus } from '@/components/tasks/task-status';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { LocalizedText } from '@/components/ui/localized-text';
import { Progress } from '@/components/ui/progress';
import { useBreakpoint } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { Schedule, Task } from '@/types';

interface BlockedTasksProps {
    tasks: Task[];
    className?: string;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export function BlockedTasks({ tasks, className }: BlockedTasksProps) {
    const t = useTranslations();
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'xs' || breakpoint === 'sm';

    if (!tasks.length) {
        return null;
    }

    return (
        <div className={cn('grid gap-3', className)}>
            {tasks.map(task => {
                const schedule = task.schedule as Schedule;
                const scheduleDays = schedule ? DAYS.filter(day => schedule[day]?.length > 0) : [];

                return (
                    <Link key={task.id} href={`/tasks/id/${task.id}`} className="block group">
                        <Card
                            className={cn(
                                'relative w-full transition-all duration-200 overflow-hidden',
                                'hover:shadow-lg hover:scale-[1.02] hover:border-primary/50',
                                'before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity',
                                'group-hover:before:opacity-100',
                                isMobile ? 'p-3' : 'p-4',
                            )}
                        >
                            <div className="relative flex items-start gap-4">
                                <div className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-primary/10 rounded-full transition-all group-hover:scale-110" />
                                    <Lock
                                        className={cn(
                                            'relative text-primary transition-transform',
                                            'group-hover:scale-110 group-hover:rotate-12',
                                            isMobile ? 'h-4 w-4' : 'h-5 w-5',
                                        )}
                                    />
                                </div>

                                <div className="min-w-0 flex-1 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1 min-w-0">
                                            <h4
                                                className={cn(
                                                    'font-medium line-clamp-1 transition-colors',
                                                    'group-hover:text-primary',
                                                    isMobile ? 'text-sm' : 'text-base',
                                                )}
                                            >
                                                <LocalizedText text={task.title} />
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Trophy
                                                        className={cn(
                                                            'text-primary/75',
                                                            isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4',
                                                        )}
                                                    />
                                                    <span
                                                        className={cn(
                                                            'font-medium text-primary/75',
                                                            isMobile ? 'text-xs' : 'text-sm',
                                                        )}
                                                    >
                                                        {task.experience_points} XP
                                                    </span>
                                                </div>
                                                {scheduleDays.length > 0 && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock
                                                            className={cn(
                                                                'text-muted-foreground/75',
                                                                isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4',
                                                            )}
                                                        />
                                                        <div className="flex gap-1">
                                                            {scheduleDays.slice(0, 2).map(day => (
                                                                <Badge
                                                                    key={day}
                                                                    variant="outline"
                                                                    className={cn(
                                                                        'font-normal border-primary/20',
                                                                        'group-hover:border-primary/40',
                                                                        isMobile ? 'text-[10px] px-1' : 'text-xs',
                                                                        day === 'saturday' || day === 'sunday'
                                                                            ? 'text-destructive'
                                                                            : 'text-primary/75',
                                                                    )}
                                                                >
                                                                    {t(`days.${day}`).slice(0, 2)}
                                                                </Badge>
                                                            ))}
                                                            {scheduleDays.length > 2 && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className={cn(
                                                                        'font-normal border-primary/20',
                                                                        'group-hover:border-primary/40',
                                                                        isMobile ? 'text-[10px] px-1' : 'text-xs',
                                                                    )}
                                                                >
                                                                    +{scheduleDays.length - 2}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <TaskStatus status={task.status} className="shrink-0" />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Progress
                                            value={33}
                                            className={cn(
                                                'h-1 flex-1 transition-all',
                                                'group-hover:scale-y-150 group-hover:opacity-80',
                                            )}
                                        />
                                        <ArrowRight
                                            className={cn(
                                                'text-muted-foreground transition-transform',
                                                'group-hover:translate-x-1',
                                                isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4',
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}
