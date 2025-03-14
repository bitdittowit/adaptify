import { isSameDay } from 'date-fns';

import type { Task } from '@/types';

export const getRandomInRange = (min: number, max: number) => {
    const [actualMin, actualMax] = min > max ? [max, min] : [min, max];
    return Math.floor(Math.random() * (actualMax - actualMin + 1)) + actualMin;
};

export const getRandomDateInMonth = (year = new Date().getFullYear(), month = new Date().getMonth()) => {
    const validMonth = month < 0 || month > 11 ? new Date().getMonth() : month;
    const endDate = new Date(year, validMonth + 1, 0);
    const randomDay = Math.floor(Math.random() * endDate.getDate()) + 1;
    return new Date(year, validMonth, randomDay);
};

export const getTasksForDay = (tasks: Task[], day: Date) => {
    return tasks.filter(({ picked_date }) => isSameDay(day, picked_date));
};
