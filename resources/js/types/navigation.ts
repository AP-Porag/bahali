import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: string;
};

export interface NavItem {
    title: string;
    href?: string | null;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
}
