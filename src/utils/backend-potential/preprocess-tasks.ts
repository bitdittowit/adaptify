import type { BaseTask } from '@/types';
import updateTaskDependencies from '@/utils/backend-potential/update-task-dependencies';

const preprocessTasks = (rawTasks: BaseTask[]): BaseTask[] => {
    return updateTaskDependencies(rawTasks);
};

export default preprocessTasks;
