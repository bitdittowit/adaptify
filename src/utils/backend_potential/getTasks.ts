import { DocumentTask, Sex, Status, UserTask, VisaType } from '@/types';

const convertRawToUserTask = (tasks: DocumentTask[]): UserTask[] => {
  const preferDate = new Date();

  return tasks.map((task) => ({
    ...task,
    status: Status.OPEN,
    picked_date: preferDate,
    experience_points: 200,
  }));
};

export const getTasks = async (
  sex: Sex,
  visaType: VisaType,
): Promise<UserTask[]> => {
  try {
    const { tasks: documentTasks } =
        await import(`@/app/constants/tasks/user_tasks.json`);

    const tasks = documentTasks.filter((documentTask) =>
      documentTask.tags.includes(sex) &&
      documentTask.tags.includes(visaType));

    return convertRawToUserTask(tasks as DocumentTask[]);
  } catch (error) {
    console.error("Failed to load task data:", error);
    return [];
  }
};
