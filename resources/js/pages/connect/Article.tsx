import { Head, Link, router } from '@inertiajs/react';
import { useState, type MouseEvent } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { CONNECT_URLS as URLS } from '@/components/connect/links';

import { ArticleCard, type BlogCard } from './Blog';

/**
 * Bahali Connect article — /blog/{slug} (reference BlogPages.jsx → ArticlePage, "story" layout).
 * The body is written in Admin → Blog as Markdown and rendered safely on the server (BlogRenderer):
 * opening paragraphs, "## " sections (listed under "In this article"), steps, notes, lists and photos.
 */

interface Section {
    id: string;
    title: string;
    html: string;
}

interface Post {
    slug: string;
    title: string;
    category: string;
    summary: string;
    provider: boolean;
    authorName: string | null;
    authorRole: string | null;
    authorInitials: string;
    reviewerName: string | null;
    reviewedAt: string | null;
    publishedAt: string;
    publishedLabel: string;
    minutes: number;
    image: string | null;
    imageAlt: string | null;
    opening: string;
    sections: Section[];
    marginQuote: string | null;
    ctaLabel: string;
    ctaUrl: string;
    signoff: string;
    signature: string;
    seoTitle: string;
    seoDescription: string;
}

const modified = (e: MouseEvent) => e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0;

export default function Article({ post, related }: { post: Post; related: BlogCard[] }) {
    const [copied, setCopied] = useState('');
    const [tocOpen] = useState(() => typeof window === 'undefined' || window.matchMedia('(min-width: 701px)').matches);

    const jump = (e: MouseEvent, id: string) => {
        if (modified(e)) return;
        e.preventDefault();
        const h = document.getElementById(id);
        if (!h) return;
        const offset = (document.querySelector('.bc-connect header')?.getBoundingClientRect().height || 0) + 24;
        window.history.replaceState(window.history.state, '', '#' + id);
        window.scrollTo({ top: window.scrollY + h.getBoundingClientRect().top - offset, behavior: 'instant' as ScrollBehavior });
        h.focus({ preventScroll: true });
    };

    // Links written inside the article: site pages open without a full reload; files and new-tab links behave normally.
    const bodyClick = (e: MouseEvent<HTMLElement>) => {
        if (e.defaultPrevented || modified(e)) return;
        const link = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null;
        const href = link?.getAttribute('href');
        if (!link || !href || link.target || link.hasAttribute('download')) return;
        if (href.startsWith('/') && !href.startsWith('//') && !/^\/(storage|images|build)\//.test(href)) {
            e.preventDefault();
            router.visit(href);
        }
    };

    const copyLink = async () => {
        try {
            const url = new URL(window.location.href);
            url.hash = '';
            await navigator.clipboard.writeText(url.href);
            setCopied('Article link copied.');
        } catch {
            setCopied('Copy the article address from your browser to share it.');
        }
    };

    const ctaInternal = post.ctaUrl.startsWith('/');

    return (
        <ConnectLayout page="blog" title={post.seoTitle} description={post.seoDescription}>
            <Head>
                <link head-key="canonical" rel="canonical" href={typeof window === 'undefined' ? '' : window.location.origin + `${URLS.blog}/${post.slug}`} />
            </Head>

            <div className="story-page">
                <section className="story-cover">
                    <div className="wrap">
                        <div className="story-masthead">
                            <span>THE BAHALI CONNECT BLOG</span>
                            <Link href={URLS.blog} preserveScroll>
                                Back to the collection
                            </Link>
                        </div>
                        <div className="story-cover-grid">
                            <div className="story-title-block">
                                <p className="eyebrow">{post.category}</p>
                                <h1>{post.title}</h1>
                                <p className="story-deck">{post.summary}</p>
                            </div>
                            <aside className="story-byline" aria-label="Article author and publication information">
                                <div className="story-author-monogram" aria-hidden="true">
                                    {post.authorInitials}
                                </div>
                                <p className="eyebrow">WRITTEN BY</p>
                                <p className="story-author-name">{post.authorName || 'Bahali Connect'}</p>
                                <p className="story-author-role">{post.authorRole || 'Bahali Connect'}</p>
                                <div className="story-publication">
                                    <time dateTime={post.publishedAt}>{post.publishedLabel}</time>
                                    <span>{post.minutes} min read</span>
                                </div>
                                {post.reviewerName && (
                                    <p className="story-pace">
                                        Reviewed by {post.reviewerName}
                                        {post.reviewedAt ? `, ${post.reviewedAt}` : ''}.
                                    </p>
                                )}
                                <p className="story-pace">Read at your own pace.</p>
                            </aside>
                        </div>
                    </div>
                </section>

                <div className="wrap story-layout">
                    <aside className="story-sidebar">
                        {post.sections.length > 0 && (
                            <details className="story-toc" open={tocOpen}>
                                <summary>
                                    <span>In this article</span>
                                    <span className="contents-chevron" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </span>
                                </summary>
                                <nav aria-label="Article sections">
                                    {post.sections.map((s) => (
                                        <a key={s.id} href={'#' + s.id} onClick={(e) => jump(e, s.id)}>
                                            {s.title}
                                        </a>
                                    ))}
                                </nav>
                            </details>
                        )}
                        <div className="story-share">
                            <button type="button" onClick={copyLink}>
                                Copy article link
                            </button>
                            <p role="status">{copied}</p>
                        </div>
                        {post.marginQuote && (
                            <div className="story-margin-note">
                                <span aria-hidden="true">“</span>
                                <blockquote>{post.marginQuote}</blockquote>
                                <p>A thought to keep close</p>
                            </div>
                        )}
                    </aside>

                    <article className="article-body story-body" onClick={bodyClick}>
                        {post.opening && <div className="story-opening" dangerouslySetInnerHTML={{ __html: post.opening }} />}
                        {post.image && (
                            <figure className="story-body-photo">
                                <img src={post.image} alt={post.imageAlt || ''} loading="lazy" />
                            </figure>
                        )}
                        {post.sections.map((s) => (
                            <section className="story-section" key={s.id}>
                                <h2 id={s.id} tabIndex={-1}>
                                    {s.title}
                                </h2>
                                <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: s.html }} />
                            </section>
                        ))}
                        <div className="story-next-step">
                            <div>
                                <p className="eyebrow">{post.provider ? 'JOIN THE COMMUNITY' : 'WHEN YOU ARE READY'}</p>
                                <h2>{post.provider ? 'Help your community find your work.' : 'A next step, at your pace.'}</h2>
                            </div>
                            {ctaInternal ? (
                                <Link href={post.ctaUrl} className="button">
                                    {post.ctaLabel}
                                </Link>
                            ) : (
                                <a href={post.ctaUrl} className="button" target="_blank" rel="noreferrer">
                                    {post.ctaLabel}
                                    <span className="sr-only"> (opens in a new tab)</span>
                                </a>
                            )}
                        </div>
                        <div className="story-signoff">
                            <p>{post.signoff}</p>
                            <p className="story-signature">{post.signature}</p>
                            <p>
                                <em>Bahali Connect is an initiative of Bahali Inc.</em>
                            </p>
                        </div>
                    </article>
                </div>

                {related.length > 0 && (
                    <section className="wrap story-related">
                        <div className="editorial-section-heading">
                            <div>
                                <p className="eyebrow">KEEP EXPLORING</p>
                                <h2>A little more understanding.</h2>
                            </div>
                            <Link href={URLS.blog}>Explore the collection</Link>
                        </div>
                        <div className="blog-card-grid">
                            {related.map((b) => (
                                <ArticleCard key={b.id} a={b} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </ConnectLayout>
    );
}
