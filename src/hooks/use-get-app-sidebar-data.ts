import { useTranslations } from 'next-intl';

import { CalendarDays, ListChecks, Route } from 'lucide-react';

import { useSession } from './use-session';

export const useGetAppSideBarData = () => {
    const t = useTranslations('sidebar');
    const { user } = useSession();

    const data = {
        user: {
            name: user.name || 'Guest',
            email: user.email || '',
            image: user.image,
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
