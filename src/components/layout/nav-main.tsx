'use client';

import type { LucideIcon } from 'lucide-react';

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';

interface NavItem {
    name: {
        default: string;
        mobile: string;
    };
    url: string;
    icon: LucideIcon;
}

interface NavGroup {
    name: string;
    items: NavItem[];
}

export function NavMain({ groups }: { groups: NavGroup[] }) {
    const { isMobile } = useSidebar();

    return (
        <SidebarGroup>
            <SidebarMenu>
                {groups[0].items.map(item => (
                    <SidebarMenuItem key={item.name.default}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                                <item.icon />
                                <span>{isMobile ? item.name.mobile : item.name.default}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
