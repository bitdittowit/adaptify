'use client';

import { useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LocalizedText } from '@/components/ui/localized-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useApiPost } from '@/hooks/api/use-api-post';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

interface ProofTaskProps {
    task: Task;
}

export function ProofTask({ task }: ProofTaskProps) {
    const t = useTranslations();
    const tOnboarding = useTranslations('onboarding');
    const locale = useLocale();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [proofStatus, setProofStatus] = useState(task.proof_status);

    const createFormSchema = (task: Task) => {
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

    const createDefaultValues = (task: Task) => {
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

    const FormSchema = createFormSchema(task);
    const defaultValues = createDefaultValues(task);

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

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full h-[max-content] space-y-6 bg-card shadow-md rounded-lg p-6"
            >
                {task.proof?.checks.map((check, i) => (
                    <FormField
                        key={`${check.type}_${check.name}_${i}`}
                        control={form.control}
                        name={check.name as keyof z.infer<typeof FormSchema>}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <LocalizedText text={check.title} />
                                </FormLabel>
                                <FormControl>
                                    {check.type === 'date' ? (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value instanceof Date
                                                        ? format(field.value, 'PPP', {
                                                              locale: locale === 'ru' ? ru : enUS,
                                                          })
                                                        : tOnboarding('arrivalDate.placeholder')}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value instanceof Date ? field.value : undefined}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                    disabled={date => date < new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        <Input
                                            placeholder={check.placeholder}
                                            type={check.type}
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                <Button
                    type="submit"
                    disabled={proofStatus !== 'not_proofed' || isSubmitting || !form.formState.isValid}
                >
                    {isSubmitting ? t('common.loading') : t('proof.submit')}
                </Button>
            </form>
        </Form>
    );
}
