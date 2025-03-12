import type { BaseTask, ProofStatus, STATUS, Sex, Task, VisaType } from '@/types';
import { scheduleTasks } from '@/utils/task-scheduler';

const convertRawToUserTask = (tasks: BaseTask[], arrivalDate: Date): Task[] => {
    const baseTasks = tasks.map((task, index) => ({
        ...task,
        user_task_id: index + 1,
        picked_date: arrivalDate,
        available: true,
        status: 'not_started' as STATUS,
        proof_status: 'not_proofed' as ProofStatus,
        experience_points: 200,
        priority: 3,
        deadline_days: null,
        duration_minutes: 60,
    }));

    return scheduleTasks(baseTasks, arrivalDate);
};

export const getTasks = async (sex: Sex, visaType: VisaType, arrivalDate: Date): Promise<Task[]> => {
    try {
        const { tasks: documentTasks } = await import('@/constants/tasks/user_tasks.json');

        const tasks = (documentTasks as unknown as BaseTask[]).filter(
            documentTask => documentTask.tags.includes(sex) && documentTask.tags.includes(visaType),
        );

        return convertRawToUserTask(tasks, arrivalDate);
    } catch (error) {
        console.error('Failed to load task data:', error);
        return [];
    }
};
