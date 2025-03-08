'use client';

import { useTranslations } from 'next-intl';

import { ChevronRight, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({
    groups,
}: {
    groups: {
        name: string;
        items: {
            name: string;
            url: string;
            icon: LucideIcon;
        }[];
    }[];
}) {
    const t = useTranslations('sidebar');

    return (
        <SidebarGroup>
            {groups.map(group => (
                <Collapsible key={group.name}>
                    <CollapsibleTrigger asChild>
                        <SidebarGroupLabel>
                            {group.name}
                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                                <ChevronRight />
                                <span className="sr-only">{t('toggle')}</span>
                            </SidebarMenuAction>
                        </SidebarGroupLabel>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenu>
                            {group.items.map(item => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.name}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </SidebarGroup>
    );
}
