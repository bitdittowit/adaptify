import { User } from '@/types';
import { generateTasks } from '@/utils/generateTasks';
import { getCountryVisaType } from '@/utils/getCountryVisaType';

const DEFAULT_USER: User = {
  id: 1,
  name: 'John Doe',
  arrival_date: new Date(),
  sex: 'male',
  country: 'kz',
  study_group: 'КИ21-22Б',
  experience: 0,
  level: 0,
  tasks: [],
};

export const getDefaultUser = async (): Promise<User> => {
  const tasks = await generateTasks(
    DEFAULT_USER.sex,
    getCountryVisaType(DEFAULT_USER.country),
  );

  DEFAULT_USER.tasks = tasks;

  return DEFAULT_USER;
};
