import { Head } from '@inertiajs/react';
import { Fragment, useCallback, useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import ContentEditModal, { type ContentField, type ContentSection } from '@/components/admin/content-edit-modal';

const UPDATE_URL = '/admin/web/join-the-circle';
const PUBLIC_URL = '/join-the-circle'; // public Join the Circle page URL

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Website', href: UPDATE_URL },
    { title: 'Join the Circle', href: UPDATE_URL },
];

interface Props {
    sections: ContentSection[];
}

export default function JoinTheCircleContent({ sections }: Props) {
    const [editing, setEditing] = useState<{ field: ContentField; sectionTitle: string } | null>(null);
    const [active, setActive] = useState<string>(sections[0]?.key ?? '');
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 2800);
        return () => clearTimeout(t);
    }, [toast]);

    const closeModal = useCallback(() => setEditing(null), []);

    const jumpTo = (key: string) => {
        setActive(key);
        document.getElementById(`section-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Join the Circle — Page Content" />

            <div className="m-4 rounded-xl bg-[#F7F3EC] px-5 py-10 sm:px-8 lg:py-14">
                <div className="mx-auto max-w-5xl">
                    {/* Page header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0E7C7B]">Website Content</p>
                            <h1 className="mt-2 font-serif text-4xl text-[#16302F]">Join the Circle</h1>
                            <p className="mt-2 text-[15px] text-[#5B6B6E]">
                                Edit the text and images on the provider landing page. Changes go live immediately.
                            </p>
                        </div>
                        <a
                            href={PUBLIC_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#0E7C7B]/30 bg-white px-4 py-2 text-sm font-medium text-[#0E7C7B] shadow-sm transition hover:border-[#0E7C7B] sm:self-auto"
                        >
                            View live page
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </a>
                    </div>

                    <div className="mt-10 grid gap-8 lg:grid-cols-[230px_1fr]">
                        {/* Section navigator */}
                        <nav className="hidden lg:block">
                            <ol className="sticky top-6 space-y-1">
                                {sections.map((s, i) => {
                                    const isActive = active === s.key;
                                    return (
                                        <li key={s.key}>
                                            <button
                                                type="button"
                                                onClick={() => jumpTo(s.key)}
                                                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition ${isActive ? 'bg-[#EFEAE0]' : 'hover:bg-[#EFEAE0]/60'
                                                    }`}
                                            >
                                                <span
                                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold ${isActive ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white' : 'border-[#D9D0BF] bg-white text-[#6B7A78]'
                                                        }`}
                                                >
                                                    {i + 1}
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-medium text-[#16302F]">{s.title}</span>
                                                    <span className="block text-xs text-[#9AA6A4]">{s.fields.length} fields</span>
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ol>
                        </nav>

                        {/* Stacked sections */}
                        <div className="space-y-6">
                            {sections.map((section, i) => (
                                <section
                                    key={section.key}
                                    id={`section-${section.key}`}
                                    className="scroll-mt-6 rounded-2xl border border-[#E7E0D2] bg-white px-6 py-7 shadow-sm sm:px-8"
                                >
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0E7C7B]">Section {i + 1}</p>
                                    <h2 className="mt-1 font-serif text-2xl text-[#16302F]">{section.title}</h2>
                                    {section.description && <p className="mt-1 text-sm text-[#6B7A78]">{section.description}</p>}

                                    <div className="mt-5 border-t border-[#EFEAE0]">
                                        {section.fields.map((field, idx) => {
                                            const showGroup = !!field.group && field.group !== section.fields[idx - 1]?.group;

                                            return (
                                                <Fragment key={field.key}>
                                                    {showGroup && (
                                                        <p className="pb-1 pt-6 text-sm font-semibold text-[#16302F]">{field.group}</p>
                                                    )}
                                                    <FieldRow
                                                        field={field}
                                                        onEdit={() => setEditing({ field, sectionTitle: section.title })}
                                                    />
                                                </Fragment>
                                            );
                                        })}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit modal */}
            {editing && (
                <ContentEditModal
                    key={editing.field.key}
                    field={editing.field}
                    sectionTitle={editing.sectionTitle}
                    updateUrl={UPDATE_URL}
                    onClose={closeModal}
                    onSaved={(label) => setToast(`${label} updated`)}
                />
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 rounded-xl bg-[#0E4C4B] px-5 py-3 text-sm font-medium text-white shadow-lg">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {toast}
                </div>
            )}
        </AppLayout>
    );
}

/* ------------------------------------------------------------------ */
/*  One editable row                                                   */
/* ------------------------------------------------------------------ */

function FieldRow({ field, onEdit }: { field: ContentField; onEdit: () => void }) {
    const [broken, setBroken] = useState(false);

    return (
        <div className="flex items-start justify-between gap-6 border-b border-[#EFEAE0] py-4 last:border-b-0">
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7A78]">{field.label}</p>

                {field.type === 'image' ? (
                    <div className="mt-2 h-20 w-32 overflow-hidden rounded-lg bg-[#E3D9C4] ring-1 ring-[#E7E0D2]">
                        {!broken ? (
                            <img src={field.value} alt={field.label} onError={() => setBroken(true)} className="h-full w-full object-cover" />
                        ) : (
                            <span className="flex h-full items-center justify-center text-xs text-[#6B7A78]">No image</span>
                        )}
                    </div>
                ) : (
                    <p className="mt-1 line-clamp-3 whitespace-pre-line text-[15px] leading-relaxed text-[#1F2A2E]">{field.value}</p>
                )}
            </div>

            <button
                type="button"
                onClick={onEdit}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#0E7C7B]/30 bg-white px-3.5 py-1.5 text-sm font-medium text-[#0E7C7B] transition hover:border-[#0E7C7B] hover:bg-[#0E7C7B] hover:text-white"
            >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                </svg>
                Edit
            </button>
        </div>
    );
}
