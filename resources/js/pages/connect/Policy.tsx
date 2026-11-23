import { Link } from '@inertiajs/react';
import type { MouseEvent } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { ContentBlocks, Rich, contentSections, reader, type ConnectContent } from '@/components/connect/content';
import { CONNECT_URLS as URLS } from '@/components/connect/links';

/**
 * Privacy Policy, Terms of Use, Directory & Verification and Accessibility Statement
 * (reference LegalPages.jsx → PolicyPage). Wording, effective date and version IDs reviewed by Marsha
 * on 18 November 2026 (LEGAL_AND_SUPPORT.md). The wording is edited in Admin → CMS → Website Pages;
 * after a real change to the Terms or Privacy Policy, also update the version below.
 */

export type PolicyKind = 'privacy' | 'terms' | 'directory' | 'accessibility';

/* Recorded with a provider's agreement at signup (Terms + Privacy versions). */
export const LEGAL_VERSIONS = {
    terms: 'terms-2026-11-18',
    privacy: 'privacy-2026-11-18',
    directory: 'directory-2026-11-18',
    accessibility: 'accessibility-2026-11-18',
} as const;

/* "On this page" links: scroll the heading below the sticky header and move focus to it. */
function jump(e: MouseEvent<HTMLAnchorElement>, i: number) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const heading = document.querySelector<HTMLElement>('#policy-' + i + ' h2');
    if (!heading) return;
    window.history.replaceState(window.history.state, '', '#policy-' + i);
    const offset = (document.querySelector('.bc-connect header')?.getBoundingClientRect().height || 0) + 20;
    window.scrollTo({ top: window.scrollY + heading.getBoundingClientRect().top - offset, behavior: 'instant' as ScrollBehavior });
    heading.focus({ preventScroll: true });
}

export default function Policy({ kind, content }: { kind: PolicyKind; content?: ConnectContent }) {
    const t = reader(content);
    const sections = contentSections(t('body'));
    const contactHref = URLS.contact + (kind === 'privacy' ? '?topic=privacy' : kind === 'accessibility' ? '?topic=accessibility' : '');

    return (
        <ConnectLayout page={kind} title={t('seo.title')} description={t('seo.description')}>
            <section className="page-intro policy-intro">
                <div className="wrap">
                    <p className="eyebrow">{t('intro.eyebrow')}</p>
                    <h1>
                        <Rich text={t('intro.title')} />
                    </h1>
                    <p className="lead">
                        <Rich text={t('intro.lead')} />
                    </p>
                    <p className="policy-effective">{t('intro.effective')}</p>
                </div>
            </section>
            <div className="wrap policy-layout">
                <aside className="policy-toc">
                    <strong>{t('toc.title')}</strong>
                    {sections.map(({ title }, i) => (
                        <a key={i} href={'#policy-' + i} onClick={(e) => jump(e, i)}>
                            {title}
                        </a>
                    ))}
                    <Link href={URLS.contact}>{t('toc.link')}</Link>
                </aside>
                <article className="policy-copy">
                    {sections.map(({ title, blocks }, i) => (
                        <section id={'policy-' + i} key={i}>
                            <h2 tabIndex={-1}>{title}</h2>
                            <ContentBlocks blocks={blocks} />
                        </section>
                    ))}
                    <div className="policy-help">
                        <h2>
                            <Rich text={t('help.title')} />
                        </h2>
                        <div className="button-row">
                            <Link href={contactHref} className="button">
                                {t('help.button')}
                            </Link>
                            <Link href={URLS.report}>{t('help.report')}</Link>
                        </div>
                    </div>
                </article>
            </div>
        </ConnectLayout>
    );
}
