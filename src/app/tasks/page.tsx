'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Search } from 'lucide-react';

import { TaskPreviewCard } from '@/components/tasks/task-preview-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetTasks } from '@/hooks/api/entities/tasks/use-get-tasks';
import { useBreakpoint } from '@/hooks/use-mobile';
import { STATUS } from '@/types';

const STATUSES = [STATUS.OPEN, STATUS.PENDING, STATUS.FINISHED] as const;

export default function Page() {
    const t = useTranslations();
    const { data, loading } = useGetTasks();
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'xs' || breakpoint === 'sm';

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<(typeof STATUSES)[number] | 'all'>('all');

    const filteredTasks = data?.filter(task => {
        const matchesSearch =
            search.toLowerCase() === '' ||
            task.title.ru.toLowerCase().includes(search.toLowerCase()) ||
            task.description.ru.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

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
                    <div className="flex flex-col md:flex-row gap-4 py-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t('task.search')}
                                className="pl-8"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={(value: (typeof STATUSES)[number] | 'all') => setStatusFilter(value)}
                        >
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder={t('task.filterByStatus')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('task.status.all')}</SelectItem>
                                {STATUSES.map(status => (
                                    <SelectItem key={status} value={status}>
                                        {t(`task.status.${status}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className={`grid gap-4 py-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {filteredTasks?.map((task, index) => (
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

                    {filteredTasks?.length === 0 && (
                        <div className="flex justify-center p-8 text-muted-foreground">{t('task.noResults')}</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
