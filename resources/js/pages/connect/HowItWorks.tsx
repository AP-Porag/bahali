import { Link } from '@inertiajs/react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { Rich, reader, type ConnectContent } from '@/components/connect/content';
import { CONNECT_URLS as URLS } from '@/components/connect/links';

/**
 * How it works (reference src.jsx → HowPage). Text-only hero (IMAGE_GUIDE.md).
 * The clearly labeled illustrative profile is an educational example and may stay (IMPLEMENTATION.md).
 */
export default function HowItWorks({ content }: { content?: ConnectContent }) {
    const t = reader(content);

    return (
        <ConnectLayout page="how" title={t('seo.title')} description={t('seo.description')}>
            <section className="page-intro how-intro">
                <div className="wrap">
                    <p className="eyebrow">{t('intro.eyebrow')}</p>
                    <h1>
                        <Rich text={t('intro.title')} />
                    </h1>
                    <p className="lead">
                        <Rich text={t('intro.lead')} />
                    </p>
                    <Link className="button" href={URLS.browse}>
                        {t('intro.button')}
                    </Link>
                </div>
            </section>

            <section className="section wrap how how-page">
                <h2>
                    <Rich text={t('steps.title')} />
                </h2>
                <div>
                    {[
                        ['01', t('step1.title'), t('step1.body')],
                        ['02', t('step2.title'), t('step2.body')],
                        ['03', t('step3.title'), t('step3.body')],
                    ].map(([n, title, b]) => (
                        <div className="step" key={n}>
                            <span className="step-number">{n}</span>
                            <div>
                                <h3>{title}</h3>
                                <p>
                                    <Rich text={b} />
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div id="illustrative-profile" className="preview-card">
                    <div className="small-cap">{t('example.label')}</div>
                    <div className="mini-top">
                        <div className="avatar" aria-hidden="true">
                            {t('example.initials')}
                        </div>
                        <div>
                            <h3>{t('example.name')}</h3>
                            <p>{t('example.role')}</p>
                            <p className="example-location">{t('example.location')}</p>
                        </div>
                    </div>
                    <dl className="example-details">
                        {[1, 2, 3].map((n) => (
                            <div key={n}>
                                <dt>{t(`example.detail${n}.label`)}</dt>
                                <dd>
                                    <Rich text={t(`example.detail${n}.text`)} />
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <div className="mini-bottom">
                        <Link className="text-button" href={URLS.browse}>
                            {t('example.link')}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="wrap information-grid">
                {[1, 2, 3].map((n) => (
                    <article key={n}>
                        <h3>{t(`info${n}.title`)}</h3>
                        <p>
                            <Rich text={t(`info${n}.body`)} />
                        </p>
                    </article>
                ))}
            </section>
        </ConnectLayout>
    );
}
