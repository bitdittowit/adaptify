import { isSameDay } from 'date-fns';

import type { Task } from '@/types';

export const getRandomInRange = (min: number, max: number) => {
    if (min > max) {
        //biome-ignore lint/style/noParameterAssign: why not
        [min, max] = [max, min];
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomDateInMonth = (year = new Date().getFullYear(), month = new Date().getMonth()) => {
    if (month < 0 || month > 11) {
        //biome-ignore lint/style/noParameterAssign: temp util func
        month = new Date().getMonth();
    }

    const endDate = new Date(year, month + 1, 0);
    const randomDay = Math.floor(Math.random() * endDate.getDate()) + 1;
    return new Date(year, month, randomDay);
};

export const getTasksForDay = (tasks: Task[], day: Date) => {
    return tasks.filter(({ picked_date }) => isSameDay(day, picked_date));
};
