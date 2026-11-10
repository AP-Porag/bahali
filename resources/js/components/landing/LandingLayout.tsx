import { useEffect, type ReactNode } from 'react';

import '../../../css/landing.css';
import LandingFooter from './LandingFooter';
import LandingHeader, { type LandingMenuItem } from './LandingHeader';
import { SIGNUP_URL } from './links';

/**
 * Bahali Connect — shared header + footer for the landing page and its footer pages
 * (Version 3.7 package from Marsha: index.html, privacy.html, disclaimer.html, urgent-support.html).
 * The client's styles.css lives in resources/css/landing.css, scoped under `.bc-landing`.
 * The header itself is components/landing/LandingHeader.tsx (can also be used on its own).
 */

/* Page addresses live in ./links.ts — re-exported here so pages can keep importing them from LandingLayout. */
export { DIRECTORY_URL, DISCLAIMER_URL, LANDING_URL, PRIVACY_URL, SIGNUP_URL, URGENT_SUPPORT_URL } from './links';
export type { LandingMenuItem } from './LandingHeader';

/* Header menu labels — the landing page passes the admin-panel text; other pages use these defaults. */
export interface LandingNav {
    link1: string;
    link2: string;
    link3: string;
    button: string;
    /** Where the button goes. Default: the provider application form. */
    buttonHref?: string;
}

const DEFAULT_NAV: LandingNav = {
    link1: 'Our purpose',
    link2: 'How People Find Support',
    link3: 'How to join',
    button: 'Apply to join →',
};

interface LandingLayoutProps {
    children: ReactNode;
    /** Landing page menu (Our purpose / How People Find Support / How to join + Apply to join). */
    withNav?: boolean;
    nav?: LandingNav;
    /** Any other page: its own menu links and button (used instead of withNav). */
    items?: LandingMenuItem[];
    button?: LandingMenuItem | null;
}

export default function LandingLayout({ children, withNav = false, nav = DEFAULT_NAV, items, button }: LandingLayoutProps) {
    // Smooth scrolling for the in-page links (#purpose, #search, #steps), only while these pages are open.
    useEffect(() => {
        const root = document.documentElement;
        const previous = root.style.scrollBehavior;
        root.style.scrollBehavior = 'smooth';
        return () => {
            root.style.scrollBehavior = previous;
        };
    }, []);

    const header = withNav ? (
        <LandingHeader
            logoHref="#top"
            items={[
                { label: nav.link1, href: '#purpose' },
                { label: nav.link2, href: '#search' },
                { label: nav.link3, href: '#steps' },
            ]}
            // Provider application form
            button={{ label: nav.button, href: nav.buttonHref ?? SIGNUP_URL }}
        />
    ) : (
        <LandingHeader items={items} button={button} />
    );

    return (
        <div className="bc-landing">
            {header}
            {children}
            <LandingFooter />
        </div>
    );
}
