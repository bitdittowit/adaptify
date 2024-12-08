import { RawTask, Sex, Status, UserTask, VisaType } from '@/types';

const convertRawToUserTask = (tasks: RawTask[]): UserTask[] => {
  return tasks.map((task) => ({
    ...task,
    status: Status.OPEN,
    picked_date: new Date(),
    experience_points: 200,
  }));
};

export const generateTasks = async (
  sex: Sex,
  visaType: VisaType,
): Promise<UserTask[]> => {
  try {
    const fileName = `${sex}_${visaType}`;
    const { tasks } = await import(`@/app/constants/tasks/${fileName}.json`);

    return convertRawToUserTask(tasks);
  } catch (error) {
    console.error("Failed to load task data:", error);
    return [];
  }
};
