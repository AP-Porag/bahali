import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { url } = usePage();
    const [openItems, setOpenItems] = useState<string[]>([]);

    // চেক করুন কোন আইটেম অ্যাকটিভ
    const isActive = (href: string) => {
        if (href === '/admin/under-development') {
            return url === href;
        }
        return url.startsWith(href);
    };

    // চেক করুন সাবমেনুর কোনো আইটেম অ্যাকটিভ কিনা
    const hasActiveChild = (children?: NavItem[]) => {
        if (!children) return false;
        return children.some(child => isActive(child.href));
    };

    // URL পরিবর্তন হলে অ্যাকটিভ সাবমেনুগুলো খুলে রাখুন
    useEffect(() => {
        items.forEach(item => {
            if (item.children && hasActiveChild(item.children)) {
                if (!openItems.includes(item.title)) {
                    setOpenItems(prev => [...prev, item.title]);
                }
            }
        });
    }, [url]);

    // টগল ফাংশন
    const toggleItem = (title: string) => {
        setOpenItems(prev =>
            prev.includes(title)
                ? prev.filter(item => item !== title)
                : [...prev, title]
        );
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    item.children && item.children.length > 0 ? (
                        // ----- Item WITH submenu -----
                        <Collapsible
                            key={item.title}
                            asChild
                            open={openItems.includes(item.title)}
                            onOpenChange={() => toggleItem(item.title)}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={{ children: item.title }}
                                        className={hasActiveChild(item.children) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.children.map((sub) => (
                                            <SidebarMenuSubItem key={sub.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={isActive(sub.href)}
                                                    className={isActive(sub.href) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                                                >
                                                    <Link href={sub.href!} prefetch>
                                                        {sub.icon && <sub.icon />}
                                                        <span>{sub.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        // ----- Plain item (no submenu) -----
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive(item.href)}
                                tooltip={{ children: item.title }}
                                className={isActive(item.href) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                            >
                                <Link href={item.href!} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
