import { type BaseTask, type ProofStatus, STATUS, type Sex, type Task, type VisaType } from '@/types';

import { scheduleTasks } from '../task-scheduler';

const convertRawToUserTask = (tasks: BaseTask[], arrivalDate: Date): Task[] => {
    const baseTasks = tasks.map(task => ({
        ...task,
        status: STATUS.OPEN,
        experience_points: 200,
        proof_status: 'not_proofed' as ProofStatus,
        available: false,
        picked_date: new Date(0), // Will be set by scheduler
        priority: 3, // Default priority
        deadline_days: null,
        duration_minutes: 60, // Default duration
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
