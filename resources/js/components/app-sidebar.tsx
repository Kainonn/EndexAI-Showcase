import { Link } from '@inertiajs/react';
import {
    Activity,
    BookOpen,
    Bot,
    Database,
    FolderGit2,
    LayoutGrid,
    MessageSquare,
    ScrollText,
    Server,
    Wrench,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { page as orionPage } from '@/routes/orion';
import { edit as profileSettings } from '@/routes/profile';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Orion Core',
        href: orionPage(),
        icon: Bot,
    },
    {
        title: 'Activity',
        href: dashboard(),
        icon: Activity,
    },
    {
        title: 'Agents',
        href: orionPage({ query: { panel: 'agents' } }),
        icon: MessageSquare,
    },
    {
        title: 'Knowledge',
        href: orionPage({ query: { panel: 'knowledge' } }),
        icon: BookOpen,
    },
    {
        title: 'Tools',
        href: orionPage({ query: { panel: 'tools' } }),
        icon: Wrench,
    },
    {
        title: 'Prospectos',
        href: '/prospectos',
        icon: Database,
    },
    {
        title: 'System',
        href: profileSettings(),
        icon: Server,
    },
    {
        title: 'Logs',
        href: orionPage({ query: { panel: 'logs' } }),
        icon: ScrollText,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={orionPage()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
