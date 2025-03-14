'use client';

import { useTranslations } from 'next-intl';

import { TaskPreviewCard } from '@/components/tasks/task-preview-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetTasks } from '@/hooks/api/entities/tasks/use-get-tasks';
import { useBreakpoint } from '@/hooks/use-mobile';

export default function Page() {
    const t = useTranslations();
    const { data, loading } = useGetTasks();
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'xs' || breakpoint === 'sm';

    if (loading) {
        return (
            <div className="w-full max-w-5xl mx-auto px-2 py-4 md:py-6">
                <Card className="bg-card shadow-sm border">
                    <CardHeader className="pb-0">
                        <CardTitle className="text-xl md:text-2xl text-center md:text-left">
                            {t('sidebar.taskList')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center p-8 animate-pulse">{t('common.loading')}</div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full max-w-5xl mx-auto px-2 py-4 md:py-6">
                <Card className="bg-card shadow-sm border">
                    <CardHeader className="pb-0">
                        <CardTitle className="text-xl md:text-2xl text-center md:text-left">
                            {t('sidebar.taskList')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center p-8 text-muted-foreground">{t('task.noTasks')}</div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-2 py-4 md:py-6">
            <Card className="bg-card shadow-sm border">
                <CardHeader className="pb-0">
                    <CardTitle className="text-xl md:text-2xl text-center md:text-left">
                        {t('sidebar.taskList')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={`grid gap-4 py-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {data.map((task, index) => (
                            <div key={task.id} className="flex items-start gap-2">
                                <div className="hidden md:block shrink-0">
                                    <span className="mt-1 bg-primary rounded w-10 h-10 grid place-items-center text-primary-foreground">
                                        {index + 1}
                                    </span>
                                </div>
                                <TaskPreviewCard task={task} />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
