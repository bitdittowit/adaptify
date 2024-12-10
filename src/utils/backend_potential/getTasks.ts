import { RawTask, Sex, Status, UserTask, VisaType } from '@/types';

const convertRawToUserTask = (tasks: RawTask[]): UserTask[] => {
  return tasks.map((task) => ({
    ...task,
    status: Status.OPEN,
    picked_date: new Date(),
    experience_points: 200,
  }));
};

export const getTasks = async (
  sex: Sex,
  visaType: VisaType,
): Promise<UserTask[]> => {
  try {
    const { tasks: rawTasks } = await import(`@/app/constants/tasks/user_tasks.json`);

    const tasks = rawTasks.filter((rawTask) =>
      rawTask.tags.includes(sex) &&
      rawTask.tags.includes(visaType));

    return convertRawToUserTask(tasks as RawTask[]);
  } catch (error) {
    console.error("Failed to load task data:", error);
    return [];
  }
};
