import type { BaseTask } from '@/types';
import updateTaskDependencies from '@/utils/backend_potential/updateTaskDependencies';

const preprocessTasks = (rawTasks: BaseTask[]): BaseTask[] => {
    return updateTaskDependencies(rawTasks);
};

export default preprocessTasks;
