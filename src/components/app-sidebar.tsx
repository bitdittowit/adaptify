'use client';

import type * as React from 'react';
import { CalendarDays, ListChecks, Route } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';

const data = {
    user: {
        name: 'John Doe',
        email: 'm@example.com',
        avatar: '',
    },
    navMain: [
        {
            title: 'Route map',
            url: '/',
            icon: Route,
        },
        {
            title: 'Task list',
            url: '/tasks',
            icon: ListChecks,
        },
        {
            title: 'Task calendar',
            url: '/calendar',
            icon: CalendarDays,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <NavUser user={data.user} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}
