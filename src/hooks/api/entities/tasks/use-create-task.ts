import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema for localized text (used in title and description)
export const localizedTextSchema = z.object({
  ru: z.string().min(1, { message: 'Russian text is required' }),
  en: z.string().optional(),
});

// Main task schema for validation
export const taskSchema = z.object({
  title: localizedTextSchema,
  description: localizedTextSchema,
  required: z.boolean().default(false),
  blocks: z.array(z.number()).default([]),
  blocked_by: z.array(z.number()).default([]),
  tags: z.array(z.string()).default([]),
  priority: z.number().min(1).max(5).default(3),
  deadline_days: z.number().nullable().default(null),
  duration_minutes: z.number().min(1).default(60),
  schedule: z.any().nullable().default(null), // For simplicity, we'll accept any schedule format
});

// Type for the task input
export type TaskFormInput = z.infer<typeof taskSchema>;

interface UseCreateTaskReturn {
  createTask: (data: TaskFormInput) => Promise<number | null>;
  loading: boolean;
  error: Error | null;
}

export function useCreateTask(): UseCreateTaskReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTask = async (data: TaskFormInput): Promise<number | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      const result = await response.json();
      toast.success('Task created successfully');
      
      return result.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast.error(`Failed to create task: ${errorMessage}`);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTask, loading, error };
} 