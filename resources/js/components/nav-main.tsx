import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-[#7B8AA0]">
                Orion Network
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = isCurrentUrl(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={
                                    isActive
                                        ? 'border-l-[3px] border-l-[#00E5FF] bg-[rgba(0,229,255,0.08)] text-[#00E5FF] hover:bg-[rgba(0,229,255,0.12)] hover:text-[#00E5FF]'
                                        : 'border-l-[3px] border-l-transparent text-gray-400 hover:bg-[#0F172A] hover:text-[#E6F1FF]'
                                }
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

