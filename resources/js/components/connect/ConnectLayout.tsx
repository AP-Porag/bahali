import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import FooterCredit from '@/components/madbrain';
import '../../../css/connect.css';

import Icon from './Icon';
import { BAHALI_URL, RESOURCE_HUB_URL, CONNECT_URLS as URLS } from './links';

/**
 * Bahali Connect — shared header, navigation and footer (Marsha's handoff, 18 November 2026).
 * Header order: Browse providers · How it works · About Connect · Blog · Contact · For Providers
 * disclosure, with Get Help as the primary action. All styles live in resources/css/connect.css,
 * scoped under .bc-connect.
 */

export type ConnectPage =
    | 'home'
    | 'help'
    | 'results'
    | 'profile'
    | 'providers'
    | 'how'
    | 'about'
    | 'blog'
    | 'contact'
    | 'report'
    | 'privacy'
    | 'terms'
    | 'directory'
    | 'accessibility'
    | 'spotlight'
    | 'urgent';

interface SharedProps {
    auth?: { user?: { role?: string } | null };
    [key: string]: unknown;
}

/* "For Providers" disclosure — click/tap, Down Arrow, Escape returns focus, outside click closes. */
function ProviderNavigation({ page, signedIn }: { page: ConnectPage; signedIn: boolean }) {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const firstLink = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (!open) return;
        const outside = (e: PointerEvent) => {
            if (!root.current?.contains(e.target as Node)) setOpen(false);
        };
        const escape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setOpen(false);
                trigger.current?.focus();
            }
        };
        document.addEventListener('pointerdown', outside);
        document.addEventListener('keydown', escape);
        return () => {
            document.removeEventListener('pointerdown', outside);
            document.removeEventListener('keydown', escape);
        };
    }, [open]);

    return (
        <div
            className="provider-navigation"
            ref={root}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
            }}
        >
            <button
                ref={trigger}
                type="button"
                id="provider-nav-trigger"
                className={'provider-nav-trigger' + (page === 'providers' ? ' provider-nav-active' : '')}
                aria-expanded={open}
                aria-controls="provider-nav-links"
                onClick={() => setOpen(!open)}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setOpen(true);
                        requestAnimationFrame(() => firstLink.current?.focus());
                    }
                }}
            >
                For Providers
                <span className="provider-chevron" aria-hidden="true" />
            </button>
            <div id="provider-nav-links" className="provider-nav-links" hidden={!open}>
                <Link ref={firstLink} href={URLS.providers} aria-current={page === 'providers' ? 'page' : undefined} onClick={() => setOpen(false)}>
                    Join Bahali Connect
                </Link>
                {/* Existing account system: provider login, or the provider dashboard once signed in. */}
                <a href={signedIn ? URLS.account : URLS.login}>{signedIn ? 'My provider account' : 'Provider login'}</a>
            </div>
        </div>
    );
}

const MAIN_NAV: [ConnectPage, string, string][] = [
    ['results', 'Browse providers', URLS.browse],
    ['how', 'How it works', URLS.how],
    ['about', 'About Connect', URLS.about],
    ['blog', 'Blog', URLS.blog],
    ['contact', 'Contact', URLS.contact],
];

const LEGAL_LINKS: [string, string][] = [
    [URLS.urgent, 'Urgent Help'],
    [URLS.privacy, 'Privacy Policy'],
    [URLS.terms, 'Terms of Use'],
    [URLS.directory, 'Directory & Verification'],
    [URLS.spotlight, 'Spotlight Policy'],
    [URLS.accessibility, 'Accessibility'],
    [URLS.contact, 'Contact'],
    [URLS.report, 'Report a concern'],
];

export default function ConnectLayout({
    page,
    title,
    description,
    children,
}: {
    page: ConnectPage;
    /** Browser tab title, e.g. "Get Help" → "Get Help | Bahali Connect". */
    title: string;
    description?: string;
    children: ReactNode;
}) {
    const { auth } = usePage<SharedProps>().props;
    const signedIn = !!auth?.user;
    const [mobile, setMobile] = useState(false);

    // Headings reached by in-page links stay below the sticky header (reference: html { scroll-padding-top }).
    useEffect(() => {
        const root = document.documentElement;
        const previous = root.style.scrollPaddingTop;
        root.style.scrollPaddingTop = '110px';
        return () => {
            root.style.scrollPaddingTop = previous;
        };
    }, []);

    // Escape closes the mobile navigation.
    useEffect(() => {
        const closeMenu = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !e.defaultPrevented) setMobile(false);
        };
        window.addEventListener('keydown', closeMenu);
        return () => window.removeEventListener('keydown', closeMenu);
    }, []);

    const pageTitle = page === 'home' ? 'Find support. Feel understood. | Bahali Connect' : `${title} | Bahali Connect`;

    return (
        <div className="bc-connect">
            <Head title={pageTitle}>{description ? <meta head-key="description" name="description" content={description} /> : null}</Head>

            <a className="skip-link" href="#main-content">
                Skip to content
            </a>

            <header>
                <div className="site-topline" aria-hidden="true" />
                <div className="wrap header-inner">
                    <div className="brand">
                        <span>
                            <Link className="brand-name brand-home" href={URLS.home} aria-label="Bahali Connect home">
                                Bahali <b>Connect</b>
                                <i aria-hidden="true">•</i>
                            </Link>
                            <a
                                className="endorsement"
                                href={BAHALI_URL}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="A service of Bahali — visit Bahali.org in a new tab"
                            >
                                A SERVICE OF BAHALI
                            </a>
                        </span>
                    </div>

                    <nav id="main-navigation" className={mobile ? 'open' : ''} aria-label="Main navigation">
                        {MAIN_NAV.map(([key, label, href]) => (
                            <Link key={key} href={href} aria-current={page === key ? 'page' : undefined} onClick={() => setMobile(false)}>
                                {label}
                            </Link>
                        ))}
                        <ProviderNavigation page={page} signedIn={signedIn} />
                    </nav>

                    <div className="header-actions">
                        <Link className="button" href={URLS.help} aria-current={page === 'help' ? 'page' : undefined}>
                            Get Help
                        </Link>
                        <button
                            type="button"
                            className="menu-button"
                            aria-label={mobile ? 'Close navigation' : 'Open navigation'}
                            aria-controls="main-navigation"
                            aria-expanded={mobile}
                            onClick={() => setMobile(!mobile)}
                        >
                            <Icon name="menu" />
                        </button>
                    </div>
                </div>
            </header>

            <main id="main-content" tabIndex={-1}>
                {children}
            </main>

            <footer id="footer">
                <div className="wrap footer-top">
                    <div>
                        {/* <div className="footer-brand">
                            Bahali Connect<span aria-hidden="true">•</span>
                        </div> */}
                        <a className="bahali-footer-logo" href={BAHALI_URL} target="_blank" rel="noreferrer" aria-label="Bahali — visit Bahali.org">
                            <img src="/images/connect/bahali-logo-white.png" alt="Bahali" width="600" height="213" loading="lazy" />
                        </a>
                        <p>A service of Bahali, a nonprofit supporting emotional wellness across Caribbean communities and the diaspora.</p>
                        <a href={BAHALI_URL} target="_blank" rel="noreferrer">
                            Visit Bahali.org
                        </a>
                    </div>
                    <div className="footer-nav-column">
                        <h3>Explore</h3>
                        <ul className="footer-link-group">
                            <li>
                                <Link href={URLS.help}>Get Help</Link>
                            </li>
                            <li>
                                <Link href={URLS.browse}>Browse providers</Link>
                            </li>
                            <li>
                                <Link href={URLS.blog}>Blog</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-nav-column">
                        <h3>For providers</h3>
                        <ul className="footer-link-group">
                            <li>
                                <Link href={URLS.providers}>Join the directory</Link>
                            </li>
                            <li>
                                <a href={signedIn ? URLS.account : URLS.login}>{signedIn ? 'My provider account' : 'Provider login'}</a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-note">
                        <h3>
                            Because every mind
                            <br />
                            deserves peace.
                        </h3>
                        <a className="footer-resource" href={RESOURCE_HUB_URL} target="_blank" rel="noreferrer">
                            Explore emotional wellness resources <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                        <p>Provider services and fees vary. Contact providers directly to discuss your needs.</p>
                    </div>
                </div>
                <div className="wrap footer-bottom">
                    {/* © line + technology partner credit (same font, size and colour; link #FF5619) */}
                    <div className="footer-copyright-row">
                        <span>© {new Date().getFullYear()} Bahali Inc. All rights reserved.</span>
                        <FooterCredit text="Technology Partner" />
                    </div>
                    <nav className="legal-links" aria-label="Legal and support">
                        {LEGAL_LINKS.map(([href, label]) => (
                            <Link href={href} key={href}>
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </footer>
        </div>
    );
}
