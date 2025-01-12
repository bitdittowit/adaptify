import { useTranslations } from 'next-intl';

import { CalendarDays, ListChecks, Route } from 'lucide-react';

export const useGetAppSideBarData = () => {
    const t = useTranslations('sidebar');

    const data = {
        user: {
            name: 'John Doe',
            email: 'm@example.com',
            avatar: '',
        },
        navMain: [
            {
                title: t('routeMap'),
                url: '/',
                icon: Route,
            },
            {
                title: t('taskList'),
                url: '/tasks',
                icon: ListChecks,
            },
            {
                title: t('taskCalendar'),
                url: '/calendar',
                icon: CalendarDays,
            },
        ],
    };

    return data;
};
