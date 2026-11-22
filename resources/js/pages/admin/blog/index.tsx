import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

/**
 * Admin → CMS → Blog. Lists every article with its workflow status.
 * Only "Published" (or "Scheduled" once its time has passed) articles appear on /blog.
 */

interface PostRow {
    id: number;
    title: string;
    slug: string;
    category: string;
    status: string;
    statusLabel: string;
    live: boolean;
    publishedAt: string | null;
    updatedAt: string | null;
    isFeatured: boolean;
    onHomepage: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Website', href: '/admin/blog' },
    { title: 'Blog', href: '/admin/blog' },
];

const STATUS_TONE: Record<string, string> = {
    draft: 'bg-[#EFEAE0] text-[#5B6B6E]',
    in_review: 'bg-[#FDF1D8] text-[#8A5A00]',
    approved: 'bg-[#E4F1EC] text-[#1F6B50]',
    scheduled: 'bg-[#E6EEF8] text-[#2D5B8A]',
    published: 'bg-[#0E7C7B] text-white',
    archived: 'bg-[#F3E1DC] text-[#8A3B2B]',
};

const FILTERS: [string, string][] = [
    ['all', 'All'],
    ['draft', 'Draft'],
    ['in_review', 'In review'],
    ['approved', 'Approved'],
    ['scheduled', 'Scheduled'],
    ['published', 'Published'],
    ['archived', 'Archived'],
];

export default function BlogIndex({ posts }: { posts: PostRow[] }) {
    const [filter, setFilter] = useState('all');
    const [confirming, setConfirming] = useState<number | null>(null);

    const counts = useMemo(() => {
        const c: Record<string, number> = { all: posts.length };
        posts.forEach((p) => (c[p.status] = (c[p.status] || 0) + 1));
        return c;
    }, [posts]);
    const rows = filter === 'all' ? posts : posts.filter((p) => p.status === filter);

    const destroy = (id: number) =>
        router.delete(`/admin/blog/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setConfirming(null);
                toast.success('Article deleted.');
            },
        });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog — Articles" />

            <div className="m-4 rounded-xl bg-[#F7F3EC] px-5 py-10 sm:px-8 lg:py-14">
                <div className="mx-auto max-w-5xl">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0E7C7B]">Website Content</p>
                            <h1 className="mt-2 font-serif text-4xl text-[#16302F]">Blog</h1>
                            <p className="mt-2 max-w-xl text-[15px] text-[#5B6B6E]">
                                Write, review and publish Bahali Connect articles. Only published articles are visible on the public blog.
                            </p>
                        </div>
                        <div className="flex shrink-0 gap-2 self-start sm:self-auto">
                            <a
                                href="/blog"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-[#0E7C7B]/30 bg-white px-4 py-2 text-sm font-medium text-[#0E7C7B] shadow-sm transition hover:border-[#0E7C7B]"
                            >
                                View blog
                            </a>
                            <Link
                                href="/admin/blog/create"
                                className="inline-flex items-center gap-2 rounded-full bg-[#0E7C7B] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#0B6564]"
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                                </svg>
                                New article
                            </Link>
                        </div>
                    </div>

                    {/* Status filter */}
                    <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
                        {FILTERS.map(([key, label]) => (
                            <button
                                key={key}
                                type="button"
                                aria-pressed={filter === key}
                                onClick={() => setFilter(key)}
                                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                                    filter === key ? 'bg-[#16302F] text-white' : 'bg-white text-[#16302F] ring-1 ring-[#E7E0D2] hover:ring-[#0E7C7B]'
                                }`}
                            >
                                {label}
                                <span className="ml-1.5 opacity-70">{counts[key] || 0}</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 space-y-3">
                        {rows.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-[#D9D0BF] bg-white px-6 py-12 text-center text-[15px] text-[#5B6B6E]">
                                No articles here yet.
                            </div>
                        )}

                        {rows.map((p) => (
                            <div
                                key={p.id}
                                className="flex flex-col gap-4 rounded-2xl border border-[#E7E0D2] bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_TONE[p.status] ?? STATUS_TONE.draft}`}>
                                            {p.statusLabel}
                                        </span>
                                        {p.status === 'scheduled' && !p.live && <span className="text-xs text-[#2D5B8A]">Goes live {p.publishedAt}</span>}
                                        {p.isFeatured && (
                                            <span className="rounded-full bg-[#FBE7DF] px-2.5 py-0.5 text-xs font-semibold text-[#B44A2B]">Featured</span>
                                        )}
                                        {p.onHomepage && (
                                            <span className="rounded-full bg-[#EFEAE0] px-2.5 py-0.5 text-xs font-semibold text-[#5B6B6E]">Homepage</span>
                                        )}
                                        <span className="text-xs text-[#9AA6A4]">{p.category}</span>
                                    </div>
                                    <Link href={`/admin/blog/${p.id}/edit`} className="mt-2 block font-serif text-xl text-[#16302F] hover:text-[#0E7C7B]">
                                        {p.title}
                                    </Link>
                                    <p className="mt-1 truncate text-sm text-[#6B7A78]">
                                        /blog/{p.slug}
                                        {p.updatedAt && <span className="ml-2 text-[#9AA6A4]">· Updated {p.updatedAt}</span>}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    {confirming === p.id ? (
                                        <>
                                            <span className="text-sm text-[#8A3B2B]">Delete this article?</span>
                                            <button
                                                type="button"
                                                onClick={() => destroy(p.id)}
                                                className="cursor-pointer rounded-full bg-[#B44A2B] px-3.5 py-1.5 text-sm font-medium text-white hover:bg-[#963C22]"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setConfirming(null)}
                                                className="cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium text-[#5B6B6E] hover:bg-[#EFEAE0]"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {p.live && (
                                                <a
                                                    href={`/blog/${p.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-full px-3 py-1.5 text-sm font-medium text-[#0E7C7B] hover:bg-[#E4F1EC]"
                                                >
                                                    View
                                                </a>
                                            )}
                                            <Link
                                                href={`/admin/blog/${p.id}/edit`}
                                                className="rounded-full border border-[#0E7C7B]/30 px-3.5 py-1.5 text-sm font-medium text-[#0E7C7B] transition hover:border-[#0E7C7B] hover:bg-[#0E7C7B] hover:text-white"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => setConfirming(p.id)}
                                                className="cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium text-[#8A3B2B] hover:bg-[#F3E1DC]"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
