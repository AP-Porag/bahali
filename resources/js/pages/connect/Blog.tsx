import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { CONNECT_URLS as URLS, RESOURCE_HUB_URL } from '@/components/connect/links';
import Pagination from '@/components/connect/Pagination';

/**
 * Bahali Connect blog — /blog (reference BlogPages.jsx → BlogPage, "journal" layout).
 * Articles come from Admin → Blog (published only). Search and category filters run in the browser,
 * so the words a visitor types never appear in the page address or in analytics.
 * The planned photograph is the approved "moment of connection" photo (3:2).
 */

export interface BlogCard {
    id: number;
    slug: string;
    title: string;
    category: string;
    categoryLabel: string;
    readingPaths: string[];
    summary: string;
    minutes: number;
    searchText?: string;
}

interface Props {
    posts: BlogCard[];
    featured: (BlogCard & { authorName: string | null; authorRole: string | null }) | null;
    providerStory: BlogCard | null;
}

const ALL = 'All reading';
const PER_PAGE = 8;
const CATEGORY_ORDER = [ALL, 'Taking the first step', 'Finding your fit', 'Supporting someone', 'For Providers'];
const CATEGORY_LABELS: Record<string, string> = {
    'Taking the first step': 'Considering support',
    'Finding your fit': 'Finding your way',
    'Supporting someone': 'Supporting someone',
    'For Providers': 'For Providers',
};
const PATHS: [string, string][] = [
    ['Taking the first step', 'I am considering support'],
    ['Finding your fit', 'I want to understand my options'],
    ['Supporting someone', 'I am here for someone I care about'],
];

/* Browsing position is kept in memory only (reference: blogBrowseStates) — returning from an article restores it. */
const browse: { query: string; category: string; pageNo: number; scrollY: number } = { query: '', category: ALL, pageNo: 1, scrollY: 0 };

export const articleUrl = (slug: string) => `${URLS.blog}/${slug}`;
const matchesCategory = (a: BlogCard, c: string) => (c === ALL ? a.category !== 'For Providers' : a.category === c || a.readingPaths.includes(c));
const rememberScroll = () => {
    browse.scrollY = window.scrollY;
};

export function ArticleCard({ a, fromCollection = false }: { a: BlogCard; fromCollection?: boolean }) {
    const onClick = fromCollection ? rememberScroll : undefined;

    return (
        <article className={'blog-card journal-card ' + (a.category === 'For Providers' ? 'journal-provider-card' : '')}>
            <div className="journal-card-meta">
                <p className="eyebrow">{a.categoryLabel}</p>
                <span>{a.minutes} min read</span>
            </div>
            <h3>
                <Link href={articleUrl(a.slug)} onClick={onClick}>
                    {a.title}
                </Link>
            </h3>
            <p className="blog-card-summary">{a.summary}</p>
            <div className="blog-card-bottom">
                <Link href={articleUrl(a.slug)} onClick={onClick}>
                    Read the story<span className="sr-only">: {a.title}</span>
                </Link>
            </div>
        </article>
    );
}

export default function Blog({ posts, featured, providerStory }: Props) {
    const [query, setQuery] = useState(browse.query);
    const [category, setCategory] = useState(browse.category);
    const [pageNo, setPageNo] = useState(browse.pageNo);

    useEffect(() => {
        browse.query = query;
        browse.category = category;
        browse.pageNo = pageNo;
    }, [query, category, pageNo]);

    // Back from an article → same place in the collection.
    useEffect(() => {
        const y = browse.scrollY;
        if (y) requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })));
    }, []);

    const resetPosition = () => {
        browse.scrollY = 0;
        setPageNo(1);
    };
    const selectCategory = (c: string) => {
        resetPosition();
        setCategory(c);
    };
    const choose = (c: string) => {
        selectCategory(c);
        document
            .getElementById('journal-library')
            ?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    };
    const pageTo = (n: number) => {
        setPageNo(n);
        browse.scrollY = 0;
        requestAnimationFrame(() => {
            const h = document.getElementById('journal-results-heading');
            h?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
            h?.focus({ preventScroll: true });
        });
    };

    const q = query.trim().toLowerCase();
    const filtered = posts.filter(
        (a) =>
            matchesCategory(a, category) &&
            (!q && category === ALL && featured ? a.slug !== featured.slug : true) &&
            (a.searchText ?? `${a.title} ${a.summary}`.toLowerCase()).includes(q),
    );
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const currentPage = Math.min(pageNo, totalPages || 1);
    const visible = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return (
        <ConnectLayout
            page="blog"
            title="Blog"
            description="Perspectives on support, culture and connection from Bahali Connect — for the questions you have and the next step that feels right for you."
        >
            <div className="journal-page">
                <section className="wrap journal-masthead">
                    <div className="journal-edition-line">
                        <span>THE BAHALI CONNECT BLOG</span>
                        <span>Perspectives on support, culture & connection</span>
                    </div>
                    <div className="journal-welcome">
                        <h1>
                            A place for
                            <br />
                            <em>understanding.</em>
                        </h1>
                        <div>
                            <p>For the questions you have, the words you are finding and the next step that feels right for you.</p>
                            <a href="#journal-library">Find something for you</a>
                        </div>
                    </div>
                </section>

                {featured && (
                    <section className="wrap journal-opening">
                        <article className="journal-lead-story">
                            <div className="journal-lead-top">
                                <span className="journal-kicker">A WELCOME FROM OUR FOUNDER</span>
                                <span>{featured.minutes} min read</span>
                            </div>
                            <h2>
                                <Link href={articleUrl(featured.slug)} onClick={rememberScroll}>
                                    {featured.title}
                                </Link>
                            </h2>
                            <p>{featured.summary}</p>
                            <div className="journal-lead-footer">
                                <div>
                                    {featured.authorName && <strong>{featured.authorName}</strong>}
                                    {featured.authorRole && <span>{featured.authorRole}</span>}
                                </div>
                                <Link href={articleUrl(featured.slug)} onClick={rememberScroll}>
                                    Read the welcome
                                </Link>
                            </div>
                        </article>
                        <div className="journal-visual-column">
                            <figure className="journal-image-space">
                                <img
                                    className="journal-photo"
                                    src="/images/connect/moment-of-connection.jpg"
                                    alt="Two adults sharing coffee and a relaxed conversation at home."
                                    width="1500"
                                    height="1000"
                                />
                            </figure>
                            <aside className="journal-founder-note">
                                <span className="journal-quote-mark" aria-hidden="true">
                                    “
                                </span>
                                <p className="eyebrow">A THOUGHT TO TAKE WITH YOU</p>
                                <blockquote>Being strong does not mean you have to carry everything alone.</blockquote>
                                <p className="journal-quote-credit">From our founder’s welcome</p>
                                <Link href={articleUrl(featured.slug)} onClick={rememberScroll}>
                                    A place to begin
                                </Link>
                            </aside>
                        </div>
                    </section>
                )}

                <section className="wrap journal-paths" aria-label="Choose a reading path">
                    <p>What brings you here today?</p>
                    <div>
                        {PATHS.map(([c, label]) => (
                            <button key={c} type="button" onClick={() => choose(c)}>
                                {label}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="wrap journal-library" id="journal-library">
                    <div className="editorial-section-heading">
                        <div>
                            <p className="eyebrow">READ AT YOUR OWN PACE</p>
                            <h2 id="journal-results-heading" tabIndex={-1}>
                                {category === 'For Providers' ? 'For the work you do.' : 'A little more clarity.'}
                            </h2>
                        </div>
                        <label className="journal-search">
                            Find a topic
                            <input
                                type="search"
                                placeholder="Search the articles"
                                value={query}
                                onChange={(e) => {
                                    resetPosition();
                                    setQuery(e.target.value);
                                }}
                            />
                        </label>
                    </div>
                    <div className="journal-library-tools">
                        <div className="blog-categories" role="group" aria-label="Filter articles by category">
                            {CATEGORY_ORDER.filter((c) => c === ALL || posts.some((a) => matchesCategory(a, c))).map((c) => (
                                <button type="button" key={c} aria-pressed={category === c} onClick={() => selectCategory(c)}>
                                    {c === ALL ? ALL : CATEGORY_LABELS[c]}
                                </button>
                            ))}
                        </div>
                        <p className="journal-result-count" role="status">
                            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
                        </p>
                    </div>
                    <div className="blog-card-grid journal-story-grid">
                        {visible.map((a) => (
                            <ArticleCard key={a.id} a={a} fromCollection />
                        ))}
                    </div>
                    <Pagination current={currentPage} last={totalPages} label="Article pages" onPage={pageTo} />
                    {!filtered.length && (
                        <div className="journal-empty">
                            <h3>
                                {category === 'Supporting someone' && !query
                                    ? 'Sometimes the first step is looking together.'
                                    : 'Let us try another way.'}
                            </h3>
                            <p>
                                {category === 'Supporting someone' && !query
                                    ? 'Our current guides can help you explore options alongside someone you care about. Their preferences can guide the conversation.'
                                    : 'Try a different phrase, or explore the full reading collection.'}
                            </p>
                            <button
                                type="button"
                                className="text-button"
                                onClick={() => {
                                    resetPosition();
                                    setQuery('');
                                    setCategory(ALL);
                                }}
                            >
                                Explore the reading collection
                            </button>
                        </div>
                    )}
                </section>

                <section className="wrap journal-resource-note">
                    <div className="journal-resource-symbol" aria-hidden="true">
                        <svg viewBox="0 0 48 48" fill="none">
                            <path d="M8 10c7-2 12 0 16 4 4-4 9-6 16-4v27c-7-2-12 0-16 4-4-4-9-6-16-4V10Z" />
                            <path d="M24 14v27M13 17c3-.5 5 0 7 1M13 23c3-.5 5 0 7 1M28 18c2-1 4-1.5 7-1M28 24c2-1 4-1.5 7-1" />
                        </svg>
                    </div>
                    <div>
                        <p className="eyebrow">SOMETHING PRACTICAL TO KEEP CLOSE</p>
                        <h2>Tools for everyday well-being.</h2>
                        <p>Explore Bahali’s emotional wellness guides and resources for yourself or someone you care about.</p>
                        <a href={RESOURCE_HUB_URL} target="_blank" rel="noreferrer">
                            Explore Bahali’s resources<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                    </div>
                </section>

                {providerStory && category !== 'For Providers' && (
                    <section className="wrap journal-provider-note">
                        <div>
                            <p className="eyebrow">FOR PROVIDERS</p>
                            <h2>
                                Your work matters.
                                <br />
                                Help it reach your community.
                            </h2>
                        </div>
                        <div>
                            <p>A note from our founder on joining Bahali Connect, sharing your services and making support easier to find.</p>
                            <Link href={articleUrl(providerStory.slug)} onClick={rememberScroll}>
                                Read the invitation
                            </Link>
                        </div>
                    </section>
                )}

                <section className="journal-closing">
                    <div className="wrap">
                        <div>
                            <p className="eyebrow">WHEN YOU ARE READY</p>
                            <h2>You can begin with a question.</h2>
                            <p>Explore providers, learn about their work and take time to decide.</p>
                        </div>
                        <Link href={URLS.help} className="button">
                            Find support
                        </Link>
                    </div>
                </section>
            </div>
        </ConnectLayout>
    );
}
