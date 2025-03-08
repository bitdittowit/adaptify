'use client';

import { useState } from 'react';

import { isPast, isSameMonth, isToday, isWeekend } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import Holidays from 'date-holidays';
import type { DayProps as BaseDayProps, FooterProps as BaseFooterProps } from 'react-day-picker';

import { Calendar as BaseCalendar } from '@/components/ui/calendar';
import mockData from '@/constants/tasks/user_tasks.json';
import { type BaseTask, STATUS, type Task } from '@/types';
import { getRandomDateInMonth, getRandomInRange, getTasksForDay } from '@/utils/calendar-utils';

import { Day } from './Day/Day';
import { Footer } from './Footer/Footer';

const holidays = new Holidays('RU');
const mockTasks = (mockData.tasks as BaseTask[])
    .map(
        task =>
            ({
                ...task,
                status: STATUS.OPEN,
                picked_date: getRandomDateInMonth(),
                experience_points: getRandomInRange(1, 10),
            }) as Omit<Task, 'proof_status'>,
    )
    .filter(({ picked_date }) => !(isWeekend(picked_date) || Boolean(holidays.isHoliday(picked_date))));

export const CalendarComponent = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const predicates = {
        past: (day: Date) => !isToday(day) && isPast(day) && isSameMonth(day, date || new Date()),
        weekend: (day: Date) =>
            !isPast(day) &&
            isSameMonth(day, date || new Date()) &&
            (isWeekend(day) || Boolean(holidays.isHoliday(day))),
    };

    return (
        <BaseCalendar
            components={{
                Day: (props: BaseDayProps) => <Day {...props} tasks={getTasksForDay(mockTasks, props.date)} />,
                Footer: (props: BaseFooterProps) => (
                    <Footer {...props} tasks={getTasksForDay(mockTasks, date || new Date())} />
                ),
            }}
            mode="single"
            selected={date}
            today={new Date()}
            onSelect={setDate}
            onMonthChange={setDate}
            className="rounded-md border"
            showOutsideDays={true}
            weekStartsOn={1}
            locale={ru}
            disabled={(day: Date) => predicates.past(day) || !isSameMonth(day, date || new Date())}
            modifiers={predicates}
            modifiersClassNames={{
                weekend: 'text-destructive',
                past: 'text-muted-foreground',
            }}
        />
    );
};
