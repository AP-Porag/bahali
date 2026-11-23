import { Link } from '@inertiajs/react';
import type { MouseEvent } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { ContentBlocks, Rich, contentSections, reader, type ConnectContent } from '@/components/connect/content';
import { CONNECT_URLS as URLS } from '@/components/connect/links';

/* Provider Spotlight Policy (reference SpotlightPolicyPage.jsx) — effective 18 November 2026. Text: Admin → CMS → Website Pages. */

function jump(e: MouseEvent<HTMLAnchorElement>, i: number) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const h = document.getElementById('spotlight-policy-' + i);
    if (!h) return;
    const top = window.scrollY + h.getBoundingClientRect().top - (document.querySelector('.bc-connect header')?.getBoundingClientRect().height || 0) - 20;
    window.history.replaceState(window.history.state, '', '#spotlight-policy-' + i);
    window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
    h.focus({ preventScroll: true });
}

export default function SpotlightPolicy({ content }: { content?: ConnectContent }) {
    const t = reader(content);
    const sections = contentSections(t('body'));

    return (
        <ConnectLayout page="spotlight" title={t('seo.title')} description={t('seo.description')}>
            <section className="page-intro policy-intro">
                <div className="wrap">
                    <p className="eyebrow">{t('intro.eyebrow')}</p>
                    <h1>
                        <Rich text={t('intro.title')} />
                    </h1>
                    <p className="policy-effective">
                        <em>
                            {t('intro.effective_label')} <time dateTime={t('intro.effective_iso')}>{t('intro.effective_date')}</time>
                        </em>
                    </p>
                    <p className="lead">
                        <Rich text={t('intro.lead')} />
                    </p>
                </div>
            </section>
            <div className="wrap policy-layout">
                <aside className="policy-toc">
                    <strong>{t('toc.title')}</strong>
                    {sections.map(({ title }, i) => (
                        <a key={i} href={'#spotlight-policy-' + i} onClick={(e) => jump(e, i)}>
                            {title}
                        </a>
                    ))}
                    <Link href={URLS.providers}>{t('toc.link')}</Link>
                </aside>
                <article className="policy-copy">
                    {sections.map(({ title, blocks }, i) => (
                        <section key={i}>
                            <h2 id={'spotlight-policy-' + i} tabIndex={-1}>
                                {title}
                            </h2>
                            <ContentBlocks blocks={blocks} />
                        </section>
                    ))}
                    <p className="policy-update-note">
                        <Rich text={t('update.note')} />
                    </p>
                </article>
            </div>
        </ConnectLayout>
    );
}
