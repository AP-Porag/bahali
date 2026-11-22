import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { toast } from 'sonner';

import '../../../../css/connect.css';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

/**
 * Admin → CMS → Blog → New / Edit article.
 * The body is Markdown: "## " = section (listed under "In this article"), "### " = step, "> " = important note,
 * "- " / "1. " = list, ![description](image "caption") = photo. The preview uses the same safe server rendering
 * and the same styles as the public article page.
 */

interface PostForm {
    id: number | null;
    title: string;
    slug: string;
    summary: string;
    category: string;
    reading_paths: string[];
    body: string;
    image: string | null;
    image_alt: string;
    author_name: string;
    author_role: string;
    reviewer_name: string;
    reviewed_at: string;
    margin_quote: string;
    cta_label: string;
    cta_url: string;
    signoff: string;
    signature: string;
    related_post_ids: number[];
    is_featured: boolean;
    on_homepage: boolean;
    seo_title: string;
    seo_description: string;
    status: string;
    published_at: string;
    live: boolean;
}

interface Option {
    value: string;
    label: string;
}

interface Props {
    post: PostForm;
    categories: Option[];
    statuses: Option[];
    otherPosts: { id: number; title: string; status: string }[];
}

interface Preview {
    opening: string;
    sections: { id: string; title: string; html: string }[];
    minutes: number;
}

const input =
    'mt-1.5 w-full rounded-xl border border-[#E1D8C7] bg-white px-3.5 py-2.5 text-[15px] text-[#1F2A2E] shadow-sm outline-none transition placeholder:text-[#A9B3B1] focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/15';
const labelCls = 'block text-sm font-medium text-[#16302F]';
const hintCls = 'mt-1 text-xs text-[#7A8886]';

const toForm = (p: PostForm) => ({
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    category: p.category,
    reading_paths: p.reading_paths,
    body: p.body,
    image_file: null as File | null,
    remove_image: false,
    image_alt: p.image_alt,
    author_name: p.author_name,
    author_role: p.author_role,
    reviewer_name: p.reviewer_name,
    reviewed_at: p.reviewed_at,
    margin_quote: p.margin_quote,
    cta_label: p.cta_label,
    cta_url: p.cta_url,
    signoff: p.signoff,
    signature: p.signature,
    related_post_ids: p.related_post_ids,
    is_featured: p.is_featured,
    on_homepage: p.on_homepage,
    seo_title: p.seo_title,
    seo_description: p.seo_description,
    status: p.status,
    published_at: p.published_at,
});

/* Laravel accepts the XSRF-TOKEN cookie (always fresh) or the page's csrf meta tag. */
function csrfHeaders(): Record<string, string> {
    const cookie = document.cookie.split('; ').find((c) => c.startsWith('XSRF-TOKEN='));
    if (cookie) return { 'X-XSRF-TOKEN': decodeURIComponent(cookie.split('=')[1]) };
    return { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '' };
}

function Card({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
    return (
        <section className="rounded-2xl border border-[#E7E0D2] bg-white px-5 py-6 shadow-sm sm:px-6">
            <h2 className="font-serif text-xl text-[#16302F]">{title}</h2>
            {description && <p className="mt-1 text-sm text-[#6B7A78]">{description}</p>}
            <div className="mt-4 space-y-4">{children}</div>
        </section>
    );
}

function FieldError({ message }: { message?: string }) {
    return message ? <p className="mt-1 text-sm text-[#B44A2B]">{message}</p> : null;
}

export default function BlogForm({ post, categories, statuses, otherPosts }: Props) {
    const form = useForm(toForm(post));
    const { data, setData, errors, processing } = form;
    const body = useRef<HTMLTextAreaElement>(null);
    const [tab, setTab] = useState<'write' | 'preview'>('write');
    const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [preview, setPreview] = useState<Preview | null>(null);
    const [previewError, setPreviewError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const isNew = !post.id;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Blog', href: '/admin/blog' },
        { title: isNew ? 'New article' : 'Edit article', href: isNew ? '/admin/blog/create' : `/admin/blog/${post.id}/edit` },
    ];

    // Local preview of a newly chosen featured photo.
    useEffect(() => {
        if (!data.image_file) return setPhotoPreview(null);
        const url = URL.createObjectURL(data.image_file);
        setPhotoPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [data.image_file]);

    const loadPreview = async () => {
        setTab('preview');
        setPreviewError('');
        try {
            const res = await fetch('/admin/blog/preview', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...csrfHeaders() },
                body: JSON.stringify({ body: data.body }),
            });
            if (!res.ok) throw new globalThis.Error(String(res.status));
            setPreview(await res.json());
        } catch {
            setPreviewError('The preview could not be loaded. Please try again.');
        }
    };

    /* Markdown toolbar — wraps the selection or inserts at the cursor. */
    const insert = (before: string, after = '', placeholder = '', block = false) => {
        const el = body.current;
        if (!el) return;
        const { selectionStart: s, selectionEnd: e, value } = el;
        const selected = value.slice(s, e) || placeholder;
        const lead = block && s > 0 && value[s - 1] !== '\n' ? '\n\n' : '';
        const trail = block && e < value.length && value[e] !== '\n' ? '\n\n' : '';
        const next = value.slice(0, s) + lead + before + selected + after + trail + value.slice(e);
        setData('body', next);
        requestAnimationFrame(() => {
            el.focus();
            const start = s + lead.length + before.length;
            el.setSelectionRange(start, start + selected.length);
        });
    };

    const uploadBodyImage = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('image', file);
            const res = await fetch('/admin/blog/upload-image', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...csrfHeaders() },
                body: fd,
            });
            const json = await res.json();
            if (!res.ok) throw new globalThis.Error(json?.errors?.image?.[0] || json?.message || 'Upload failed');
            insert('![', `](${json.url} "Caption under the photo")`, 'Describe the photo for people who cannot see it', true);
        } catch (err) {
            toast.error(err instanceof globalThis.Error ? err.message : 'The image could not be uploaded.');
        } finally {
            setUploading(false);
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.transform((d) => ({ ...d, ...(isNew ? {} : { _method: 'put' }) }));
        form.post(isNew ? '/admin/blog' : `/admin/blog/${post.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const fresh = toForm((page.props as unknown as Props).post);
                form.setDefaults(fresh);
                setData(fresh);
                toast.success('Article saved.');
            },
            onError: () => toast.error('Please check the highlighted fields.'),
        });
    };

    const togglePath = (value: string) =>
        setData('reading_paths', data.reading_paths.includes(value) ? data.reading_paths.filter((v) => v !== value) : [...data.reading_paths, value]);
    const toggleRelated = (id: number) =>
        setData('related_post_ids', data.related_post_ids.includes(id) ? data.related_post_ids.filter((v) => v !== id) : [...data.related_post_ids, id]);

    const currentPhoto = photoPreview || (!data.remove_image ? post.image : null);
    const bodyErrors = errors as Record<string, string | undefined>;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isNew ? 'New article — Blog' : `${post.title} — Blog`} />

            <form onSubmit={submit} className="m-4 rounded-xl bg-[#F7F3EC] px-5 py-10 sm:px-8 lg:py-14">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                            <Link href="/admin/blog" className="text-sm font-medium text-[#0E7C7B] hover:underline">
                                ← All articles
                            </Link>
                            <h1 className="mt-2 font-serif text-4xl text-[#16302F]">{isNew ? 'New article' : 'Edit article'}</h1>
                            {!isNew && (
                                <p className="mt-2 text-[15px] text-[#5B6B6E]">
                                    {post.live ? 'This article is live on the blog.' : 'This article is not visible to visitors.'}
                                </p>
                            )}
                        </div>
                        <div className="flex shrink-0 gap-2 self-start sm:self-auto">
                            {post.live && (
                                <a
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center rounded-full border border-[#0E7C7B]/30 bg-white px-4 py-2 text-sm font-medium text-[#0E7C7B] shadow-sm transition hover:border-[#0E7C7B]"
                                >
                                    View live article
                                </a>
                            )}
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex cursor-pointer items-center rounded-full bg-[#0E7C7B] px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#0B6564] disabled:cursor-wait disabled:opacity-60"
                            >
                                {processing ? 'Saving…' : 'Save article'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                        {/* Main column */}
                        <div className="min-w-0 space-y-6">
                            <Card title="Article">
                                <div>
                                    <label className={labelCls} htmlFor="title">
                                        Title
                                    </label>
                                    <input id="title" className={input} value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                    <FieldError message={errors.title} />
                                </div>
                                <div>
                                    <label className={labelCls} htmlFor="slug">
                                        Page address
                                    </label>
                                    <div className="mt-1.5 flex items-center overflow-hidden rounded-xl border border-[#E1D8C7] bg-white shadow-sm focus-within:border-[#0E7C7B] focus-within:ring-2 focus-within:ring-[#0E7C7B]/15">
                                        <span className="shrink-0 bg-[#F7F3EC] px-3 py-2.5 text-sm text-[#7A8886]">/blog/</span>
                                        <input
                                            id="slug"
                                            className="min-w-0 flex-1 px-3 py-2.5 text-[15px] outline-none"
                                            value={data.slug}
                                            placeholder="created-from-the-title"
                                            onChange={(e) => setData('slug', e.target.value)}
                                        />
                                    </div>
                                    <p className={hintCls}>
                                        Leave blank to create it from the title.
                                        {!isNew && ' If you change it, the old address keeps working and redirects here.'}
                                    </p>
                                    <FieldError message={errors.slug} />
                                </div>
                                <div>
                                    <label className={labelCls} htmlFor="summary">
                                        Summary
                                    </label>
                                    <textarea
                                        id="summary"
                                        rows={3}
                                        className={input}
                                        value={data.summary}
                                        onChange={(e) => setData('summary', e.target.value)}
                                    />
                                    <p className={hintCls}>Shown on article cards and under the article title.</p>
                                    <FieldError message={errors.summary} />
                                </div>
                            </Card>

                            {/* Body editor */}
                            <section className="rounded-2xl border border-[#E7E0D2] bg-white shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEAE0] px-5 py-3 sm:px-6">
                                    <div className="flex gap-1" role="tablist">
                                        {(['write', 'preview'] as const).map((t) => (
                                            <button
                                                key={t}
                                                type="button"
                                                role="tab"
                                                aria-selected={tab === t}
                                                onClick={() => (t === 'preview' ? loadPreview() : setTab('write'))}
                                                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition ${
                                                    tab === t ? 'bg-[#16302F] text-white' : 'text-[#16302F] hover:bg-[#EFEAE0]'
                                                }`}
                                            >
                                                {t === 'write' ? 'Write' : 'Preview'}
                                            </button>
                                        ))}
                                    </div>
                                    {tab === 'write' ? (
                                        <div className="flex flex-wrap gap-1">
                                            {[
                                                ['Section', () => insert('## ', '', 'Section heading', true)],
                                                ['Step', () => insert('### ', '', 'Step heading', true)],
                                                ['Bold', () => insert('**', '**', 'bold text')],
                                                ['Italic', () => insert('*', '*', 'italic text')],
                                                ['Link', () => insert('[', '](/get-help)', 'link text')],
                                                ['List', () => insert('- ', '', 'List item', true)],
                                                ['Numbered', () => insert('1. ', '', 'First item', true)],
                                                ['Note', () => insert('> ', '', 'Important note', true)],
                                            ].map(([label, run]) => (
                                                <button
                                                    key={label as string}
                                                    type="button"
                                                    onClick={run as () => void}
                                                    className="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold text-[#16302F] ring-1 ring-[#E7E0D2] hover:bg-[#F7F3EC]"
                                                >
                                                    {label as string}
                                                </button>
                                            ))}
                                            <label className="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold text-[#0E7C7B] ring-1 ring-[#0E7C7B]/30 hover:bg-[#E4F1EC]">
                                                {uploading ? 'Uploading…' : 'Photo'}
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    className="sr-only"
                                                    disabled={uploading}
                                                    onChange={(e) => {
                                                        const f = e.target.files?.[0];
                                                        if (f) uploadBodyImage(f);
                                                        e.target.value = '';
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex gap-1">
                                            {(['desktop', 'mobile'] as const).map((d) => (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    aria-pressed={device === d}
                                                    onClick={() => setDevice(d)}
                                                    className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ${
                                                        device === d ? 'bg-[#0E7C7B] text-white ring-[#0E7C7B]' : 'text-[#16302F] ring-[#E7E0D2] hover:bg-[#F7F3EC]'
                                                    }`}
                                                >
                                                    {d === 'desktop' ? 'Desktop' : 'Mobile'}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {tab === 'write' ? (
                                    <div className="px-5 py-5 sm:px-6">
                                        <textarea
                                            ref={body}
                                            rows={24}
                                            className={input + ' font-mono text-sm leading-relaxed'}
                                            value={data.body}
                                            onChange={(e) => setData('body', e.target.value)}
                                            aria-label="Article body"
                                        />
                                        <FieldError message={errors.body} />
                                        <details className="mt-3 text-sm text-[#5B6B6E]">
                                            <summary className="cursor-pointer font-medium text-[#16302F]">How to format the article</summary>
                                            <ul className="mt-2 list-disc space-y-1 pl-5">
                                                <li>Paragraphs before the first section are the opening (the first letter is styled large).</li>
                                                <li>
                                                    <code>## Heading</code> starts a section. Sections are listed under “In this article”.
                                                </li>
                                                <li>
                                                    <code>### Heading</code> inside a section is a step.
                                                </li>
                                                <li>
                                                    <code>&gt; text</code> is an important note (shown in bold).
                                                </li>
                                                <li>
                                                    <code>- item</code> or <code>1. item</code> makes a list. <code>**bold**</code>, <code>*italic*</code>,{' '}
                                                    <code>[text](/get-help)</code> for links.
                                                </li>
                                                <li>Photo adds an uploaded image with a description and caption.</li>
                                            </ul>
                                        </details>
                                    </div>
                                ) : (
                                    <div className="bg-[#EFEAE0] px-3 py-5 sm:px-6">
                                        {previewError && <p className="text-sm text-[#B44A2B]">{previewError}</p>}
                                        {!preview && !previewError && <p className="text-sm text-[#5B6B6E]">Loading preview…</p>}
                                        {preview && (
                                            <div
                                                className="bc-connect mx-auto overflow-hidden rounded-xl bg-white shadow-sm transition-all"
                                                style={{ minHeight: 0, maxWidth: device === 'mobile' ? 390 : 760, padding: device === 'mobile' ? '28px 20px' : '40px 48px' }}
                                            >
                                                <p className="eyebrow" style={{ marginTop: 0 }}>
                                                    {categories.find((c) => c.value === data.category)?.label} · {preview.minutes} min read
                                                </p>
                                                <h1 style={{ margin: '0 0 28px', fontSize: device === 'mobile' ? 34 : 46, lineHeight: 1.1, overflowWrap: 'break-word' }}>
                                                    {data.title || 'Article title'}
                                                </h1>
                                                <article className="article-body story-body">
                                                    {preview.opening && (
                                                        <div className="story-opening" dangerouslySetInnerHTML={{ __html: preview.opening }} />
                                                    )}
                                                    {preview.sections.map((s) => (
                                                        <section className="story-section" key={s.id}>
                                                            <h2>{s.title}</h2>
                                                            <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: s.html }} />
                                                        </section>
                                                    ))}
                                                </article>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>

                            <Card title="Featured photo" description="Optional. Shown after the opening paragraphs.">
                                {currentPhoto && (
                                    <div className="overflow-hidden rounded-xl ring-1 ring-[#E7E0D2]">
                                        <img src={currentPhoto} alt="" className="max-h-72 w-full object-cover" />
                                    </div>
                                )}
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="cursor-pointer rounded-full border border-[#0E7C7B]/30 bg-white px-4 py-2 text-sm font-medium text-[#0E7C7B] hover:border-[#0E7C7B]">
                                        {currentPhoto ? 'Replace photo' : 'Choose photo'}
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="sr-only"
                                            onChange={(e) => {
                                                setData((d) => ({ ...d, image_file: e.target.files?.[0] ?? null, remove_image: false }));
                                                e.target.value = '';
                                            }}
                                        />
                                    </label>
                                    {currentPhoto && (
                                        <button
                                            type="button"
                                            onClick={() => setData((d) => ({ ...d, image_file: null, remove_image: !!post.image }))}
                                            className="cursor-pointer text-sm font-medium text-[#8A3B2B] hover:underline"
                                        >
                                            Remove photo
                                        </button>
                                    )}
                                    <span className="text-xs text-[#7A8886]">JPG, PNG or WebP, up to 4 MB.</span>
                                </div>
                                <FieldError message={bodyErrors.image_file} />
                                {currentPhoto && (
                                    <div>
                                        <label className={labelCls} htmlFor="image_alt">
                                            Photo description
                                        </label>
                                        <input
                                            id="image_alt"
                                            className={input}
                                            value={data.image_alt}
                                            placeholder="What the photo shows, for people who cannot see it"
                                            onChange={(e) => setData('image_alt', e.target.value)}
                                        />
                                        <FieldError message={errors.image_alt} />
                                    </div>
                                )}
                            </Card>

                            <Card title="Around the article" description="Optional. Empty fields use the standard wording.">
                                <div>
                                    <label className={labelCls} htmlFor="margin_quote">
                                        Margin quote
                                    </label>
                                    <input
                                        id="margin_quote"
                                        className={input}
                                        value={data.margin_quote}
                                        placeholder="A short line from the article"
                                        onChange={(e) => setData('margin_quote', e.target.value)}
                                    />
                                    <p className={hintCls}>Shown beside the article as “A thought to keep close”.</p>
                                    <FieldError message={errors.margin_quote} />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className={labelCls} htmlFor="cta_label">
                                            Button text
                                        </label>
                                        <input
                                            id="cta_label"
                                            className={input}
                                            value={data.cta_label}
                                            placeholder="Find support on Bahali Connect"
                                            onChange={(e) => setData('cta_label', e.target.value)}
                                        />
                                        <FieldError message={errors.cta_label} />
                                    </div>
                                    <div>
                                        <label className={labelCls} htmlFor="cta_url">
                                            Button link
                                        </label>
                                        <input
                                            id="cta_url"
                                            className={input}
                                            value={data.cta_url}
                                            placeholder="/get-help"
                                            onChange={(e) => setData('cta_url', e.target.value)}
                                        />
                                        <FieldError message={errors.cta_url} />
                                    </div>
                                    <div>
                                        <label className={labelCls} htmlFor="signoff">
                                            Sign-off
                                        </label>
                                        <input
                                            id="signoff"
                                            className={input}
                                            value={data.signoff}
                                            placeholder="With care,"
                                            onChange={(e) => setData('signoff', e.target.value)}
                                        />
                                        <FieldError message={errors.signoff} />
                                    </div>
                                    <div>
                                        <label className={labelCls} htmlFor="signature">
                                            Signature
                                        </label>
                                        <input
                                            id="signature"
                                            className={input}
                                            value={data.signature}
                                            placeholder="Author’s first name"
                                            onChange={(e) => setData('signature', e.target.value)}
                                        />
                                        <FieldError message={errors.signature} />
                                    </div>
                                </div>
                            </Card>

                            <Card title="Search engines" description="Optional. Uses the title and summary when empty.">
                                <div>
                                    <label className={labelCls} htmlFor="seo_title">
                                        SEO title
                                    </label>
                                    <input id="seo_title" className={input} value={data.seo_title} onChange={(e) => setData('seo_title', e.target.value)} />
                                    <FieldError message={errors.seo_title} />
                                </div>
                                <div>
                                    <label className={labelCls} htmlFor="seo_description">
                                        SEO description
                                    </label>
                                    <textarea
                                        id="seo_description"
                                        rows={2}
                                        className={input}
                                        value={data.seo_description}
                                        onChange={(e) => setData('seo_description', e.target.value)}
                                    />
                                    <FieldError message={errors.seo_description} />
                                </div>
                            </Card>
                        </div>

                        {/* Side column */}
                        <div className="min-w-0 space-y-6 lg:sticky lg:top-6 lg:self-start">
                            <Card title="Publishing">
                                <div>
                                    <label className={labelCls} htmlFor="status">
                                        Status
                                    </label>
                                    <select id="status" className={input} value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                        {statuses.map((s) => (
                                            <option key={s.value} value={s.value}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                    <p className={hintCls}>Only Published (or Scheduled, once its time arrives) is visible to visitors.</p>
                                    <FieldError message={errors.status} />
                                </div>
                                {(data.status === 'scheduled' || data.status === 'published') && (
                                    <div>
                                        <label className={labelCls} htmlFor="published_at">
                                            {data.status === 'scheduled' ? 'Publish on' : 'Publish date'}
                                        </label>
                                        <input
                                            id="published_at"
                                            type="datetime-local"
                                            className={input}
                                            value={data.published_at}
                                            onChange={(e) => setData('published_at', e.target.value)}
                                        />
                                        {data.status === 'published' && <p className={hintCls}>Leave blank to use the moment you save.</p>}
                                        <FieldError message={errors.published_at} />
                                    </div>
                                )}
                                <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[#16302F]">
                                    <input
                                        type="checkbox"
                                        className="mt-0.5 h-4 w-4 accent-[#0E7C7B]"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                    />
                                    <span>
                                        Lead story on the blog
                                        <span className="block text-xs text-[#7A8886]">Replaces the current lead story.</span>
                                    </span>
                                </label>
                                <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[#16302F]">
                                    <input
                                        type="checkbox"
                                        className="mt-0.5 h-4 w-4 accent-[#0E7C7B]"
                                        checked={data.on_homepage}
                                        onChange={(e) => setData('on_homepage', e.target.checked)}
                                    />
                                    <span>
                                        Show on the homepage
                                        <span className="block text-xs text-[#7A8886]">“Start with understanding” shows the two newest.</span>
                                    </span>
                                </label>
                            </Card>

                            <Card title="Category">
                                <div>
                                    <select
                                        aria-label="Category"
                                        className={input}
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                    >
                                        {categories.map((c) => (
                                            <option key={c.value} value={c.value}>
                                                {c.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FieldError message={errors.category} />
                                </div>
                                <div>
                                    <p className={labelCls}>Also show under</p>
                                    <div className="mt-2 space-y-2">
                                        {categories
                                            .filter((c) => c.value !== data.category)
                                            .map((c) => (
                                                <label key={c.value} className="flex cursor-pointer items-center gap-2.5 text-sm text-[#16302F]">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 accent-[#0E7C7B]"
                                                        checked={data.reading_paths.includes(c.value)}
                                                        onChange={() => togglePath(c.value)}
                                                    />
                                                    {c.label}
                                                </label>
                                            ))}
                                    </div>
                                </div>
                            </Card>

                            <Card title="Author" description="Real contributor details only.">
                                <div>
                                    <label className={labelCls} htmlFor="author_name">
                                        Name and credentials
                                    </label>
                                    <input
                                        id="author_name"
                                        className={input}
                                        value={data.author_name}
                                        placeholder="Bahali Connect"
                                        onChange={(e) => setData('author_name', e.target.value)}
                                    />
                                    <FieldError message={errors.author_name} />
                                </div>
                                <div>
                                    <label className={labelCls} htmlFor="author_role">
                                        Role
                                    </label>
                                    <input
                                        id="author_role"
                                        className={input}
                                        value={data.author_role}
                                        onChange={(e) => setData('author_role', e.target.value)}
                                    />
                                    <FieldError message={errors.author_role} />
                                </div>
                                <div>
                                    <label className={labelCls} htmlFor="reviewer_name">
                                        Clinical reviewer
                                    </label>
                                    <input
                                        id="reviewer_name"
                                        className={input}
                                        value={data.reviewer_name}
                                        onChange={(e) => setData('reviewer_name', e.target.value)}
                                    />
                                    <p className={hintCls}>Only when a review was actually completed.</p>
                                    <FieldError message={errors.reviewer_name} />
                                </div>
                                {data.reviewer_name && (
                                    <div>
                                        <label className={labelCls} htmlFor="reviewed_at">
                                            Review date
                                        </label>
                                        <input
                                            id="reviewed_at"
                                            type="date"
                                            className={input}
                                            value={data.reviewed_at}
                                            onChange={(e) => setData('reviewed_at', e.target.value)}
                                        />
                                        <FieldError message={errors.reviewed_at} />
                                    </div>
                                )}
                            </Card>

                            {otherPosts.length > 0 && (
                                <Card title="Related articles" description="Up to 3. Empty uses articles from the same category.">
                                    <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                                        {otherPosts.map((o) => {
                                            const checked = data.related_post_ids.includes(o.id);
                                            return (
                                                <label
                                                    key={o.id}
                                                    className={`flex cursor-pointer items-start gap-2.5 text-sm ${
                                                        !checked && data.related_post_ids.length >= 3 ? 'opacity-50' : 'text-[#16302F]'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="mt-0.5 h-4 w-4 accent-[#0E7C7B]"
                                                        checked={checked}
                                                        disabled={!checked && data.related_post_ids.length >= 3}
                                                        onChange={() => toggleRelated(o.id)}
                                                    />
                                                    <span>
                                                        {o.title}
                                                        <span className="block text-xs text-[#7A8886]">{o.status}</span>
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    <FieldError message={errors.related_post_ids} />
                                </Card>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full cursor-pointer rounded-full bg-[#0E7C7B] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#0B6564] disabled:cursor-wait disabled:opacity-60"
                            >
                                {processing ? 'Saving…' : 'Save article'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
