import type { ComponentProps } from 'react';

import { useTranslations } from 'next-intl';

import { Check } from 'lucide-react';

import { TaskStatus } from '@/components/tasks/task-status';
import { AddressBadge } from '@/components/ui/address-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactsBadge } from '@/components/ui/contacts-badge';
import { DateBadge } from '@/components/ui/date-badge';
import { DocumentsBadge } from '@/components/ui/documents-badge';
import { LocalizedText } from '@/components/ui/localized-text';
import { ScheduleBadge } from '@/components/ui/schedule-badge';
import { useApiPost } from '@/hooks/api/use-api-post';
import { useBreakpoint } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { STATUS, type Task } from '@/types';

type TaskCardProps = ComponentProps<typeof Card> & { task: Task };

export function TaskCard({ className, task, ...props }: TaskCardProps) {
    const t = useTranslations();
    const { postData } = useApiPost<{ id: number }>();
    const breakpoint = useBreakpoint();
    const isXsScreen = breakpoint === 'xs';

    const markAsDone = async () => {
        const data = { id: task.id };
        const result = await postData('/api/tasks/finish', data);
        if (result) {
            task.status = STATUS.FINISHED;
        }
    };

    const renderTaskBadges = (task: Task) => {
        return (
            <div className={cn('flex flex-wrap gap-2', isXsScreen ? 'justify-center' : '')}>
                {task.documents && <DocumentsBadge documents={task.documents} />}
                {task.schedule && <ScheduleBadge schedule={task.schedule} />}
                {task.address && <AddressBadge addresses={task.address} />}
                {task.contacts && <ContactsBadge contacts={task.contacts} />}
            </div>
        );
    };

    // Вынесем рендер кнопки подтверждения для снижения сложности
    const renderDoneButton = () => {
        if (task.status === STATUS.FINISHED) {
            return null;
        }

        if (task.id === 2 && task.proof_status !== 'proofed') {
            return null;
        }

        return (
            <Button className={cn('gap-1', isXsScreen ? 'h-10 py-2' : '')} onClick={markAsDone}>
                <Check className={isXsScreen ? 'h-4 w-4' : ''} />
                {t('task.markAsDone')}
            </Button>
        );
    };

    return (
        <Card
            className={cn('w-full h-[max-content] border shadow-sm', isXsScreen ? 'p-3' : 'p-4', className)}
            {...props}
        >
            <CardContent className={cn('grid gap-2', isXsScreen ? 'mt-2' : 'mt-4')}>
                {task.picked_date && <DateBadge date={task.picked_date} />}
            </CardContent>
            <CardHeader className={cn('mt-[-40px] flex', isXsScreen ? 'p-3' : 'p-5')}>
                <CardTitle className={cn('mb-1', isXsScreen ? 'text-lg' : 'text-xl')}>
                    <LocalizedText text={task.title} />
                </CardTitle>
                <CardDescription
                    className={isXsScreen ? 'text-sm line-clamp-2' : ''}
                    style={{ whiteSpace: 'pre-line' }}
                >
                    <LocalizedText text={task.description} />
                </CardDescription>
            </CardHeader>
            <CardContent className={cn('grid gap-2', isXsScreen ? 'px-3 py-2' : 'p-5')}>
                {renderTaskBadges(task)}
            </CardContent>
            <CardFooter className={cn('gap-2', isXsScreen ? 'px-3 pt-0 pb-3 flex-col items-stretch' : 'flex-row')}>
                <div className={cn('flex items-center justify-between', isXsScreen ? 'w-full' : '')}>
                    <TaskStatus status={task.status} />
                </div>
                {renderDoneButton()}
            </CardFooter>
        </Card>
    );
}
