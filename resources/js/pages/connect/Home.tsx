import { Link } from '@inertiajs/react';

import ConnectLayout from '@/components/connect/ConnectLayout';
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

const FAQS: [string, string][] = [
    [
        'Is Bahali Connect free to use?',
        'Yes. It is always free to search the directory, read profiles and contact providers directly. Only providers can create an account. Providers may charge for their own services.',
    ],
    [
        'How do I choose a provider?',
        'Start with what matters most to you. You might want someone who understands your background, speaks your preferred language or offers sessions you can afford. If a profile feels like a good fit, you can reach out and ask, “What would it be like to work with you?”',
    ],
    [
        'Can I find virtual support?',
        'Yes. Choose the country or territory where you will be during your sessions, then select virtual support. Before booking, check with the provider that they offer virtual sessions in that location.',
    ],
    [
        'How do I contact a provider?',
        'You will find contact details on each profile. You can reach out to ask questions before deciding whether to arrange a meeting. You and the provider agree on any appointment directly.',
    ],
    ['What if I cannot find a match?', 'Try fewer filters or a related area of support. Your selected location stays the same until you change it.'],
];

interface Props {
    countries: ConnectCountry[];
    topics: ConnectTopic[];
    filters: ConnectFilters;
    reading?: ReadingCard[];
}

export default function Home({ countries, topics, filters, reading = [] }: Props) {
    return (
        <ConnectLayout
            page="home"
            title="Find support. Feel understood."
            description="Find mental health and emotional wellness providers serving Caribbean communities and the diaspora. Search is free."
        >
            <section className="hero">
                <div className="hero-grid wrap">
                    <div className="hero-copy">
                        <p className="eyebrow">SUPPORT STARTS WITH CONNECTION</p>
                        <h1>
                            Find support.
                            <br />
                            Feel <em>understood.</em>
                        </h1>
                        <p className="lead">
                            Explore providers offering mental health care and community support for Caribbean communities and the diaspora.
                        </p>
                        <p className="hero-note">
                            For you, your family or someone you care about. It is okay to ask for support, even if you are not sure where to start.
                        </p>
                    </div>
                    <div className="hero-art">
                        <img
                            src="/images/connect/support-conversation.jpg"
                            alt="Two women in conversation, with one listening attentively."
                            width="1600"
                            height="859"
                        />
                    </div>
                </div>
                <div className="wrap search-wrap" id="search">
                    <SearchForm countries={countries} topics={topics} filters={filters} />
                </div>
            </section>

            <div className="intro-strip wrap">
                <span>Free to browse</span>
                <span>Search without sharing your name.</span>
                <span>Contact providers directly</span>
            </div>

            <section className="section wrap how how-home" id="how">
                <div className="how-heading">
                    <p className="eyebrow">HOW BAHALI CONNECT WORKS</p>
                    <h2>A clearer path to support.</h2>
                </div>
                <div className="steps">
                    {[
                        ['01', 'Find options', 'Choose your location and what you would like help with.'],
                        ['02', 'Explore profiles', 'Compare services, languages, fees and meeting options at your own pace.'],
                        ['03', 'Make a connection', 'Reach out to ask about availability and next steps.'],
                    ].map(([n, t, b]) => (
                        <div className="step" key={n}>
                            <span className="step-number">{n}</span>
                            <div>
                                <h3>{t}</h3>
                                <p>{b}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <figure className="community-photo">
                    <figcaption>Support can begin with a conversation.</figcaption>
                    <img
                        src="/images/connect/community-connection.jpg"
                        alt="Two older women smiling together on a bench."
                        width="1400"
                        height="934"
                        loading="lazy"
                    />
                </figure>
            </section>

            <section className="options-section" id="about">
                <div className="wrap">
                    <div className="options-top">
                        <p className="eyebrow">UNDERSTANDING YOUR OPTIONS</p>
                        <h2>
                            Different needs.
                            <br />
                            Different ways to find support.
                        </h2>
                        <p>Support can take different forms. Explore what each provider offers and choose whom you would like to learn more about.</p>
                    </div>
                    <div className="option-grid">
                        {[
                            ['Clinical & counseling support', 'Explore therapy, counseling and assessment services.'],
                            ['Community-based support', 'Explore peer, pastoral and other community-based emotional wellness support.'],
                        ].map(([t, b]) => (
                            <div key={t}>
                                <h3>{t}</h3>
                                <p>{b}</p>
                            </div>
                        ))}
                    </div>
                    <details className="review-details">
                        <summary>
                            What do the profile badges mean? <span aria-hidden="true">＋</span>
                        </summary>
                        <div>
                            <p>
                                Profile review means Bahali has reviewed a listing. Optional credential verification is in development. Only profiles
                                with a credential independently confirmed by Bahali will receive the “Credentials verified” badge. Caribbean
                                experience is provider-reported. A badge does not guarantee that a provider is the right fit for you.
                            </p>
                            <Link className="light-link" href={URLS.directory}>
                                Understand the profile badges
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
                                <p className="eyebrow">A LITTLE READING. A LITTLE REASSURANCE.</p>
                                <h2>Start with understanding.</h2>
                            </div>
                            <Link href={URLS.blog}>Explore the blog</Link>
                        </div>
                        <div className="home-reading-grid">
                            {reading.map((a) => (
                                <article className="blog-card journal-card" key={a.slug}>
                                    <div className="journal-card-meta">
                                        <p className="eyebrow">{a.category}</p>
                                        <span>{a.minutes} min read</span>
                                    </div>
                                    <h3>
                                        <Link href={`${URLS.blog}/${a.slug}`}>{a.title}</Link>
                                    </h3>
                                    <p className="blog-card-summary">{a.excerpt}</p>
                                    <div className="blog-card-bottom">
                                        <Link href={`${URLS.blog}/${a.slug}`}>
                                            Read the story<span className="sr-only">: {a.title}</span>
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
                    <p className="eyebrow">FOR PROVIDERS</p>
                    <h2>Help your community find support.</h2>
                    <p>Join a directory that welcomes eligible clinical and community-based providers from all backgrounds.</p>
                    <p className="bold-note">No directory listing fee.</p>
                    <div className="button-row">
                        <Link className="button" href={URLS.providers}>
                            Join Bahali Connect
                        </Link>
                        <a className="text-button" href={URLS.login}>
                            Provider login
                        </a>
                    </div>
                </div>
                <figure className="connect-photo" style={{ ['--photo-ratio' as string]: '4 / 3' }}>
                    <img
                        src="/images/connect/providers-in-community.jpg"
                        alt="Two women talking over coffee in a relaxed seating area."
                        width="1400"
                        height="1050"
                        loading="lazy"
                    />
                </figure>
            </section>

            <section className="faq-section">
                <div className="wrap faq-grid">
                    <div>
                        <p className="eyebrow">A LITTLE MORE CLARITY</p>
                        <h2>
                            Questions?
                            <br /> Start here.
                        </h2>
                        <p>Finding support should feel easier.</p>
                    </div>
                    <div>
                        {FAQS.map(([q, a]) => (
                            <details name="connect-faq" key={q}>
                                <summary>
                                    {q}
                                    <span aria-hidden="true">＋</span>
                                </summary>
                                <p>{a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <section className="closing wrap">
                <p className="eyebrow">BAHALI CONNECT</p>
                <h2>You do not need all the answers to begin.</h2>
                <button
                    type="button"
                    className="button"
                    onClick={() => {
                        document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
                        document.getElementById('home-country')?.focus({ preventScroll: true });
                    }}
                >
                    Find support
                </button>
            </section>
        </ConnectLayout>
    );
}
