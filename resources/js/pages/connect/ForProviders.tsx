import { Link } from '@inertiajs/react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { Rich, reader, type ConnectContent } from '@/components/connect/content';
import { CONNECT_URLS as URLS } from '@/components/connect/links';

/**
 * For Providers — recruitment page (reference src.jsx → Providers).
 * "Start your application" opens the existing provider application (account, email code, review).
 * Hero photograph: the approved "providers in community" image, reused from the homepage (4:3).
 */
export default function ForProviders({ content }: { content?: ConnectContent }) {
    const t = reader(content);

    return (
        <ConnectLayout page="providers" title={t('seo.title')} description={t('seo.description')}>
            <section className="provider-hero wrap provider-hero-grid">
                <div>
                    <p className="eyebrow">{t('hero.eyebrow')}</p>
                    <h1>
                        <Rich text={t('hero.title')} />
                    </h1>
                    <p className="lead">
                        <Rich text={t('hero.lead')} />
                    </p>
                    <p>
                        <Rich text={t('hero.note')} />
                    </p>
                    <div className="button-row">
                        <a className="button" href={URLS.signup}>
                            {t('hero.button')}
                        </a>
                        <a className="text-button" href={URLS.login}>
                            {t('hero.login')}
                        </a>
                    </div>
                </div>
                <figure className="connect-photo" style={{ ['--photo-ratio' as string]: '4 / 3' }}>
                    <img src={t('hero.image')} alt={t('hero.image_alt')} width="1400" height="1050" />
                </figure>
            </section>

            <section className="wrap benefits">
                {[1, 2, 3].map((n) => (
                    <div key={n}>
                        <h3>{t(`benefit${n}.title`)}</h3>
                        <p>
                            <Rich text={t(`benefit${n}.body`)} />
                        </p>
                    </div>
                ))}
            </section>

            <section className="section wrap provider-details">
                <div>
                    <p className="eyebrow">{t('eligibility.eyebrow')}</p>
                    <h2>
                        <Rich text={t('eligibility.title')} />
                    </h2>
                    <p>
                        <Rich text={t('eligibility.p1')} />
                    </p>
                    <p>
                        <Rich text={t('eligibility.p2')} />
                    </p>
                    <h3>{t('eligibility.question')}</h3>
                    <p>
                        <Rich text={t('eligibility.answer')} />
                    </p>
                </div>
                <div className="application-steps">
                    <h3>{t('join.title')}</h3>
                    {[
                        ['1', t('join.step1.title'), t('join.step1.body')],
                        ['2', t('join.step2.title'), t('join.step2.body')],
                        ['3', t('join.step3.title'), t('join.step3.body')],
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
            </section>

            <section className="wrap provider-spotlight-summary" aria-labelledby="spotlight-summary-heading">
                <p className="eyebrow">{t('spotlight.eyebrow')}</p>
                <h2 id="spotlight-summary-heading">
                    <Rich text={t('spotlight.title')} />
                </h2>
                <p>
                    <Rich text={t('spotlight.body')} />
                </p>
                <Link href={URLS.spotlight}>{t('spotlight.link')}</Link>
            </section>

            <section className="closing wrap">
                <h2>
                    <Rich text={t('closing.title')} />
                </h2>
                <p>
                    <Rich text={t('closing.body')} />
                </p>
                <a className="button" href={URLS.signup}>
                    {t('closing.button')}
                </a>
                <p>
                    <Rich text={t('closing.email')} />
                </p>
            </section>
        </ConnectLayout>
    );
}
