import type { Task } from "@/types";
import { isSameDay } from "date-fns";

export const getRandomInRange = (min: number, max: number) => {
    if (min > max) {
        [min, max] = [max, min];
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomDateInMonth = (year = new Date().getFullYear(), month = new Date().getMonth()) => {
    if (month < 0 || month > 11) {
        month = new Date().getMonth()
    }

    const endDate = new Date(year, month + 1, 0);
    const randomDay = Math.floor(Math.random() * endDate.getDate()) + 1;
    return new Date(year, month, randomDay);
};

export const getTasksForDay = (tasks: Task[], day: Date) => {
    return tasks.filter(({ picked_date }) => isSameDay(day, picked_date));
}