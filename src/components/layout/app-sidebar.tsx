'use client';

import type * as React from 'react';

import { NavMain } from '@/components/layout/nav-main';
import { NavUser } from '@/components/layout/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { useGetAppSideBarData } from '@/hooks/use-get-app-sidebar-data';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const data = useGetAppSideBarData();

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <NavUser user={data.user} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain
                    groups={[
                        {
                            name: '',
                            items: data.navMain.map(item => ({ ...item, name: item.title })),
                        },
                    ]}
                />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}
