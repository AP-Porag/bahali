import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import FooterCredit from '@/components/madbrain';
import '../../../css/connect.css';

import { Rich, fill, reader, type ConnectContent } from './content';
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
    | 'urgent'
    | 'account';

interface SharedProps {
    auth?: { user?: { role?: string } | null };
    /** Header & footer text from Admin → CMS → Website Pages (shared by HandleInertiaRequests). */
    connectLayout?: ConnectContent;
    [key: string]: unknown;
}

/* "For Providers" disclosure — click/tap, Down Arrow, Escape returns focus, outside click closes. */
function ProviderNavigation({ page, signedIn, t }: { page: ConnectPage; signedIn: boolean; t: (key: string) => string }) {
    const [open, setOpen] = useState(false);
    // Dashboard and Edit profile both use page="account" — the address decides which menu item is current.
    const path = usePage().url.split('?')[0];
    const onDashboard = path.startsWith(URLS.account);
    const onEditProfile = path.startsWith(URLS.editProfile);
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
                className={'provider-nav-trigger' + (page === 'providers' || page === 'account' ? ' provider-nav-active' : '')}
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
                {t('nav.providers')}
                <span className="provider-chevron" aria-hidden="true" />
            </button>
            <div id="provider-nav-links" className="provider-nav-links" hidden={!open}>
                {/* Not shown inside the provider account (dashboard, edit profile) — the provider has already joined. */}
                {page !== 'account' && (
                    <Link
                        ref={firstLink}
                        href={URLS.providers}
                        aria-current={page === 'providers' ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                    >
                        {t('nav.join')}
                    </Link>
                )}
                {/* Existing account system: provider login, or the provider account links once signed in. */}
                {signedIn ? (
                    <>
                        <Link
                            ref={page === 'account' ? firstLink : undefined}
                            href={URLS.account}
                            aria-current={onDashboard ? 'page' : undefined}
                            onClick={() => setOpen(false)}
                        >
                            {t('nav.dashboard')}
                        </Link>
                        <Link href={URLS.editProfile} aria-current={onEditProfile ? 'page' : undefined} onClick={() => setOpen(false)}>
                            {t('nav.edit')}
                        </Link>
                        <Link as="button" method="post" href={URLS.logout} className="provider-nav-logout" onClick={() => setOpen(false)}>
                            {t('nav.logout')}
                        </Link>
                    </>
                ) : (
                    <a href={URLS.login}>{t('nav.login')}</a>
                )}
            </div>
        </div>
    );
}

/* [page, CMS label key, address] — labels: Admin → CMS → Website Pages → Header & Footer. */
const MAIN_NAV: [ConnectPage, string, string][] = [
    ['results', 'nav.browse', URLS.browse],
    ['how', 'nav.how', URLS.how],
    ['about', 'nav.about', URLS.about],
    ['blog', 'nav.blog', URLS.blog],
    ['contact', 'nav.contact', URLS.contact],
];

const LEGAL_LINKS: [string, string][] = [
    [URLS.urgent, 'legal.urgent'],
    [URLS.privacy, 'legal.privacy'],
    [URLS.terms, 'legal.terms'],
    [URLS.directory, 'legal.directory'],
    [URLS.spotlight, 'legal.spotlight'],
    [URLS.accessibility, 'legal.accessibility'],
    [URLS.contact, 'legal.contact'],
    [URLS.report, 'legal.report'],
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
    const { auth, connectLayout } = usePage<SharedProps>().props;
    const t = reader(connectLayout);
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

    const pageTitle = `${title} | Bahali Connect`;

    return (
        <div className="bc-connect">
            <Head title={pageTitle}>{description ? <meta head-key="description" name="description" content={description} /> : null}</Head>

            <a className="skip-link" href="#main-content">
                {t('header.skip')}
            </a>

            <header>
                <div className="site-topline" aria-hidden="true" />
                <div className="wrap header-inner">
                    {/* Text wordmark "Bahali Connect•" + "A service of Bahali" link (no Bahali logo in the main navigation). */}
                    <div className="brand">
                        <span>
                            <Link className="brand-name brand-home" href={URLS.home} aria-label={t('header.home_label')}>
                                {t('header.wordmark')} <b>{t('header.wordmark_bold')}</b>
                                <i aria-hidden="true">•</i>
                            </Link>
                            <a className="endorsement" href={BAHALI_URL} target="_blank" rel="noreferrer" aria-label={t('header.endorsement_label')}>
                                {t('header.endorsement')}
                            </a>
                        </span>
                    </div>

                    <nav id="main-navigation" className={mobile ? 'open' : ''} aria-label="Main navigation">
                        {MAIN_NAV.map(([key, label, href]) => (
                            <Link key={key} href={href} aria-current={page === key ? 'page' : undefined} onClick={() => setMobile(false)}>
                                {t(label)}
                            </Link>
                        ))}
                        <ProviderNavigation page={page} signedIn={signedIn} t={t} />
                    </nav>

                    <div className="header-actions">
                        <Link className="button" href={URLS.help} aria-current={page === 'help' ? 'page' : undefined}>
                            {t('header.button')}
                        </Link>
                        <button
                            type="button"
                            className="menu-button"
                            aria-label={mobile ? t('header.menu_close') : t('header.menu_open')}
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
                        <a className="bahali-footer-logo" href={BAHALI_URL} target="_blank" rel="noreferrer" aria-label={t('footer.logo_label')}>
                            <img src={t('footer.logo')} alt={t('footer.logo_alt')} width="600" height="213" loading="lazy" />
                        </a>
                        <p>
                            <Rich text={t('footer.about')} />
                        </p>
                        <a href={BAHALI_URL} target="_blank" rel="noreferrer">
                            {t('footer.bahali_link')}
                        </a>
                    </div>
                    <div className="footer-nav-column">
                        <h3>{t('footer.explore_title')}</h3>
                        <ul className="footer-link-group">
                            <li>
                                <Link href={URLS.help}>{t('footer.explore_help')}</Link>
                            </li>
                            <li>
                                <Link href={URLS.browse}>{t('footer.explore_browse')}</Link>
                            </li>
                            <li>
                                <Link href={URLS.blog}>{t('footer.explore_blog')}</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-nav-column">
                        <h3>{t('footer.providers_title')}</h3>
                        <ul className="footer-link-group">
                            <li>
                                <Link href={URLS.providers}>{t('footer.providers_join')}</Link>
                            </li>
                            <li>
                                <a href={signedIn ? URLS.account : URLS.login}>{signedIn ? t('footer.providers_account') : t('footer.providers_login')}</a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-note">
                        <h3>
                            <Rich text={t('footer.note_title')} />
                        </h3>
                        <a className="footer-resource" href={RESOURCE_HUB_URL} target="_blank" rel="noreferrer">
                            {t('footer.resource')} <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                        <p>
                            <Rich text={t('footer.fees')} />
                        </p>
                    </div>
                </div>
                <div className="wrap footer-bottom">
                    {/* © line + technology partner credit (same font, size and colour; link #FF5619) */}
                    <div className="footer-copyright-row">
                        <span>{fill(t('footer.copyright'), { year: new Date().getFullYear() })}</span>
                        <FooterCredit text="Technology Partner" />
                    </div>
                    <nav className="legal-links" aria-label="Legal and support">
                        {LEGAL_LINKS.map(([href, label]) => (
                            <Link href={href} key={href}>
                                {t(label)}
                            </Link>
                        ))}
                    </nav>
                </div>
            </footer>
        </div>
    );
}
