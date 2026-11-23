import { Link } from '@inertiajs/react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { Rich, reader, type ConnectContent } from '@/components/connect/content';
import { CONNECT_URLS as URLS } from '@/components/connect/links';
import SearchForm from '@/components/connect/SearchForm';
import { type ConnectCountry, type ConnectFilters, type ConnectTopic } from '@/components/connect/types';

/**
 * Bahali Connect homepage (reference src.jsx → Home).
 * Photographs: existing conversation + bench photos; provider invitation uses the approved
 * "providers in community" photograph (IMAGE_GUIDE.md), shared with the For Providers page.
 */

export interface ReadingCard {
    slug: string;
    title: string;
    category: string;
    excerpt: string;
    minutes: number;
}

interface Props {
    countries: ConnectCountry[];
    topics: ConnectTopic[];
    filters: ConnectFilters;
    reading?: ReadingCard[];
    content?: ConnectContent;
}

export default function Home({ countries, topics, filters, reading = [], content }: Props) {
    const t = reader(content);
    const faqs = [1, 2, 3, 4, 5].map((n) => [t(`faq${n}.q`), t(`faq${n}.a`)]).filter(([q]) => q);

    return (
        <ConnectLayout page="home" title={t('seo.title')} description={t('seo.description')}>
            <section className="hero">
                <div className="hero-grid wrap">
                    <div className="hero-copy">
                        <p className="eyebrow">{t('hero.eyebrow')}</p>
                        <h1>
                            <Rich text={t('hero.title')} />
                        </h1>
                        <p className="lead">
                            <Rich text={t('hero.lead')} />
                        </p>
                        <p className="hero-note">
                            <Rich text={t('hero.note')} />
                        </p>
                    </div>
                    <div className="hero-art">
                        <img
                            src={t('hero.image')}
                            alt={t('hero.image_alt')}
                            width="1600"
                            height="859"
                        />
                    </div>
                </div>
                <div className="wrap search-wrap" id="search">
                    <SearchForm countries={countries} topics={topics} filters={filters} text={content} />
                </div>
            </section>

            <div className="intro-strip wrap">
                <span>{t('strip.item1')}</span>
                <span>{t('strip.item2')}</span>
                <span>{t('strip.item3')}</span>
            </div>

            <section className="section wrap how how-home" id="how">
                <div className="how-heading">
                    <p className="eyebrow">{t('how.eyebrow')}</p>
                    <h2>
                        <Rich text={t('how.title')} />
                    </h2>
                </div>
                <div className="steps">
                    {[
                        ['01', t('how.step1.title'), t('how.step1.body')],
                        ['02', t('how.step2.title'), t('how.step2.body')],
                        ['03', t('how.step3.title'), t('how.step3.body')],
                    ].map(([n, t, b]) => (
                        <div className="step" key={n}>
                            <span className="step-number">{n}</span>
                            <div>
                                <h3>{t}</h3>
                                <p>
                                    <Rich text={b} />
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <figure className="community-photo">
                    <figcaption>{t('how.caption')}</figcaption>
                    <img
                        src={t('how.image')}
                        alt={t('how.image_alt')}
                        width="1400"
                        height="934"
                        loading="lazy"
                    />
                </figure>
            </section>

            <section className="options-section" id="about">
                <div className="wrap">
                    <div className="options-top">
                        <p className="eyebrow">{t('options.eyebrow')}</p>
                        <h2>
                            <Rich text={t('options.title')} />
                        </h2>
                        <p>
                            <Rich text={t('options.body')} />
                        </p>
                    </div>
                    <div className="option-grid">
                        {[
                            [t('options.card1.title'), t('options.card1.body')],
                            [t('options.card2.title'), t('options.card2.body')],
                        ].map(([title, b], n) => (
                            <div key={n}>
                                <h3>{title}</h3>
                                <p>
                                    <Rich text={b} />
                                </p>
                            </div>
                        ))}
                    </div>
                    <details className="review-details">
                        <summary>
                            {t('badges.summary')} <span aria-hidden="true">＋</span>
                        </summary>
                        <div>
                            <p>
                                <Rich text={t('badges.body')} />
                            </p>
                            <Link className="light-link" href={URLS.directory}>
                                {t('badges.link')}
                            </Link>
                        </div>
                    </details>
                </div>
            </section>

            {/* Published articles marked "Show on homepage" in Admin → Blog (hidden when there are none). */}
            {reading.length > 0 && (
                <section className="home-reading">
                    <div className="wrap">
                        <div className="editorial-section-heading">
                            <div>
                                <p className="eyebrow">{t('reading.eyebrow')}</p>
                                <h2>
                                    <Rich text={t('reading.title')} />
                                </h2>
                            </div>
                            <Link href={URLS.blog}>{t('reading.link')}</Link>
                        </div>
                        <div className="home-reading-grid">
                            {reading.map((a) => (
                                <article className="blog-card journal-card" key={a.slug}>
                                    <div className="journal-card-meta">
                                        <p className="eyebrow">{a.category}</p>
                                        <span>
                                            {a.minutes} {t('reading.minutes')}
                                        </span>
                                    </div>
                                    <h3>
                                        <Link href={`${URLS.blog}/${a.slug}`}>{a.title}</Link>
                                    </h3>
                                    <p className="blog-card-summary">{a.excerpt}</p>
                                    <div className="blog-card-bottom">
                                        <Link href={`${URLS.blog}/${a.slug}`}>
                                            {t('reading.more')}
                                            <span className="sr-only">: {a.title}</span>
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="section wrap provider-band">
                <div>
                    <p className="eyebrow">{t('providers.eyebrow')}</p>
                    <h2>
                        <Rich text={t('providers.title')} />
                    </h2>
                    <p>
                        <Rich text={t('providers.body')} />
                    </p>
                    <p className="bold-note">{t('providers.note')}</p>
                    <div className="button-row">
                        <Link className="button" href={URLS.providers}>
                            {t('providers.button')}
                        </Link>
                        <a className="text-button" href={URLS.login}>
                            {t('providers.login')}
                        </a>
                    </div>
                </div>
                <figure className="connect-photo" style={{ ['--photo-ratio' as string]: '4 / 3' }}>
                    <img
                        src={t('providers.image')}
                        alt={t('providers.image_alt')}
                        width="1400"
                        height="1050"
                        loading="lazy"
                    />
                </figure>
            </section>

            <section className="faq-section">
                <div className="wrap faq-grid">
                    <div>
                        <p className="eyebrow">{t('faq.eyebrow')}</p>
                        <h2>
                            <Rich text={t('faq.title')} />
                        </h2>
                        <p>
                            <Rich text={t('faq.body')} />
                        </p>
                    </div>
                    <div>
                        {faqs.map(([q, a]) => (
                            <details name="connect-faq" key={q}>
                                <summary>
                                    {q}
                                    <span aria-hidden="true">＋</span>
                                </summary>
                                <p>
                                    <Rich text={a} />
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <section className="closing wrap">
                <p className="eyebrow">{t('closing.eyebrow')}</p>
                <h2>
                    <Rich text={t('closing.title')} />
                </h2>
                <button
                    type="button"
                    className="button"
                    onClick={() => {
                        document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
                        document.getElementById('home-country')?.focus({ preventScroll: true });
                    }}
                >
                    {t('closing.button')}
                </button>
            </section>
        </ConnectLayout>
    );
}
