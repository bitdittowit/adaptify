import type { ReactElement } from 'react';

import { useTranslations } from 'next-intl';

import { isPast, isSameMonth } from 'date-fns';
import { Day as BaseDay, type DayProps as BaseDayProps } from 'react-day-picker';

import type { Task } from '@/types';

import { Dot, RoundedRectangle } from '../Indicators/Indicators';

import styles from './Day.module.css';

type DayProps = BaseDayProps & {
    tasks: Omit<Task, 'proof_status'>[];
};

export const Day = ({ tasks, date, displayMonth, ...restDayProps }: DayProps) => {
    const t = useTranslations('calendar');
    const defaultIndicatorColor = t('styles.indicatorColor');

    const indicatorMap: Record<string, ReactElement> = {
        '0': <></>,
        '1': <Dot color={defaultIndicatorColor} size={8} />,
        '2': <RoundedRectangle width={12} height={8} color={defaultIndicatorColor} />,
        '3': <RoundedRectangle width={28} height={8} color={defaultIndicatorColor} />,
    };

    return (
        <div className={styles.day}>
            <BaseDay date={date} displayMonth={displayMonth} {...restDayProps} />
            {!isPast(date) &&
                isSameMonth(date, displayMonth) &&
                indicatorMap[Math.max(Math.min(tasks.length, 3), 0).toString()]}
        </div>
    );
};
