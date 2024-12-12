import { BaseTask, Sex, Status, Task, VisaType } from '@/types';
import getNextAvailableDate from './getNextAvailableDate';

const convertRawToUserTask = (tasks: BaseTask[]): Task[] => {
  return tasks.map((task) => ({
    ...task,
    status: Status.OPEN,
    picked_date: task.schedule ?
        getNextAvailableDate(task.schedule, new Date()) :
        new Date(),
    experience_points: 200,
    proof_status: 'not_proofed',
  }));
};

export const getTasks = async (
  sex: Sex,
  visaType: VisaType,
): Promise<Task[]> => {
  try {
    const { tasks: documentTasks } =
        await import(`@/app/constants/tasks/user_tasks.json`);

    const tasks = documentTasks.filter((documentTask) =>
      documentTask.tags.includes(sex) &&
      documentTask.tags.includes(visaType));

    return convertRawToUserTask(tasks as BaseTask[]);
  } catch (error) {
    console.error("Failed to load task data:", error);
    return [];
  }
};
