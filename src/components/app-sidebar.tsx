'use client';

import type * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { useGetAppSideBarData } from '@/hooks/useGetAppSidebarData';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const data = useGetAppSideBarData();

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
