'use client';

import { useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { isPast, isSameMonth, isToday, isWeekend } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import Holidays from 'date-holidays';

import { Calendar as BaseCalendar } from '@/components/ui/calendar';
import { useTasks } from '@/hooks/api/use-tasks';
import { STATUS } from '@/types';
import { getTasksForDay } from '@/utils/calendar-utils';

import { Day } from './Day/Day';
import { Footer } from './Footer/Footer';

const holidays = new Holidays('RU');

export const CalendarComponent = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const locale = useLocale();
    const t = useTranslations('calendar');
    const { tasks, isLoading, error } = useTasks();

    const predicates = {
        past: (day: Date) => !isToday(day) && isPast(day) && isSameMonth(day, date || new Date()),
        weekend: (day: Date) =>
            !isPast(day) &&
            isSameMonth(day, date || new Date()) &&
            (isWeekend(day) || Boolean(holidays.isHoliday(day))),
    };

    // Если данные загружаются или есть ошибка, показываем соответствующее состояние
    if (isLoading) {
        return <div>{t('loading')}</div>;
    }

    if (error) {
        return <div>{t('error')}</div>;
    }

    // Фильтруем задачи, оставляя только те, у которых есть picked_date и которые не выпадают на выходные
    const availableTasks = tasks.filter(
        task =>
            task.picked_date &&
            task.status !== STATUS.FINISHED &&
            !(isWeekend(new Date(task.picked_date)) || Boolean(holidays.isHoliday(new Date(task.picked_date)))),
    );

    const tasksForDay = date ? getTasksForDay(availableTasks, date) : [];

    return (
        <BaseCalendar
            components={{
                Day: props => <Day {...props} tasks={getTasksForDay(availableTasks, props.date)} />,
                Footer: props => <Footer {...props} tasks={tasksForDay} displayMonth={date} />,
            }}
            mode="single"
            selected={date}
            today={new Date()}
            onSelect={setDate}
            onMonthChange={setDate}
            className={t('styles.container')}
            showOutsideDays={true}
            weekStartsOn={1}
            locale={locale === 'ru' ? ru : undefined}
            disabled={(day: Date) => predicates.past(day) || !isSameMonth(day, date || new Date())}
            modifiers={predicates}
            modifiersClassNames={{
                weekend: t('styles.weekend'),
                past: t('styles.past'),
            }}
        />
    );
};
