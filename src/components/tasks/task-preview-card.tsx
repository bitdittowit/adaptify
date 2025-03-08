import type { ComponentProps } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DateBadge } from '@/components/ui/date-badge';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

type TaskPreviewCardProps = ComponentProps<typeof Card> & { task: Task };

export function TaskPreviewCard({ className, task, ...props }: TaskPreviewCardProps) {
    const t = useTranslations('task');

    return (
        <Card className={cn('max-w-[380px] h-[max-content] min-h-[200px] grid', className)} {...props}>
            {task.picked_date && (
                <CardContent className="grid gap-4 mt-4">{<DateBadge date={task.picked_date} />}</CardContent>
            )}
            <CardHeader className="flex">
                <CardTitle className="mb-1">{task.title}</CardTitle>
            </CardHeader>
            <CardFooter className="gap-4 self-end flex justify-end">
                <div className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded cursor-default pointer-events-none">
                    {task.experience_points}
                </div>
                <Link
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[120px]"
                    href={`/tasks/id/${task.id}`}
                >
                    {t('details')}
                </Link>
            </CardFooter>
        </Card>
    );
}
