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
import { ArrowUpDown } from 'lucide-react';

import { TaskStatus } from '@/components/tasks/task-status';
import { Button } from '@/components/ui/button';
import { DateBadge } from '@/components/ui/date-badge';
import { Input } from '@/components/ui/input';
import { LocalizedText } from '@/components/ui/localized-text';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetTasks } from '@/hooks/api/entities/tasks/use-get-tasks';
import type { LocalizedText as LocalizedTextType, Task } from '@/types';

export function TasksTable() {
    const t = useTranslations();

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

    const table = useReactTable({
        data,
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
            columnVisibility: { ...columnVisibility, id: false },
        },
    });

    if (loading) {
        return <div>{t('common.loading')}</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center py-4 justify-end">
                <Input
                    placeholder={t('input.filter')}
                    value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                    onChange={event => table.getColumn('title')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border overflow-x-auto" style={{ maxWidth: 'calc(100vw - 40px)' }}>
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
