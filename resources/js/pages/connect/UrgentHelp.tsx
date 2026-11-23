import { Link } from '@inertiajs/react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { Rich, reader, type ConnectContent } from '@/components/connect/content';
import { CONNECT_URLS as URLS, HELPLINE_URL } from '@/components/connect/links';

/**
 * Urgent Help (reference UrgentHelpPage.jsx). Points to the independent Find A Helpline service,
 * not a Bahali-maintained phone list. Update "Page last checked" only after a real review
 * (quarterly: main link + Jamaica/Haiti listings) — LEGAL_AND_SUPPORT.md.
 */
export default function UrgentHelp({ content }: { content?: ConnectContent }) {
    const t = reader(content);

    return (
        <ConnectLayout page="urgent" title={t('seo.title')} description={t('seo.description')}>
            <section className="page-intro">
                <div className="wrap">
                    <p className="eyebrow">{t('intro.eyebrow')}</p>
                    <h1>
                        <Rich text={t('intro.title')} />
                    </h1>
                    <p className="lead">
                        <Rich text={t('intro.lead')} />
                    </p>
                </div>
            </section>
            <article className="wrap urgent-content section">
                <section>
                    <h2>
                        <Rich text={t('now.title')} />
                    </h2>
                    <p>
                        <Rich text={t('now.p1')} />
                    </p>
                    <p>
                        <a className="button" href={HELPLINE_URL}>
                            {t('now.button')}
                        </a>
                    </p>
                    <p>
                        <Rich text={t('now.p2')} />
                    </p>
                    <p>
                        <Rich text={t('now.p3')} />
                    </p>
                    <p>
                        <Rich text={t('now.p4')} />
                    </p>
                </section>
                <section>
                    <h2>
                        <Rich text={t('about.title')} />
                    </h2>
                    <p>
                        <Rich text={t('about.body')} />
                    </p>
                </section>
                <section>
                    <h2>
                        <Rich text={t('ongoing.title')} />
                    </h2>
                    <p>
                        <Rich text={t('ongoing.body')} />
                    </p>
                    <Link href={URLS.help} className="button">
                        {t('ongoing.button')}
                    </Link>
                </section>
                <div className="small muted">
                    <p>
                        <Rich text={t('footer.note')} />
                    </p>
                    <p>
                        {t('footer.checked_label')} <time dateTime={t('footer.checked_iso')}>{t('footer.checked_date')}</time>
                    </p>
                </div>
            </article>
        </ConnectLayout>
    );
}
