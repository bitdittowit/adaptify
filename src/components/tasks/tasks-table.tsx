'use client';

import * as React from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, Search } from 'lucide-react';

import { TaskStatus } from '@/components/tasks/task-status';
import { Button } from '@/components/ui/button';
import { DateBadge } from '@/components/ui/date-badge';
import { Input } from '@/components/ui/input';
import { LocalizedText } from '@/components/ui/localized-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetTasks } from '@/hooks/api/entities/tasks/use-get-tasks';
import { useBreakpoint, useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { LocalizedText as LocalizedTextType, Task } from '@/types';
import { STATUS } from '@/types';

import { TaskCard } from './task-card';

export function TasksTable() {
    const t = useTranslations();
    const isMobile = useIsMobile();
    const breakpoint = useBreakpoint();
    const isSmallerThanSm = breakpoint === 'xs' || breakpoint === 'sm';

    const [search, setSearch] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<STATUS | 'all'>('all');

    const columns: ColumnDef<Task>[] = [
        {
            accessorKey: 'id',
            header: () => t('task.id'),
        },
        {
            accessorKey: 'position',
            header: ({ column }) => {
                return (
                    <div className="flex justify-center max-w-[48px]">
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            <ArrowUpDown />
                        </Button>
                    </div>
                );
            },
            cell: () => <></>,
        },
        {
            accessorKey: 'title',
            header: () => t('task.title'),
            cell: ({ row }) => {
                const title = row.getValue('title') as LocalizedTextType;
                return <LocalizedText text={title} defaultValue={t('task.noTitle')} />;
            },
        },
        {
            accessorKey: 'description',
            header: () => t('task.description'),
            cell: ({ row }) => {
                const description = row.getValue('description') as LocalizedTextType;
                return <LocalizedText text={description} defaultValue={t('task.noDescription')} />;
            },
        },
        {
            accessorKey: 'status',
            header: () => t('task.status'),
            cell: ({ row }) => <TaskStatus status={row.getValue('status')} />,
        },
        {
            accessorKey: 'picked_date',
            header: () => t('task.date'),
            cell: ({ row }) => <DateBadge date={row.getValue('picked_date')} />,
        },
        {
            accessorKey: 'experience_points',
            header: () => <div className="text-right">{t('task.experience')}</div>,
            cell: ({ row }) => {
                const amount = Number.parseFloat(row.getValue('experience_points'));
                return <div className="text-right font-medium">{amount}</div>;
            },
        },
        {
            accessorKey: 'details',
            header: () => <></>,
            cell: ({ row }) => (
                <Button variant="outline">
                    <Link href={`/tasks/id/${row.getValue('id')}`}>{t('task.details')}</Link>
                </Button>
            ),
        },
    ];

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const { data, loading } = useGetTasks();

    // Настраиваем видимость колонок на разных устройствах
    React.useEffect(() => {
        if (isMobile) {
            // На мобильных устройствах скрываем менее важные колонки
            setColumnVisibility({
                id: false,
                position: false,
                description: !isSmallerThanSm, // Скрываем описание на очень маленьких экранах
            });
        } else {
            // На десктопе показываем все колонки кроме id
            setColumnVisibility({
                id: false,
            });
        }
    }, [isMobile, isSmallerThanSm]);

    // Фильтруем задачи по поиску и статусу
    const filteredData = React.useMemo(() => {
        if (!data) {
            return [];
        }

        return data.filter(task => {
            const matchesSearch =
                search === '' ||
                task.title.ru.toLowerCase().includes(search.toLowerCase()) ||
                task.description.ru.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [data, search, statusFilter]);

    const table = useReactTable({
        data: filteredData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });

    if (loading) {
        return <div>{t('common.loading')}</div>;
    }

    const renderFilters = () => (
        <div className={cn('flex gap-2', isSmallerThanSm ? 'flex-col' : 'items-center')}>
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t('task.search')}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8"
                />
            </div>
            <Select value={statusFilter} onValueChange={value => setStatusFilter(value as STATUS | 'all')}>
                <SelectTrigger className={cn('w-[180px]', isSmallerThanSm && 'w-full')}>
                    <SelectValue placeholder={t('task.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{t('task.status.all')}</SelectItem>
                    <SelectItem value={STATUS.OPEN}>{t('task.status.open')}</SelectItem>
                    <SelectItem value={STATUS.PENDING}>{t('task.status.pending')}</SelectItem>
                    <SelectItem value={STATUS.FINISHED}>{t('task.status.finished')}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    // Показываем карточки вместо таблицы на мобильных устройствах
    if (isSmallerThanSm) {
        return (
            <div className="w-full">
                <div className="py-4">{renderFilters()}</div>
                <div className="space-y-4">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map(row => <TaskCard key={row.getValue('id')} task={row.original} />)
                    ) : (
                        <div className="text-center py-10">{t('task.noResults')}</div>
                    )}
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {t('pagination.previous')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            {t('pagination.next')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Таблица для больших экранов
    return (
        <div className="w-full">
            <div className="py-4">{renderFilters()}</div>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id} className="first:sticky first:left-0 first:w-10">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} className="last:sticky last:right-0 last:w-10">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {t('task.noResults')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {t('pagination.previous')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {t('pagination.next')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
