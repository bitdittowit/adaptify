import { type BaseTask, STATUS, type Sex, type Task, type VisaType } from '@/types';

import getNextAvailableDate from './get-next-available-date';

const convertRawToUserTask = (tasks: BaseTask[]): Task[] => {
    return tasks.map(task => ({
        ...task,
        status: STATUS.OPEN,
        picked_date: task.schedule ? getNextAvailableDate(task.schedule, new Date()) : new Date(),
        experience_points: 200,
        proof_status: 'not_proofed',
        available: false,
    }));
};

export const getTasks = async (sex: Sex, visaType: VisaType): Promise<Task[]> => {
    try {
        const { tasks: documentTasks } = await import('@/constants/tasks/user_tasks.json');

        const tasks = documentTasks.filter(
            documentTask => documentTask.tags.includes(sex) && documentTask.tags.includes(visaType),
        );

        return convertRawToUserTask(tasks as BaseTask[]);
    } catch (error) {
        console.error('Failed to load task data:', error);
        return [];
    }
};
