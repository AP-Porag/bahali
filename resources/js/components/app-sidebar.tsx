import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CalendarDays, LayoutGrid, Plus, StepBack, Type, Tag, List, FileStack, CircleOff, Ban, ShieldAlert, CircleSlash, Clock3, BadgeCheck, CircleX, User, X } from 'lucide-react';
import AppLogo from './app-logo';
import { LayoutTemplate, FileText, HeartHandshake, Search, Contact } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Providers',
        href: '/provider/directory/create',
        icon: User,
        children: [
            {
                title: 'Approved',
                href: '/admin/approved/providers',
                icon: BadgeCheck,
            },
            {
                title: 'Pending',
                href: '/admin/pending/providers',
                icon: Clock3,
            },
            {
                title: 'Rejected',
                href: '/admin/rejected/providers',
                icon: CircleX,
            },
            {
                title: 'Suspended',
                href: '/admin/suspended/providers',
                icon: Ban,
            },
            {
                title: 'Inactive',
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
    // Shared from HandleInertiaRequests (admin pages only).
    const { providerCounts } = usePage<{
        providerCounts?: { approved: number; pending: number; rejected: number; suspended: number; inactive: number } | null;
    }>().props;
    const navBadges = {
        '/admin/approved/providers': { count: providerCounts?.approved, tone: 'teal' as const },
        '/admin/pending/providers': { count: providerCounts?.pending, tone: 'amber' as const },
        '/admin/rejected/providers': { count: providerCounts?.rejected, tone: 'coral' as const },
        '/admin/suspended/providers': { count: providerCounts?.suspended, tone: 'rust' as const },
        '/admin/inactive/providers': { count: providerCounts?.inactive, tone: 'gray' as const },
    };

    // Mobile: the sidebar opens as a slide-in menu — this closes it.
    const { isMobile, setOpenMobile } = useSidebar();

    return (
        <Sidebar collapsible="icon" variant="inset" className="p-0">
            <SidebarHeader className={isMobile ? 'relative pr-12' : undefined}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {/* <Link href="under-development" prefetch>
                                <AppLogo />
                            </Link> */}
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Close button on the mobile menu */}
                {isMobile && (
                    <button
                        type="button"
                        onClick={() => setOpenMobile(false)}
                        aria-label="Close menu"
                        className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-lg text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} badges={navBadges} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
