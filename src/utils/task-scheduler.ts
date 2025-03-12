import { addDays, addMinutes, format, isAfter, isBefore, isWeekend, parse, startOfDay } from 'date-fns';
import Holidays from 'date-holidays';

import { daysOfWeek } from '@/constants/days-of-week';
import type { Schedule, Task } from '@/types';

const holidays = new Holidays('RU');

interface TimeSlot {
    start: Date;
    end: Date;
}

/**
 * Get available time slots for a given day based on schedule
 */
function getAvailableTimeSlots(date: Date, schedule: Schedule): TimeSlot[] {
    const dayOfWeek = daysOfWeek[date.getDay()];
    const timeRanges = schedule[dayOfWeek];
    const slots: TimeSlot[] = [];

    if (!timeRanges || timeRanges.length === 0) {
        return slots;
    }

    for (const timeRange of timeRanges) {
        const [startTime, endTime] = timeRange.split('-');
        const start = parse(`${format(date, 'yyyy-MM-dd')} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
        const end = parse(`${format(date, 'yyyy-MM-dd')} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date());
        slots.push({ start, end });
    }

    return slots;
}

/**
 * Check if a time slot is available for a task
 */
function isSlotAvailable(slot: TimeSlot, taskDuration: number, existingTasks: Task[], maxTasksPerDay: number): boolean {
    // Check if we already have maximum tasks for this day
    const tasksOnThisDay = existingTasks.filter(
        task => startOfDay(new Date(task.picked_date)).getTime() === startOfDay(slot.start).getTime(),
    );
    if (tasksOnThisDay.length >= maxTasksPerDay) {
        return false;
    }

    // Check if the slot has enough time for the task
    const slotDuration = (slot.end.getTime() - slot.start.getTime()) / (1000 * 60);
    if (slotDuration < taskDuration) {
        return false;
    }

    // Check if the slot overlaps with any existing tasks
    for (const existingTask of existingTasks) {
        const existingStart = new Date(existingTask.picked_date);
        const existingEnd = addMinutes(existingStart, existingTask.duration_minutes);

        if (
            (isAfter(slot.start, existingStart) && isBefore(slot.start, existingEnd)) ||
            (isAfter(slot.end, existingStart) && isBefore(slot.end, existingEnd))
        ) {
            return false;
        }
    }

    return true;
}

/**
 * Find the earliest available slot for a task
 */
function findEarliestAvailableSlot(
    startDate: Date,
    task: Task,
    existingTasks: Task[],
    maxDaysToCheck = 30,
    maxTasksPerDay = 3,
): Date | null {
    if (!task.schedule) {
        return null;
    }

    for (let i = 0; i < maxDaysToCheck; i++) {
        const dateToCheck = addDays(startDate, i);

        // Skip weekends and holidays
        if (isWeekend(dateToCheck) || Boolean(holidays.isHoliday(dateToCheck))) {
            continue;
        }

        const availableSlots = getAvailableTimeSlots(dateToCheck, task.schedule);

        for (const slot of availableSlots) {
            if (isSlotAvailable(slot, task.duration_minutes, existingTasks, maxTasksPerDay)) {
                return slot.start;
            }
        }
    }

    return null;
}

/**
 * Compare tasks by their blocking status
 */
function compareByBlockingStatus(a: Task, b: Task): number {
    if (a.blocked_by.length > 0 && b.blocked_by.length === 0) {
        return 1;
    }
    if (b.blocked_by.length > 0 && a.blocked_by.length === 0) {
        return -1;
    }
    return 0;
}

/**
 * Compare tasks by their priority
 */
function compareByPriority(a: Task, b: Task): number {
    return a.priority - b.priority;
}

/**
 * Compare tasks by their deadline
 */
function compareByDeadline(a: Task, b: Task): number {
    if (a.deadline_days === null && b.deadline_days === null) {
        return 0;
    }
    if (a.deadline_days === null) {
        return 1;
    }
    if (b.deadline_days === null) {
        return -1;
    }
    return a.deadline_days - b.deadline_days;
}

/**
 * Sort tasks by priority, deadline and dependencies
 */
function sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
        const blockingComparison = compareByBlockingStatus(a, b);
        if (blockingComparison !== 0) {
            return blockingComparison;
        }

        if (a.priority !== b.priority) {
            return compareByPriority(a, b);
        }

        if (a.deadline_days !== b.deadline_days) {
            return compareByDeadline(a, b);
        }

        return a.position - b.position;
    });
}

/**
 * Try to schedule a single task
 */
function tryScheduleTask(task: Task, arrivalDate: Date, scheduledTasks: Task[], maxRetries = 3): Task | null {
    let retries = 0;

    while (retries < maxRetries) {
        const date = findEarliestAvailableSlot(
            arrivalDate,
            task,
            scheduledTasks,
            30 + retries * 7, // Increase search window on each retry
        );

        if (date) {
            // Check if the scheduled date meets the deadline requirement
            if (task.deadline_days !== null) {
                const deadlineDate = addDays(arrivalDate, task.deadline_days);
                if (isAfter(date, deadlineDate)) {
                    retries++;
                    continue;
                }
            }

            return {
                ...task,
                picked_date: date,
                available: true,
            };
        }
        retries++;
    }

    return null;
}

/**
 * Process a single task from the remaining tasks queue
 */
function processRemainingTask(
    task: Task,
    remainingTasks: Task[],
    scheduledTasks: Task[],
    newlyScheduledTasks: Task[],
    arrivalDate: Date,
): void {
    if (task.blocked_by.some(id => !scheduledTasks.find(t => t.id === id))) {
        remainingTasks.push(task);
        return;
    }

    const scheduledTask = tryScheduleTask(task, arrivalDate, scheduledTasks);
    if (scheduledTask) {
        newlyScheduledTasks.push(scheduledTask);
    } else {
        remainingTasks.push(task);
    }
}

/**
 * Process unscheduled tasks and try to schedule them if possible
 */
function processUnscheduledTasks(
    unscheduledTasks: Task[],
    scheduledTasks: Task[],
    arrivalDate: Date,
    maxAttempts = 3,
): [Task[], Task[]] {
    let attempts = 0;
    let previousUnscheduledCount = unscheduledTasks.length;
    const remainingTasks = [...unscheduledTasks];
    const newlyScheduledTasks: Task[] = [];

    while (remainingTasks.length > 0 && attempts < maxAttempts) {
        const task = remainingTasks.shift();
        if (!task) {
            break;
        }

        processRemainingTask(task, remainingTasks, scheduledTasks, newlyScheduledTasks, arrivalDate);

        if (remainingTasks.length === previousUnscheduledCount) {
            attempts++;
        } else {
            previousUnscheduledCount = remainingTasks.length;
            attempts = 0;
        }
    }

    return [newlyScheduledTasks, remainingTasks];
}

/**
 * Try to schedule initial tasks that aren't blocked
 */
function scheduleInitialTasks(sortedTasks: Task[], arrivalDate: Date): [Task[], Task[]] {
    const scheduledTasks: Task[] = [];
    const unscheduledTasks: Task[] = [];

    for (const task of sortedTasks) {
        if (task.blocked_by.some(id => !scheduledTasks.find(t => t.id === id))) {
            unscheduledTasks.push(task);
            continue;
        }

        const scheduledTask = tryScheduleTask(task, arrivalDate, scheduledTasks);
        if (scheduledTask) {
            scheduledTasks.push(scheduledTask);
        } else {
            unscheduledTasks.push(task);
        }
    }

    return [scheduledTasks, unscheduledTasks];
}

/**
 * Schedule tasks for a student based on their arrival date
 */
export function scheduleTasks(tasks: Task[], arrivalDate: Date): Task[] {
    const sortedTasks = sortTasks(tasks);
    const [scheduledTasks, unscheduledTasks] = scheduleInitialTasks(sortedTasks, arrivalDate);
    const [newlyScheduledTasks, remainingTasks] = processUnscheduledTasks(
        unscheduledTasks,
        scheduledTasks,
        arrivalDate,
    );

    return [
        ...scheduledTasks,
        ...newlyScheduledTasks,
        ...remainingTasks.map(task => ({
            ...task,
            picked_date: new Date(0),
            available: false,
        })),
    ].sort((a, b) => a.position - b.position);
}
