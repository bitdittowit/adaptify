'use client';

import { useEffect, useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    type ColumnDef,
    type ColumnFiltersState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from '@tanstack/react-table';
import Fuse from 'fuse.js';
import { AlertCircle, RefreshCw, SlidersHorizontal, XIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { LocalizedText } from '@/components/ui/localized-text';
import { Toaster } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetAdminTasks } from '@/hooks/api/entities/tasks/use-get-admin-tasks';
import type { BaseTask } from '@/types';

import { CreateTaskDialog } from './CreateTaskDialog';

// Extend BaseTask to include the assigned_count property from our API
interface AdminTask extends BaseTask {
    assigned_count: number;
}

export function TaskManagement() {
    const t = useTranslations('admin.tasks');
    const { data: tasks, loading, error, refetch } = useGetAdminTasks();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        // Default visible columns
        id: true,
        title: true,
        position: true,
        required: true,
        priority: false,
        duration_minutes: true,
        assigned_count: true,
        // Default hidden columns
        description: false,
        blocks: false,
        blocked_by: false,
        tags: false,
        deadline_days: false,
    });

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState<AdminTask[]>([]);

    useEffect(() => {
        if (!tasks) {
            return;
        }

        // Only filter when search query is at least as long as minMatchCharLength
        if (searchQuery.trim().length < 3) {
            setFilteredData(tasks);
            return;
        }

        const fuse = new Fuse(tasks, {
            keys: [
                {
                    name: 'title.ru',
                    getFn: (obj: AdminTask) => obj.title?.ru || '',
                    weight: 1,
                },
                {
                    name: 'description.ru',
                    getFn: (obj: AdminTask) => obj.description?.ru || '',
                    weight: 1,
                },
                {
                    name: 'title.en',
                    getFn: (obj: AdminTask) => obj.title?.en || '',
                    weight: 1,
                },
                {
                    name: 'description.en',
                    getFn: (obj: AdminTask) => obj.description?.en || '',
                    weight: 1,
                },
                { name: 'id', getFn: (obj: AdminTask) => String(obj.id), weight: 1 },
            ],
            threshold: 0.4,
            ignoreLocation: true,
            findAllMatches: true,
            minMatchCharLength: 3,
            includeScore: true,
        });

        const results = fuse.search(searchQuery);
        console.log(results);
        setFilteredData(results.map(result => result.item));
    }, [searchQuery, tasks]);

    // Define table columns
    const columns = useMemo<ColumnDef<AdminTask>[]>(
        () => [
            { accessorKey: 'id', header: () => t('table.id'), size: 50 },
            {
                accessorKey: 'title',
                header: () => t('table.title'),
                size: 200,
                cell: ({ row }) => (
                    <div className="font-medium">
                        <LocalizedText text={row.original.title} />
                    </div>
                ),
            },
            {
                accessorKey: 'description',
                header: () => t('table.description'),
                cell: ({ row }) => (
                    <div className="max-h-[100px] overflow-y-auto pr-2">
                        <LocalizedText text={row.original.description} />
                    </div>
                ),
            },
            {
                accessorKey: 'position',
                header: () => <div className="text-center">{t('table.position')}</div>,
                cell: ({ row }) => <div className="text-center">{row.original.position}</div>,
                size: 80,
            },
            {
                accessorKey: 'required',
                header: () => <div className="text-center">{t('table.required')}</div>,
                cell: ({ row }) => (
                    <div className="text-center">{row.original.required ? t('required.yes') : t('required.no')}</div>
                ),
                size: 80,
            },
            {
                accessorKey: 'priority',
                header: () => <div className="text-center">{t('table.priority')}</div>,
                cell: ({ row }) => <div className="text-center">{row.original.priority}</div>,
                size: 80,
            },
            {
                accessorKey: 'duration_minutes',
                header: () => <div className="text-center">{t('table.duration_minutes')}</div>,
                cell: ({ row }) => (
                    <div className="text-center">
                        {row.original.duration_minutes} {t('table.minutes')}
                    </div>
                ),
                size: 100,
            },
            {
                accessorKey: 'deadline_days',
                header: () => <div className="text-center">{t('table.deadline_days')}</div>,
                cell: ({ row }) => (
                    <div className="text-center">
                        {row.original.deadline_days !== null
                            ? t('table.daysAfterArrival', {
                                  days: row.original.deadline_days,
                              })
                            : t('table.noDeadline')}
                    </div>
                ),
                size: 120,
            },
            {
                accessorKey: 'blocks',
                header: () => <div className="text-center">{t('table.blocks')}</div>,
                cell: ({ row }) => (
                    <div className="text-center">
                        {row.original.blocks && row.original.blocks.length > 0 ? (
                            <Badge variant="outline">{row.original.blocks.length}</Badge>
                        ) : (
                            '-'
                        )}
                    </div>
                ),
                size: 80,
            },
            {
                accessorKey: 'blocked_by',
                header: () => <div className="text-center">{t('table.blocked_by')}</div>,
                cell: ({ row }) => (
                    <div className="text-center">
                        {row.original.blocked_by && row.original.blocked_by.length > 0 ? (
                            <Badge variant="outline">{row.original.blocked_by.length}</Badge>
                        ) : (
                            '-'
                        )}
                    </div>
                ),
                size: 80,
            },
            {
                accessorKey: 'tags',
                header: () => <div className="text-center">{t('table.tags')}</div>,
                cell: ({ row }) => (
                    <div className="flex flex-wrap justify-center gap-1">
                        {row.original.tags?.map((tag, i) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                ),
            },
            {
                accessorKey: 'assigned_count',
                header: () => <div className="text-center">{t('table.assigned_count')}</div>,
                cell: ({ row }) => (
                    <div className="text-center">
                        <Badge variant="secondary">{row.original.assigned_count}</Badge>
                    </div>
                ),
                size: 100,
            },
        ],
        [t],
    );

    // Initialize the table
    const table = useReactTable({
        data: filteredData,
        columns,
        state: { columnFilters, columnVisibility },
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
    });

    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('title')}</CardTitle>
                    <CardDescription>{t('description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-48">
                        <div className="animate-pulse">{t('loading')}</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('title')}</CardTitle>
                    <CardDescription>{t('error')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 border border-red-200 rounded-md bg-red-50 mb-4">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                        <p className="text-red-700">{error.message}</p>
                    </div>
                    <Button onClick={refetch} className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" /> {t('tryAgain')}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('title')}</CardTitle>
                        <CardDescription>{t('description')}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreateTaskDialog onTaskCreated={refetch} />

                        <Button variant="outline" size="sm" onClick={refetch}>
                            <RefreshCw className="h-4 w-4 mr-2" /> {t('refresh')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Input
                                    placeholder={t('search')}
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full"
                                />
                                {searchQuery && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        <XIcon className="h-4 w-4" />
                                        <span className="sr-only">{t('clearSearch')}</span>
                                    </Button>
                                )}
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="ml-auto">
                                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                                        {t('columns')}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t('selectColumns')}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {table
                                        .getAllColumns()
                                        .filter(column => column.getCanHide())
                                        .map(column => {
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={value => column.toggleVisibility(!!value)}
                                                >
                                                    {t(`table.${column.id}`)}
                                                </DropdownMenuCheckboxItem>
                                            );
                                        })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {filteredData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <AlertCircle className="h-12 w-12 text-muted-foreground/80" />
                                <h3 className="mt-4 text-lg font-medium">{t('noSearchResults')}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{t('noSearchResultsDescription')}</p>
                            </div>
                        ) : (
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(header => (
                                                    <TableHead
                                                        key={header.id}
                                                        style={{
                                                            width:
                                                                header.getSize() !== 150 ? header.getSize() : undefined,
                                                        }}
                                                    >
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                  header.column.columnDef.header,
                                                                  header.getContext(),
                                                              )}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows?.length ? (
                                            table.getRowModel().rows.map(row => (
                                                <TableRow key={row.id}>
                                                    {row.getVisibleCells().map(cell => (
                                                        <TableCell key={cell.id}>
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                                    {t('noResults')}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
