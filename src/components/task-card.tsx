import type { ComponentProps } from 'react';

import { Check } from 'lucide-react';

import { TaskStatus } from '@/components/task-status';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DateBadge } from '@/components/ui/date-badge';
import { ScheduleBadge } from '@/components/ui/schedule-badge';
import { useApiPost } from '@/hooks/api/useApiPost';
import { cn } from '@/lib/utils';
import { STATUS, type Task } from '@/types';

type TaskCardProps = ComponentProps<typeof Card> & { task: Task };

export function TaskCard({ className, task, ...props }: TaskCardProps) {
    const { postData } = useApiPost<{ id: number }>();

    const markAsDone = async () => {
        const data = { id: task.id };
        const result = await postData('/api/tasks/finish', data);
        if (result) {
            console.log('User experience updated:', result);
            task.status = STATUS.FINISHED;
        }
    };

    return (
        <Card className={cn('w-[380px] h-[max-content]', className)} {...props}>
            <CardContent className="grid gap-4 mt-4">
                {task.picked_date && <DateBadge date={task.picked_date} />}
            </CardContent>
            <CardHeader className="mt-[-40px] flex">
                <CardTitle className="mb-1">{task.title}</CardTitle>
                <CardDescription style={{ whiteSpace: 'pre-line' }}>{task.description}</CardDescription>
            </CardHeader>
            <CardContent>{task.schedule && <ScheduleBadge schedule={task.schedule} />}</CardContent>
            <CardFooter className="gap-4">
                <TaskStatus status={task.status} />
                {task.status !== STATUS.FINISHED && (
                    <Button className="w-full" onClick={markAsDone}>
                        <Check /> Mark as done
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
