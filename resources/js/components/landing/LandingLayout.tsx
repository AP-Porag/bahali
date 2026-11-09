import { Link } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';

import '../../../css/landing.css';
import LandingFooter from './LandingFooter';
import { LANDING_URL, SIGNUP_URL } from './links';

/**
 * Bahali Connect — shared header + footer for the landing page and its footer pages
 * (Version 3.7 package from Marsha: index.html, privacy.html, disclaimer.html, urgent-support.html).
 * The client's styles.css lives in resources/css/landing.css, scoped under `.bc-landing`.
 */

/* Page addresses live in ./links.ts — re-exported here so pages can keep importing them from LandingLayout. */
export { DIRECTORY_URL, DISCLAIMER_URL, LANDING_URL, PRIVACY_URL, SIGNUP_URL, URGENT_SUPPORT_URL } from './links';

/* Bahali logo (replaces the "bahali / PROVIDER DIRECTORY" text logo in the header). */
const LOGO_SRC = '/images/landing/bahali-logo.png';

/* Header menu labels — the landing page passes the admin-panel text; other pages use these defaults. */
export interface LandingNav {
    link1: string;
    link2: string;
    link3: string;
    button: string;
}

const DEFAULT_NAV: LandingNav = {
    link1: 'Our purpose',
    link2: 'How People Find Support',
    link3: 'How to join',
    button: 'Apply to join →',
};

function LandingHeader({ withNav, nav }: { withNav: boolean; nav: LandingNav }) {
    if (!withNav) {
        return (
            <header className="site-header">
                <Link className="logo" href={LANDING_URL} aria-label="Bahali Provider Directory home">
                    <img src={LOGO_SRC} alt="" />
                </Link>
            </header>
        );
    }

    return (
        <header className="site-header">
            <a className="logo" href="#top" aria-label="Bahali Provider Directory home">
                <img src={LOGO_SRC} alt="" />
            </a>

            <nav aria-label="Main navigation">
                <a className="nav-link" href="#purpose">
                    {nav.link1}
                </a>
                <a className="nav-link" href="#search">
                    {nav.link2}
                </a>
                <a className="nav-link" href="#steps">
                    {nav.link3}
                </a>
                {/* Provider application form */}
                <Link className="button nav-button" href={SIGNUP_URL}>
                    {nav.button}
                </Link>
            </nav>
        </header>
    );
}

export default function LandingLayout({ children, withNav = false, nav = DEFAULT_NAV }: { children: ReactNode; withNav?: boolean; nav?: LandingNav }) {
    // Smooth scrolling for the in-page links (#purpose, #search, #steps), only while these pages are open.
    useEffect(() => {
        const root = document.documentElement;
        const previous = root.style.scrollBehavior;
        root.style.scrollBehavior = 'smooth';
        return () => {
            root.style.scrollBehavior = previous;
        };
    }, []);

    return (
        <div className="bc-landing">
            <LandingHeader withNav={withNav} nav={nav} />
            {children}
            <LandingFooter />
        </div>
    );
}
