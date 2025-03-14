'use client';

import { useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { ControllerRenderProps } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LocalizedText } from '@/components/ui/localized-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useApiPost } from '@/hooks/api/use-api-post';
import { useBreakpoint } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { ProofCheck, Task } from '@/types';

interface ProofTaskProps {
    task: Task;
}

// Компонент для рендеринга календаря
const DatePickerField = ({
    field,
    locale,
    isMobile,
    placeholder,
}: {
    field: ControllerRenderProps<Record<string, Date | string | number | undefined>, string>;
    locale: string;
    isMobile: boolean;
    placeholder: string;
}) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                size={isMobile ? 'sm' : 'default'}
                className={cn(
                    'w-full justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground',
                    isMobile ? 'h-10' : '',
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value instanceof Date
                    ? format(field.value, 'PPP', {
                          locale: locale === 'ru' ? ru : enUS,
                      })
                    : placeholder}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start">
            <Calendar
                mode="single"
                selected={field.value instanceof Date ? field.value : undefined}
                onSelect={field.onChange}
                initialFocus
                disabled={date => date < new Date()}
                className="rounded-md border p-3"
                classNames={{
                    months: 'space-y-4 p-0',
                    month: 'space-y-4',
                    caption: 'flex justify-center pt-1 relative items-center',
                    caption_label: 'text-sm font-medium',
                    nav: 'space-x-1 flex items-center',
                    nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                    nav_button_previous: 'absolute left-1',
                    nav_button_next: 'absolute right-1',
                    table: 'w-full border-collapse space-y-1',
                    head_row: 'flex',
                    head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                    row: 'flex w-full mt-2',
                    cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                    day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
                    day_selected:
                        'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                    day_today: 'bg-accent text-accent-foreground',
                    day_outside: 'text-muted-foreground opacity-50',
                    day_disabled: 'text-muted-foreground opacity-50',
                    day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                    day_hidden: 'invisible',
                }}
            />
        </PopoverContent>
    </Popover>
);

export function ProofTask({ task }: ProofTaskProps) {
    const t = useTranslations();
    const tOnboarding = useTranslations('onboarding');
    const locale = useLocale();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [proofStatus, setProofStatus] = useState(task.proof_status);
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'xs' || breakpoint === 'sm';

    // Вынесем логику валидации в отдельную функцию для упрощения
    const buildFormSchema = () => {
        const obj = task.proof?.checks.reduce(
            (acc, check) => {
                if (check.type === 'date') {
                    acc[check.name] = z.date({
                        required_error: tOnboarding('arrivalDate.required'),
                    });
                } else if (check.type === 'number') {
                    acc[check.name] = z.number().optional();
                } else {
                    acc[check.name] = z.string();
                }
                return acc;
            },
            {} as Record<string, z.ZodType>,
        );

        if (!obj) {
            throw new Error(t('errors.validation'));
        }

        return z.object(obj);
    };

    const createDefaultValues = () => {
        return task.proof?.checks.reduce(
            (acc, check) => {
                if (check.type === 'date') {
                    acc[check.name] = undefined;
                } else if (check.type === 'number') {
                    acc[check.name] = '';
                } else {
                    acc[check.name] = '';
                }
                return acc;
            },
            {} as Record<string, string | undefined>,
        );
    };

    const FormSchema = buildFormSchema();
    const defaultValues = createDefaultValues();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: defaultValues,
    });

    const { postData } = useApiPost<unknown>();

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsSubmitting(true);
        try {
            const result = await postData(task.proof?.action || '', {
                ...data,
                taskId: task.id,
            });

            if (result) {
                setProofStatus('proofed');
                task.proof_status = 'proofed';
            }
        } catch (error) {
            console.error('Failed to submit proof:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Функция для рендеринга формы чека в зависимости от типа
    const renderFormField = (check: ProofCheck, index: number) => (
        <FormField
            key={`${check.type}_${check.name}_${index}`}
            control={form.control}
            name={check.name as keyof z.infer<typeof FormSchema>}
            render={({ field }) => (
                <FormItem className={isMobile ? 'space-y-1' : ''}>
                    <FormLabel className={isMobile ? 'text-sm' : ''}>
                        <LocalizedText text={check.title} />
                    </FormLabel>
                    <FormControl>
                        {check.type === 'date' ? (
                            <DatePickerField
                                field={field}
                                locale={locale}
                                isMobile={isMobile}
                                placeholder={tOnboarding('arrivalDate.placeholder')}
                            />
                        ) : (
                            <Input
                                placeholder={check.placeholder}
                                type={check.type}
                                className={isMobile ? 'h-10 text-sm' : ''}
                                {...field}
                                value={field.value || ''}
                            />
                        )}
                    </FormControl>
                    <FormMessage className={isMobile ? 'text-xs' : ''} />
                </FormItem>
            )}
        />
    );

    return (
        <Card className={cn('shadow-sm', isMobile ? 'p-0' : '')}>
            <CardHeader className={isMobile ? 'p-3 pb-1' : ''}>
                <CardTitle className={isMobile ? 'text-lg' : 'text-xl'}>{t('proof.title')}</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? 'p-3 pt-0' : ''}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                        {task.proof?.checks.map((check, i) => renderFormField(check, i))}
                        <div className={isMobile ? 'pt-2' : 'pt-4'}>
                            <Button
                                type="submit"
                                className="w-full sm:w-auto"
                                size={isMobile ? 'sm' : 'default'}
                                disabled={proofStatus !== 'not_proofed' || isSubmitting || !form.formState.isValid}
                            >
                                {isSubmitting ? t('common.loading') : t('proof.submit')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
