'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useApiPost } from '@/hooks/api/use-api-post';
import type { Task } from '@/types';

interface ProofTaskProps {
    task: Task;
}

export function ProofTask({ task }: ProofTaskProps) {
    const createFormSchema = (task: Task) => {
        const obj = task.proof?.checks.reduce(
            (acc, check) => ({
                ...acc,
                [check.name]: z.string(),
            }),
            {},
        );

        if (!obj) {
            throw new Error('ты что творишь!?');
        }

        return z.object(obj);
    };
    const createDefaultValues = (task: Task) => {
        return task.proof?.checks.reduce(
            (acc, check) => ({
                ...acc,
                [check.name]: '',
            }),
            {},
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
        const result = await postData(task.proof?.action || '', {
            ...data,
            taskId: task.id,
        });

        if (result) {
            // todo change to toast.
            console.log(result);
            task.proof_status = 'proofed';
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
                        // @ts-expect-error я так решил
                        name={check.name}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{check.title}</FormLabel>
                                <FormControl>
                                    <Input placeholder={check.placeholder} type={check.type} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                <Button type="submit" disabled={task.proof_status !== 'not_proofed'}>
                    Проверить
                </Button>
            </form>
        </Form>
    );
}
