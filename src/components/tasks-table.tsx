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

import { Button } from '@/components/ui/button';
import { DateBadge } from '@/components/ui/date-badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetTasks } from '@/hooks/api/entities/tasks/useGetTasks';
import type { Task } from '@/types';

export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: 'id',
        header: () => <div className="text-center">id</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue('id')}</div>,
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
        header: 'Title',
        cell: ({ row }) => <div>{row.getValue('title')}</div>,
    },
    {
        accessorKey: 'picked_date',
        header: 'Date',
        cell: ({ row }) => {
            const date: string | Date = row.getValue('picked_date');

            if (!date) {
                return <></>;
            }

            return <DateBadge date={date} />;
        },
    },
    {
        accessorKey: 'experience_points',
        header: () => <div className="text-right">Experience</div>,
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
                <Link href={`/tasks/id/${row.getValue('id')}`}>Details</Link>
            </Button>
        ),
    },
];

export function TasksTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const { data, loading } = useGetTasks();
    const t = useTranslations('input');

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
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center py-4 justify-end">
                <Input
                    placeholder={t('filter')}
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
                                    No results.
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
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
