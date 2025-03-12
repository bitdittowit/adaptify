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
import { cn } from '@/lib/utils';
import { STATUS, type Task } from '@/types';

type TaskCardProps = ComponentProps<typeof Card> & { task: Task };

export function TaskCard({ className, task, ...props }: TaskCardProps) {
    const t = useTranslations();
    const { postData } = useApiPost<{ id: number }>();

    const markAsDone = async () => {
        const data = { id: task.id };
        const result = await postData('/api/tasks/finish', data);
        if (result) {
            task.status = STATUS.FINISHED;
        }
    };

    const renderTaskBadges = (task: Task) => {
        return (
            <>
                {task.documents && <DocumentsBadge documents={task.documents} />}
                {task.schedule && <ScheduleBadge schedule={task.schedule} />}
                {task.address && <AddressBadge addresses={task.address} />}
                {task.contacts && <ContactsBadge contacts={task.contacts} />}
            </>
        );
    };

    return (
        <Card className={cn('w-[380px] h-[max-content]', className)} {...props}>
            <CardContent className="grid gap-4 mt-4">
                {task.picked_date && <DateBadge date={task.picked_date} />}
            </CardContent>
            <CardHeader className="mt-[-40px] flex">
                <CardTitle className="mb-1">
                    <LocalizedText text={task.title} />
                </CardTitle>
                <CardDescription style={{ whiteSpace: 'pre-line' }}>
                    <LocalizedText text={task.description} />
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">{renderTaskBadges(task)}</CardContent>
            <CardFooter className="gap-4">
                <TaskStatus status={task.status} />
                {task.status !== STATUS.FINISHED &&
                    (task.id === 2 ? (
                        task.proof_status === 'proofed' && (
                            <Button className="w-full" onClick={markAsDone}>
                                <Check /> {t('task.markAsDone')}
                            </Button>
                        )
                    ) : (
                        <Button className="w-full" onClick={markAsDone}>
                            <Check /> {t('task.markAsDone')}
                        </Button>
                    ))}
            </CardFooter>
        </Card>
    );
}
