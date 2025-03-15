import type { ComponentProps } from 'react';

import { useTranslations } from 'next-intl';

import { Check, Clock, Lock, Trophy } from 'lucide-react';

import { BlockedTasks } from '@/components/tasks/blocked-tasks';
import { TaskStatus } from '@/components/tasks/task-status';
import { AddressBadge } from '@/components/ui/address-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactsBadge } from '@/components/ui/contacts-badge';
import { DateBadge } from '@/components/ui/date-badge';
import { DocumentsBadge } from '@/components/ui/documents-badge';
import { LocalizedText } from '@/components/ui/localized-text';
import { Progress } from '@/components/ui/progress';
import { ScheduleBadge } from '@/components/ui/schedule-badge';
import { useGetTasks } from '@/hooks/api/entities/tasks/use-get-tasks';
import { useApiPost } from '@/hooks/api/use-api-post';
import { useBreakpoint } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { STATUS, type Schedule, type Task } from '@/types';

type TaskCardProps = ComponentProps<typeof Card> & { task: Task };

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export function TaskCard({ className, task, ...props }: TaskCardProps) {
    const t = useTranslations();
    const { postData } = useApiPost<{ id: number }>();
    const { data: tasks } = useGetTasks();
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'xs' || breakpoint === 'sm';

    const markAsDone = async () => {
        const data = { id: task.id };
        const result = await postData('/api/tasks/finish', data);
        if (result) {
            task.status = STATUS.FINISHED;
        }
    };

    const renderTaskBadges = (task: Task) => {
        return (
            <div className="grid gap-4 md:grid-cols-2">
                {task.schedule && (
                    <div className="col-span-full">
                        <ScheduleBadge schedule={task.schedule} />
                    </div>
                )}
                {task.documents && <DocumentsBadge documents={task.documents} />}
                {task.address && <AddressBadge addresses={task.address} />}
                {task.contacts && <ContactsBadge contacts={task.contacts} />}
            </div>
        );
    };

    const renderDoneButton = () => {
        if (task.status === STATUS.FINISHED) {
            return null;
        }

        if (task.id === 2 && task.proof_status !== 'proofed') {
            return null;
        }

        return (
            <Button className={cn('gap-1.5 w-full md:w-auto', isMobile ? 'h-10 py-2' : '')} onClick={markAsDone}>
                <Check className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />
                {t('task.markAsDone')}
            </Button>
        );
    };

    const schedule = task.schedule as Schedule;
    const scheduleDays = schedule ? DAYS.filter(day => schedule[day]?.length > 0) : [];

    // Находим задачи, которые будут разблокированы после выполнения текущей
    const blockedTasks = tasks?.filter(t => t.blocks?.includes(task.id)) ?? [];

    return (
        <Card className={cn('w-full h-[max-content] border shadow-sm', isMobile ? 'p-3' : 'p-4', className)} {...props}>
            <CardHeader className={cn('flex flex-col gap-4', isMobile ? 'p-3' : 'p-4')}>
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <CardTitle className={cn('mb-2', isMobile ? 'text-lg' : 'text-xl')}>
                            <LocalizedText text={task.title} />
                        </CardTitle>
                        <CardDescription
                            className={cn('line-clamp-3', isMobile ? 'text-sm' : '')}
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            <LocalizedText text={task.description} />
                        </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-center gap-1.5">
                            <Trophy className={cn('text-primary', isMobile ? 'h-4 w-4' : 'h-5 w-5')} />
                            <span className={cn('font-medium', isMobile ? 'text-sm' : '')}>
                                {task.experience_points} XP
                            </span>
                        </div>
                        <TaskStatus status={task.status} />
                    </div>
                </div>

                {task.picked_date && (
                    <div className="flex items-center gap-2">
                        <DateBadge date={task.picked_date} />
                    </div>
                )}

                {scheduleDays.length > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className={cn('shrink-0', isMobile ? 'h-4 w-4' : 'h-5 w-5')} />
                        <div className={cn('flex gap-1.5 flex-wrap', isMobile ? 'text-xs' : 'text-sm')}>
                            {scheduleDays.map(day => (
                                <Badge
                                    key={day}
                                    variant="outline"
                                    className={cn(
                                        'px-2 py-0.5 h-auto font-normal',
                                        isMobile ? 'text-xs' : 'text-sm',
                                        day === 'saturday' || day === 'sunday' ? 'text-destructive' : '',
                                    )}
                                >
                                    {t(`days.${day}`)}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardHeader>

            <CardContent className={cn('grid gap-4', isMobile ? 'px-3 py-2' : 'p-4')}>
                {renderTaskBadges(task)}

                {blockedTasks.length > 0 && (
                    <div className="col-span-full mt-2">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-md flex-1">
                                <Lock className={cn('text-primary', isMobile ? 'h-4 w-4' : 'h-5 w-5')} />
                                <span className={cn('font-medium', isMobile ? 'text-sm' : 'text-base')}>
                                    {t('task.blockedTasks')}
                                </span>
                                <Badge variant="secondary" className="ml-auto">
                                    {blockedTasks.length}
                                </Badge>
                            </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <BlockedTasks tasks={blockedTasks} />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('task.experience')}</span>
                        <span className="font-medium">{task.experience_points} XP</span>
                    </div>
                    <Progress value={33} className="h-2" />
                </div>
            </CardContent>

            <CardFooter className={cn('gap-2', isMobile ? 'px-3 pt-2 pb-3 flex-col' : 'flex-row justify-between')}>
                {renderDoneButton()}
            </CardFooter>
        </Card>
    );
}
