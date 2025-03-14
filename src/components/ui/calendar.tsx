'use client';

import type * as React from 'react';

import { useTranslations } from 'next-intl';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { buttonVariants } from '@/components/ui/button';
import { useBreakpoint } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
    const t = useTranslations('days');
    const m = useTranslations('months');

    // Уменьшаем размер ячеек календаря на мобильных устройствах
    const daySize = isMobile ? 'w-full h-10' : 'w-full h-16';
    const headCellSize = isMobile ? 'text-sm' : 'text-lg';
    const navButtonSize = isMobile ? 'h-8 w-8' : 'h-14 w-14';
    const captionSize = isMobile ? 'text-base' : 'text-lg';

    const labels = {
        months: [
            m('january'),
            m('february'),
            m('march'),
            m('april'),
            m('may'),
            m('june'),
            m('july'),
            m('august'),
            m('september'),
            m('october'),
            m('november'),
            m('december'),
        ],
        weekDays: [t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday'), t('sunday')],
    };

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('w-full p-3 md:p-5', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full',
                month: 'space-y-4 w-full',
                caption: 'flex justify-center pt-1 relative items-center w-full',
                caption_label: cn('font-medium', captionSize),
                nav: 'space-x-1 md:space-x-3 flex items-center',
                nav_button: cn(
                    buttonVariants({ variant: 'outline' }),
                    navButtonSize,
                    'bg-transparent p-0 opacity-50 hover:opacity-100',
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex w-full justify-around mb-1',
                head_cell: cn('text-muted-foreground rounded-md w-full font-normal text-center', headCellSize),
                row: 'flex w-full mt-2',
                cell: cn(
                    'relative p-0 text-center text-lg focus-within:relative focus-within:z-20 w-full [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
                    props.mode === 'range'
                        ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
                        : '[&:has([aria-selected])]:rounded-md',
                ),
                day: cn(
                    buttonVariants({ variant: 'ghost' }),
                    daySize,
                    'p-0 font-normal aria-selected:opacity-100 w-full flex items-center justify-center',
                    isMobile ? 'text-sm' : 'text-base',
                ),
                day_range_start: 'day-range-start',
                day_range_end: 'day-range-end',
                day_selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
                day_today: 'border-2 border-primary',
                day_outside: 'text-muted-foreground opacity-30',
                ...classNames,
            }}
            components={{
                IconLeft: () => <ChevronLeft className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />,
                IconRight: () => <ChevronRight className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />,
            }}
            formatters={{
                formatCaption: (date: Date) => {
                    return `${labels.months[date.getMonth()]} ${date.getFullYear()}`;
                },
            }}
            weekStartsOn={1}
            {...props}
        />
    );
}
Calendar.displayName = 'Calendar';

export { Calendar };
