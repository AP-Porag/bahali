import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useRef, useState } from 'react';

export type ContentFieldType = 'text' | 'textarea' | 'image';

export interface ContentField {
    key: string;
    label: string;
    type: ContentFieldType;
    value: string;
    group?: string | null;
    hint?: string | null;
}

export interface ContentSection {
    key: string;
    title: string;
    description?: string | null;
    fields: ContentField[];
}

interface Props {
    field: ContentField;
    sectionTitle: string;
    updateUrl: string;
    onClose: () => void;
    onSaved: (label: string) => void;
}

interface FormData {
    key: string;
    value: string;
    image: File | null;
}

export default function ContentEditModal({ field, sectionTitle, updateUrl, onClose, onSaved }: Props) {
    const isImage = field.type === 'image';
    const isTextarea = field.type === 'textarea';
    const maxLength = isTextarea ? 5000 : 255;

    const form = useForm<FormData>({
        key: field.key,
        value: isImage ? '' : field.value,
        image: null,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);

    /* Esc to close + lock page scroll while open */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !form.processing) onClose();
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [form.processing, onClose]);

    /* Release the object URL when the preview changes / modal closes */
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const pickFile = (file: File | null) => {
        form.setData('image', file);
        form.clearErrors('image');
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();

        form.transform((data) => (isImage ? { key: data.key, image: data.image } : { key: data.key, value: data.value }));

        form.post(updateUrl, {
            forceFormData: isImage,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                onSaved(field.label);
                onClose();
            },
        });
    };

    const canSave = isImage ? !!form.data.image : form.data.value.trim().length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="content-edit-title">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#16302F]/50 backdrop-blur-[2px]" onClick={() => !form.processing && onClose()} />

            {/* Panel */}
            <form
                onSubmit={submit}
                className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#E7E0D2] bg-white shadow-2xl"
            >
                {/* Header */}
                <div className="border-b border-[#EFEAE0] px-7 pb-5 pt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0E7C7B]">
                        {sectionTitle}
                        {field.group ? ` · ${field.group}` : ''}
                    </p>
                    <h2 id="content-edit-title" className="mt-1.5 font-serif text-2xl text-[#16302F]">
                        Edit {field.label}
                    </h2>
                </div>

                {/* Body */}
                <div className="max-h-[65vh] overflow-y-auto px-7 py-6">
                    {isImage ? (
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7A78]">
                                {preview ? 'New image' : 'Current image'}
                            </p>
                            <div className="mt-2 overflow-hidden rounded-xl border border-[#E7E0D2] bg-[#F7F3EC]">
                                <img
                                    src={preview ?? field.value}
                                    alt={field.label}
                                    className="mx-auto max-h-64 w-full object-contain"
                                />
                            </div>

                            <input
                                ref={fileInput}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                            />

                            <button
                                type="button"
                                onClick={() => fileInput.current?.click()}
                                className="mt-4 flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#0E7C7B]/30 bg-[#0E7C7B]/[0.03] px-4 py-6 text-center transition hover:border-[#0E7C7B]/60 hover:bg-[#0E7C7B]/[0.06]"
                            >
                                <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#0E7C7B]" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                                <span className="text-sm font-semibold text-[#0E7C7B]">
                                    {form.data.image ? form.data.image.name : 'Choose a new image'}
                                </span>
                                <span className="text-xs text-[#6B7A78]">JPG, PNG or WEBP · max 5 MB</span>
                            </button>

                            {form.data.image && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        pickFile(null);
                                        if (fileInput.current) fileInput.current.value = '';
                                    }}
                                    className="mt-2 text-xs font-medium text-[#C2543B] hover:underline"
                                >
                                    Remove selected image
                                </button>
                            )}

                            {form.errors.image && <p className="mt-2 text-sm text-[#C2543B]">{form.errors.image}</p>}
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="content-value" className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7A78]">
                                {field.label}
                            </label>

                            {isTextarea ? (
                                <textarea
                                    id="content-value"
                                    autoFocus
                                    rows={6}
                                    maxLength={maxLength}
                                    value={form.data.value}
                                    onChange={(e) => form.setData('value', e.target.value)}
                                    className="mt-2 block w-full resize-y rounded-xl border border-[#E3D9C4] bg-[#FBF8F2] px-4 py-3 text-[15px] leading-relaxed text-[#1F2A2E] outline-none transition placeholder:text-[#9AA6A4] focus:border-[#0E7C7B] focus:bg-white focus:ring-4 focus:ring-[#0E7C7B]/10"
                                />
                            ) : (
                                <input
                                    id="content-value"
                                    type="text"
                                    autoFocus
                                    maxLength={maxLength}
                                    value={form.data.value}
                                    onChange={(e) => form.setData('value', e.target.value)}
                                    className="mt-2 block w-full rounded-xl border border-[#E3D9C4] bg-[#FBF8F2] px-4 py-3 text-[15px] text-[#1F2A2E] outline-none transition placeholder:text-[#9AA6A4] focus:border-[#0E7C7B] focus:bg-white focus:ring-4 focus:ring-[#0E7C7B]/10"
                                />
                            )}

                            <div className="mt-2 flex items-start justify-between gap-4">
                                <p className="text-xs text-[#C2543B]">{form.errors.value}</p>
                                <p className="shrink-0 text-xs text-[#9AA6A4]">
                                    {form.data.value.length}/{maxLength}
                                </p>
                            </div>
                        </div>
                    )}

                    {field.hint && <p className="mt-3 text-xs text-[#6B7A78]">{field.hint}</p>}
                    {form.errors.key && <p className="mt-3 text-sm text-[#C2543B]">{form.errors.key}</p>}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-[#EFEAE0] bg-[#FBF8F2] px-7 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={form.processing}
                        className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium text-[#3A4B49] transition hover:bg-[#EFEAE0] disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!canSave || form.processing}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#0E7C7B] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b6766] focus:outline-none focus:ring-4 focus:ring-[#0E7C7B]/25 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {form.processing && (
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                                <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        )}
                        {form.processing ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}
