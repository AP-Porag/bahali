import { usePage } from '@inertiajs/react';

import LandingHeader from '@/components/landing/LandingHeader';

/**
 * Provider area top menu (dashboard, edit profile) — same look as the landing page header
 * (components/landing/LandingHeader.tsx), with the provider menu items:
 * Dashboard · Edit Profile · Logout. On phones, Dashboard / Edit Profile open from the ☰ button.
 */
export default function ProviderMenu() {
    const { url } = usePage(); // current URL

    // Is this menu item the page being viewed?
    const isActive = (path: string) => {
        if (path === '/provider/dashboard') {
            return url === '/provider/dashboard';
        }
        return url.startsWith(path);
    };

    return (
        <LandingHeader
            sticky
            items={[
                { label: 'Dashboard', href: '/provider/dashboard', active: isActive('/provider/dashboard') },
                { label: 'Edit Profile', href: '/provider/profile/edit', active: isActive('/provider/profile/edit') },
            ]}
            button={{ label: 'Logout', href: '/logout', method: 'post' }}
        />
    );
}
