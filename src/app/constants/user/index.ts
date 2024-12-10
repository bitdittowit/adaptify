import { User } from '@/types';
import { getTasks } from '@/utils/backend_potential/getTasks';
import { getCountryVisaType } from '@/utils/backend_potential/getCountryVisaType';

const DEFAULT_USER: User = {
  id: 1,
  name: 'John Doe',
  arrival_date: null,
  sex: 'male',
  country: 'kz',
  study_group: 'КИ21-22Б',
  experience: 0,
  level: 0,
  tasks: [],
};

export const getDefaultUser = async (): Promise<User> => {
  const tasks = await getTasks(
    DEFAULT_USER.sex,
    getCountryVisaType(DEFAULT_USER.country),
  );

  DEFAULT_USER.tasks = tasks;

  return DEFAULT_USER;
};
