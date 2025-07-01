'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { type TaskFormInput, taskSchema, useCreateTask } from '@/hooks/api/entities/tasks/use-create-task';

interface CreateTaskDialogProps {
    onTaskCreated: () => void;
}

export function CreateTaskDialog({ onTaskCreated }: CreateTaskDialogProps) {
    const t = useTranslations('admin.tasks');
    const [open, setOpen] = useState(false);
    const { createTask, loading } = useCreateTask();

    const form = useForm<TaskFormInput>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: { ru: '', en: '' },
            description: { ru: '', en: '' },
            required: false,
            blocks: [],
            blocked_by: [],
            tags: [],
            priority: 3,
            deadline_days: null,
            duration_minutes: 60,
            schedule: null,
        },
    });

    const onSubmit = async (data: TaskFormInput) => {
        const taskId = await createTask(data);
        if (taskId) {
            setOpen(false);
            form.reset();
            onTaskCreated();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('createTask')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>{t('createTask')}</DialogTitle>
                    <DialogDescription>{t('createTaskDescription')}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(90vh-160px)]">
                    <div className="px-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    {/* Title Fields */}
                                    <div className="space-y-4">
                                        <h3 className="font-medium">{t('form.title')}</h3>
                                        <FormField
                                            control={form.control}
                                            name="title.ru"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('form.titleRu')}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={t('form.titleRuPlaceholder')} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="title.en"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('form.titleEn')}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={t('form.titleEnPlaceholder')} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Separator />

                                    {/* Description Fields */}
                                    <div className="space-y-4">
                                        <h3 className="font-medium">{t('form.description')}</h3>
                                        <FormField
                                            control={form.control}
                                            name="description.ru"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('form.descriptionRu')}</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder={t('form.descriptionRuPlaceholder')}
                                                            className="min-h-[100px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="description.en"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('form.descriptionEn')}</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder={t('form.descriptionEnPlaceholder')}
                                                            className="min-h-[100px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Separator />

                                    {/* Required Field */}
                                    <FormField
                                        control={form.control}
                                        name="required"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>{t('form.required')}</FormLabel>
                                                    <FormDescription>{t('form.requiredDescription')}</FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Priority Field */}
                                    <FormField
                                        control={form.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('form.priority')}</FormLabel>
                                                <div className="space-y-1">
                                                    <div className="pt-2">
                                                        <Slider
                                                            min={1}
                                                            max={5}
                                                            step={1}
                                                            defaultValue={[field.value]}
                                                            onValueChange={value => field.onChange(value[0])}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>{t('form.priorityLow')}</span>
                                                        <span>{t('form.priorityMedium')}</span>
                                                        <span>{t('form.priorityHigh')}</span>
                                                    </div>
                                                    <FormDescription>{t('form.priorityDescription')}</FormDescription>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Duration Field */}
                                    <FormField
                                        control={form.control}
                                        name="duration_minutes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('form.duration')}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        {...field}
                                                        onChange={e => field.onChange(Number.parseInt(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormDescription>{t('form.durationDescription')}</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Deadline Days Field */}
                                    <FormField
                                        control={form.control}
                                        name="deadline_days"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('form.deadline')}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        placeholder={t('form.deadlinePlaceholder')}
                                                        value={field.value === null ? '' : field.value}
                                                        onChange={e => {
                                                            const value =
                                                                e.target.value === ''
                                                                    ? null
                                                                    : Number.parseInt(e.target.value);
                                                            field.onChange(value);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription>{t('form.deadlineDescription')}</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </form>
                        </Form>
                    </div>
                </ScrollArea>
                <DialogFooter className="px-6 py-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        {t('cancel')}
                    </Button>
                    <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={loading}>
                        {loading ? t('creating') : t('create')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
