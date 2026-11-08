import { Link } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';

import '../../../css/landing.css';

/**
 * Bahali Connect — shared header + footer for the landing page and its footer pages
 * (Version 3.7 package from Marsha: index.html, privacy.html, disclaimer.html, urgent-support.html).
 * The client's styles.css lives in resources/css/landing.css, scoped under `.bc-landing`.
 */

/* Page addresses — change here if the routes change. */
export const LANDING_URL = '/';
export const SIGNUP_URL = '/provider/directory/create'; // provider application form
export const DIRECTORY_URL = '/provider'; // public directory search
export const PRIVACY_URL = '/privacy';
export const DISCLAIMER_URL = '/disclaimer';
export const URGENT_SUPPORT_URL = '/urgent-support';

function LandingHeader({ withNav }: { withNav: boolean }) {
    if (!withNav) {
        return (
            <header className="site-header">
                <Link className="logo" href={LANDING_URL} aria-label="Bahali Provider Directory home">
                    bahali
                    <small>PROVIDER DIRECTORY</small>
                </Link>
            </header>
        );
    }

    return (
        <header className="site-header">
            <a className="logo" href="#top" aria-label="Bahali Provider Directory home">
                bahali
                <small>PROVIDER DIRECTORY</small>
            </a>

            <nav aria-label="Main navigation">
                <a className="nav-link" href="#purpose">
                    Our purpose
                </a>
                <a className="nav-link" href="#search">
                    How People Find Support
                </a>
                <a className="nav-link" href="#steps">
                    How to join
                </a>
                {/* Provider application form */}
                <Link className="button nav-button" href={SIGNUP_URL}>
                    Apply to join →
                </Link>
            </nav>
        </header>
    );
}

function LandingFooter() {
    return (
        <footer>
            <span>Bahali Provider Directory</span>

            <nav className="footer-links" aria-label="Footer">
                <span>
                    Directory contact: <a href="mailto:directory@bahali.org">directory@bahali.org</a>
                </span>
                {/* Privacy Policy: DRAFT — legal sign-off needed. Must be live before the provider application collects any information. */}
                <Link href={PRIVACY_URL}>Privacy Policy</Link>
                {/* Directory Disclaimer: DRAFT pending legal review. */}
                <Link href={DISCLAIMER_URL}>Directory Disclaimer</Link>
                {/* Need urgent support?: emergency and crisis numbers, checked November 2026. */}
                <Link href={URGENT_SUPPORT_URL}>Need urgent support?</Link>
                <a href="https://bahali.org">Visit bahali.org →</a>
            </nav>

            <span>Because every mind deserves peace.</span>

            <div className="footer-bottom">© 2026 Bahali Inc.</div>
        </footer>
    );
}

export default function LandingLayout({ children, withNav = false }: { children: ReactNode; withNav?: boolean }) {
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
            <LandingHeader withNav={withNav} />
            {children}
            <LandingFooter />
        </div>
    );
}
