import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { CalendarDays, LayoutGrid, Plus, StepBack, Type, Tag, List, FileStack, CircleOff, Ban, ShieldAlert, CircleSlash, Clock3, BadgeCheck, CircleX, User } from 'lucide-react';
import AppLogo from './app-logo';
import { LayoutTemplate, FileText, HeartHandshake, Search, Contact } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/under-development',
        icon: LayoutGrid,
    },
    {
        title: 'Providers',
        href: '/provider/directory/create',
        icon: User,
        children: [
            {
                title: 'Approved Providers',
                href: '/admin/approved/providers',
                icon: BadgeCheck,
            },
            {
                title: 'Pending Providers',
                href: '/admin/pending/providers',
                icon: Clock3,
            },
            {
                title: 'Rejected Providers',
                href: '/admin/rejected/providers',
                icon: CircleX,
            },
            {
                title: 'Suspended Providers',
                href: '/admin/suspended/providers',
                icon: Ban,
            },
            {
                title: 'Inactive Providers',
                href: '/admin/inactive/providers',
                icon: ShieldAlert,
            },
        ],
    },

    {
        title: 'CMS',
        icon: FileText,
        children: [
            {
                title: 'Join the Circle',
                href: '/admin/web/join-the-circle',
                icon: HeartHandshake,
            },
            {
                title: 'Provider Directory',
                href: '/admin/web/provider-directory',
                icon: Search,
            },
            {
                title: 'Provider Profile',
                href: '/admin/web/provider-profile',
                icon: Contact,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {/* <Link href="under-development" prefetch>
                                <AppLogo />
                            </Link> */}
                            <Link href={route('under-development')} prefetch>
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
