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
                title: {
                    default: t('routeMap.default'),
                    mobile: t('routeMap.mobile'),
                },
                url: '/',
                icon: Route,
            },
            {
                title: {
                    default: t('taskList.default'),
                    mobile: t('taskList.mobile'),
                },
                url: '/tasks',
                icon: ListChecks,
            },
            {
                title: {
                    default: t('taskCalendar.default'),
                    mobile: t('taskCalendar.mobile'),
                },
                url: '/calendar',
                icon: CalendarDays,
            },
        ],
    };

    return data;
};
