import { Link } from '@inertiajs/react';
import { useEffect, useState, type ReactNode } from 'react';

import '../../../css/landing.css';
import { LANDING_URL } from './links';

/**
 * Bahali Connect header (Version 3.7 design from Marsha) — logo on the left, menu on the right.
 * Used by LandingLayout, and can be dropped into any other page with its own menu:
 *
 *     import LandingHeader from '@/components/landing/LandingHeader';
 *     ...
 *     <LandingHeader
 *         items={[
 *             { label: 'Find support', href: '/provider' },
 *             { label: 'Visit bahali.org', href: 'https://bahali.org' },
 *         ]}
 *         button={{ label: 'Login', href: '/login' }}
 *     />
 *
 * items  — text links (any number; leave out for none). On phones (700px and below) they move
 *          into a menu that opens from the ☰ button next to the teal button.
 * button — the teal button on the right (leave out or pass null for none).
 * href   — '/page' opens inside the app, '#section' scrolls on the same page, 'https://…' opens that site.
 * containerWidth / gutter — line the logo and menu up with the page's own content box.
 *          For content in `mx-auto max-w-5xl px-5` pass containerWidth={1024} gutter={20}
 *          (max-w-5xl = 1024px, px-5 = 20px). Leave out to keep the landing page spacing.
 *          gutter can also be a CSS value, e.g. 'var(--bc-gutter)' set per screen size through className.
 * method: 'post' — the item is sent as a form POST (e.g. Logout).   active — marks the current page.
 * sticky — keeps the header at the top while the page scrolls.
 *
 * The `bc-landing bc-landing-header` wrapper turns the landing styles on for the header only,
 * so the rest of the page is not affected.
 */

/* Bahali logo (replaces the "bahali / PROVIDER DIRECTORY" text logo in the header). */
const LOGO_SRC = '/images/landing/bahali-logo.png';

export interface LandingMenuItem {
    label: ReactNode;
    href: string;
    /** Open in a new tab (for links to other websites). */
    newTab?: boolean;
    /** Send as a POST request (e.g. Logout) instead of opening a page. */
    method?: 'post';
    /** This is the page being viewed (bold, aria-current). */
    active?: boolean;
}

interface LandingHeaderProps {
    items?: LandingMenuItem[];
    button?: LandingMenuItem | null;
    /** Where the logo goes. Default: the landing page. Use '#top' on the landing page itself. */
    logoHref?: string;
    /** Max width (px) of the page's content box, incl. its side padding — e.g. 1024 for max-w-5xl. */
    containerWidth?: number;
    /** Side padding of the page's content box — px number (20 for px-5) or a CSS value. */
    gutter?: number | string;
    /** Keep the header at the top of the screen while scrolling. */
    sticky?: boolean;
    /** Extra classes on the outer wrapper (e.g. to set --bc-gutter per screen size). */
    className?: string;
}

/* App pages ('/…') go through Inertia; '#section' and other websites stay normal links. */
function MenuLink({ item, className, onClick }: { item: LandingMenuItem; className: string; onClick?: () => void }) {
    const isAppPage = item.href.startsWith('/') && !item.href.startsWith('//') && !item.newTab;
    const current = item.active ? ({ 'aria-current': 'page' } as const) : {};

    if (item.method === 'post') {
        return (
            <Link className={className} href={item.href} method="post" as="button" onClick={onClick} {...current}>
                {item.label}
            </Link>
        );
    }

    if (isAppPage) {
        return (
            <Link className={className} href={item.href} onClick={onClick} {...current}>
                {item.label}
            </Link>
        );
    }

    return (
        <a className={className} href={item.href} onClick={onClick} {...current} {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {item.label}
        </a>
    );
}

export default function LandingHeader({
    items = [],
    button = null,
    logoHref = LANDING_URL,
    containerWidth,
    gutter = 20,
    sticky = false,
    className = '',
}: LandingHeaderProps) {
    const logo = <img src={LOGO_SRC} alt="" />;
    // Same left/right edges as a centred `max-width: containerWidth; padding: 0 gutter` content box.
    const g = typeof gutter === 'number' ? `${gutter}px` : gutter;
    const side = containerWidth ? `max(${g}, calc((100% - ${containerWidth}px) / 2 + ${g}))` : undefined;
    const alignStyle = side ? { paddingLeft: side, paddingRight: side } : undefined;
    const hasMenu = items.length > 0 || !!button;
    const [open, setOpen] = useState(false); // phone menu
    const close = () => setOpen(false);

    // Esc closes the phone menu.
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    return (
        <div
            className={`bc-landing bc-landing-header${className ? ` ${className}` : ''}`}
            style={sticky ? { position: 'sticky', top: 0, zIndex: 40 } : undefined}
        >
            <header className="site-header" style={alignStyle}>
                {logoHref.startsWith('/') ? (
                    <Link className="logo" href={logoHref} aria-label="Bahali Provider Directory home">
                        {logo}
                    </Link>
                ) : (
                    <a className="logo" href={logoHref} aria-label="Bahali Provider Directory home">
                        {logo}
                    </a>
                )}

                {hasMenu && (
                    <nav aria-label="Main navigation">
                        {items.map((item, i) => (
                            <MenuLink key={`${item.href}-${i}`} item={item} className="nav-link" />
                        ))}
                        {button && <MenuLink item={button} className="button nav-button" onClick={close} />}

                        {/* Phones (700px and below): ☰ opens the menu links below the header */}
                        {items.length > 0 && (
                            <button
                                type="button"
                                className="nav-toggle"
                                aria-label={open ? 'Close menu' : 'Open menu'}
                                aria-expanded={open}
                                aria-controls="bc-mobile-menu"
                                onClick={() => setOpen((o) => !o)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                                    {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                                </svg>
                            </button>
                        )}
                    </nav>
                )}
            </header>

            {items.length > 0 && (
                <nav id="bc-mobile-menu" className={`mobile-menu${open ? ' is-open' : ''}`} style={alignStyle} aria-label="Mobile navigation">
                    {items.map((item, i) => (
                        <MenuLink key={`${item.href}-${i}`} item={item} className="mobile-link" onClick={close} />
                    ))}
                </nav>
            )}
        </div>
    );
}
