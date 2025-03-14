import { isPast, isSameMonth } from 'date-fns';
import { Day as BaseDay, type DayProps as BaseDayProps } from 'react-day-picker';

import { useBreakpoint } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

import styles from './Day.module.css';

type DayProps = BaseDayProps & {
    tasks: Omit<Task, 'proof_status'>[];
};

// Компонент индикатора количества задач
const TaskCounter = ({
    count,
    colorClass = 'bg-primary',
}: {
    count: number;
    colorClass?: string;
}) => {
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'xs' || breakpoint === 'sm';

    if (count === 0) {
        return null;
    }

    // Определяем класс размера в зависимости от количества задач и типа устройства
    const sizeClass = isMobile
        ? count > 9
            ? 'w-4 h-4 text-[0.55rem]'
            : 'w-4 h-4 text-[0.55rem]'
        : count > 9
          ? 'w-6 h-5 text-[0.65rem]'
          : 'w-5 h-5 text-[0.65rem]';

    return (
        <div
            className={cn(
                'flex items-center justify-center font-medium text-primary-foreground rounded-full',
                sizeClass,
                colorClass,
            )}
        >
            {count > 99 ? '99+' : count}
        </div>
    );
};

export const Day = ({ tasks, date, displayMonth, ...restDayProps }: DayProps) => {
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'xs' || breakpoint === 'sm';

    // Определяем цвет индикатора в зависимости от количества задач
    const getIndicatorColorClass = (count: number): string => {
        if (count === 0) {
            return '';
        }
        if (count === 1) {
            return 'bg-blue-500';
        }
        if (count === 2) {
            return 'bg-amber-500';
        }
        if (count <= 4) {
            return 'bg-orange-500';
        }
        return 'bg-red-500'; // больше 4 задач - красный цвет
    };

    return (
        <div className={cn(styles.day, isMobile ? styles.mobileDay : '')}>
            <BaseDay date={date} displayMonth={displayMonth} {...restDayProps} />
            {!isPast(date) && isSameMonth(date, displayMonth) && (
                <TaskCounter count={tasks.length} colorClass={getIndicatorColorClass(tasks.length)} />
            )}
        </div>
    );
};
