
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AREAS_OF_SUPPORT_GROUPS, COMMON_SUPPORT_AREAS, ALL_SUPPORT_AREAS } from '@/constants/supportAreas';
import { HelpCircle } from 'lucide-react';

const SERIF = { fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' };
const PER_PAGE = 6;

const PAYMENT_OPTIONS = [
    { key: 'insurance', label: 'Insurance' },
    { key: 'self_pay', label: 'Self-pay' },
    { key: 'sliding_scale', label: 'Sliding scale' },
    { key: 'free_low_cost', label: 'Free or low-cost services' },
];
const PAYMENT_LABEL = Object.fromEntries(PAYMENT_OPTIONS.map((o) => [o.key, o.label]));

const CRISIS_TERMS = ['suicide', 'suicidal', 'kill myself', 'end my life', 'self harm', 'self-harm', 'hurt myself', 'emergency', 'crisis', 'overdose'];
const isCrisisQuery = (kw = '') => { const t = kw.toLowerCase(); return CRISIS_TERMS.some((x) => t.includes(x)); };

function initials(name = '') {
    return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'B';
}

/* ----------------------------- small pieces ----------------------------- */

function LabeledSelect({ id, label, value, onChange, options = [], placeholder = 'All' }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#6B7A78]">{label}</label>
            <Select value={value || 'all'} onValueChange={(v) => onChange(v === 'all' ? '' : v)}>
                <SelectTrigger id={id}
                    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20 ${value ? 'border-[#0E7C7B]/40 text-[#1F2A2E]' : 'border-[#DED7C9] text-[#5B6B6E]'}`}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{placeholder}</SelectItem>
                    {options.map((opt) => {
                        const v = typeof opt === 'string' ? opt : opt.value;
                        const l = typeof opt === 'string' ? opt : opt.label;
                        return <SelectItem key={v} value={v}>{l}</SelectItem>;
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}

function MultiSelect({ id, label, values = [], onChange, options = [], placeholder = 'All' }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);
    const toggle = (opt) => { const s = new Set(values); s.has(opt) ? s.delete(opt) : s.add(opt); onChange(Array.from(s)); };
    const summary = values.length === 0 ? placeholder : values.length === 1 ? values[0] : `${values.length} selected`;
    return (
        <div ref={ref} className="relative">
            <label htmlFor={id} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#6B7A78]">{label}</label>
            <button id={id} type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}
                className={`flex w-full items-center justify-between rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm outline-none transition focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20 ${values.length ? 'border-[#0E7C7B]/40 text-[#1F2A2E]' : 'border-[#DED7C9] text-[#5B6B6E]'}`}>
                <span className="truncate">{summary}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m6 9 6 6 6-6" /></svg>
            </button>
            {open && (
                <div role="listbox" aria-multiselectable="true" className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[#DED7C9] bg-white p-1 shadow-lg">
                    {options.length === 0 && <p className="px-3 py-2 text-sm text-[#8A9795]">No options</p>}
                    {options.map((opt) => (
                        <label key={opt} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#3A4B49] hover:bg-[#0E7C7B]/5">
                            <input type="checkbox" checked={values.includes(opt)} onChange={() => toggle(opt)} className="h-4 w-4 rounded border-[#B9C2C0] text-[#0E7C7B] focus:ring-[#0E7C7B]" />
                            {opt}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ------------------------ See all areas modal (guide §3, mockup 3) ------------------------ */

function AreaButton({ area, active, onToggle }) {
    return (
        <button type="button" onClick={() => onToggle(area)} aria-pressed={active}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${active ? 'border-[#0E7C7B] bg-[#0E7C7B]/8 text-[#15403F]' : 'border-[#DED7C9] bg-white text-[#3A4B49] hover:border-[#0E7C7B]/50'}`}>
            <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${active ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white' : 'border-[#C7BEAD] bg-white'}`} aria-hidden>
                {active && <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor"><path d="M7.6 13.4 4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" /></svg>}
            </span>
            <span className="leading-snug">{area}</span>
        </button>
    );
}

function SeeAllAreasModal({ open, onClose, selected, onApply }) {
    const [local, setLocal] = useState(selected);
    const [q, setQ] = useState('');
    const [activeCat, setActiveCat] = useState(AREAS_OF_SUPPORT_GROUPS[0]?.category ?? '');
    const [openMobileCat, setOpenMobileCat] = useState('');

    useEffect(() => { if (open) { setLocal(selected); setQ(''); } }, [open, selected]);
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        if (open) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);
    if (!open) return null;

    const query = q.trim().toLowerCase();
    const searching = query.length > 0;
    const searchResults = searching ? ALL_SUPPORT_AREAS.filter((a) => a.toLowerCase().includes(query)) : [];
    const activeItems = AREAS_OF_SUPPORT_GROUPS.find((g) => g.category === activeCat)?.items ?? [];
    const toggle = (area) => { const s = new Set(local); s.has(area) ? s.delete(area) : s.add(area); setLocal(Array.from(s)); };
    const countFor = (cat) => AREAS_OF_SUPPORT_GROUPS.find((g) => g.category === cat)?.items.filter((i) => local.includes(i)).length ?? 0;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="All areas of support">
            <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
                <div className="border-b border-[#EFEAE0] p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg text-[#16302F]" style={SERIF}>See all areas of support</h3>
                        <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-[#8A9795] hover:bg-[#F1EDE3]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
                        </button>
                    </div>
                    <p className="mt-1 text-sm text-[#8A9795]">Browse a category or search all support options. Select as many as you need.</p>
                    <div className="relative mt-3">
                        <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA6A4]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search areas of support"
                            className="w-full rounded-xl border border-[#DED7C9] bg-[#FBF8F2] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {searching ? (
                        <div className="p-4 sm:p-5">
                            {searchResults.length === 0
                                ? <p className="text-sm text-[#8A9795]">No areas match “{q}”.</p>
                                : <div className="grid gap-2 sm:grid-cols-2">{searchResults.map((a) => <AreaButton key={a} area={a} active={local.includes(a)} onToggle={toggle} />)}</div>}
                        </div>
                    ) : (
                        <>
                            <div className="hidden sm:flex">
                                <ul className="w-64 flex-shrink-0 border-r border-[#EFEAE0] p-2">
                                    {AREAS_OF_SUPPORT_GROUPS.map((g) => {
                                        const c = countFor(g.category);
                                        return (
                                            <li key={g.category}>
                                                <button type="button" onClick={() => setActiveCat(g.category)}
                                                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${activeCat === g.category ? 'bg-[#0E7C7B]/10 font-medium text-[#15403F]' : 'text-[#3A4B49] hover:bg-[#F1EDE3]'}`}>
                                                    <span className="leading-snug">{g.category}</span>
                                                    {c > 0 && <span className="rounded-full bg-[#0E7C7B] px-1.5 py-0.5 text-[10px] font-semibold text-white">{c}</span>}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div className="grid flex-1 content-start gap-2 p-4 sm:grid-cols-2">{activeItems.map((a) => <AreaButton key={a} area={a} active={local.includes(a)} onToggle={toggle} />)}</div>
                            </div>
                            <div className="sm:hidden">
                                {AREAS_OF_SUPPORT_GROUPS.map((g) => {
                                    const isOpen = openMobileCat === g.category;
                                    const c = countFor(g.category);
                                    return (
                                        <div key={g.category} className="border-b border-[#EFEAE0]">
                                            <button type="button" onClick={() => setOpenMobileCat(isOpen ? '' : g.category)} className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left">
                                                <span className="flex items-center gap-2 text-sm font-medium text-[#16302F]">{g.category}{c > 0 && <span className="rounded-full bg-[#0E7C7B] px-1.5 py-0.5 text-[10px] font-semibold text-white">{c}</span>}</span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-[#0E7C7B] transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden><path d="m6 9 6 6 6-6" /></svg>
                                            </button>
                                            {isOpen && <div className="grid gap-2 px-4 pb-4">{g.items.map((a) => <AreaButton key={a} area={a} active={local.includes(a)} onToggle={toggle} />)}</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-[#EFEAE0] p-4 sm:p-5">
                    <div className="flex items-center gap-3 text-sm text-[#5B6B6E]">
                        <span><span className="font-semibold text-[#16302F]">{local.length}</span> selected</span>
                        {local.length > 0 && <button onClick={() => setLocal([])} className="text-[#C2543B] underline underline-offset-2 hover:opacity-80">Clear all</button>}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="rounded-xl border border-[#DED7C9] bg-white px-4 py-2.5 text-sm font-medium text-[#3A4B49] hover:border-[#0E7C7B]/40">Cancel</button>
                        <button onClick={() => onApply(local)} className="rounded-xl bg-[#0E7C7B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0B6463]">Apply</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------ availability badge (3-state, mockup 5) ------------------------ */

function AvailabilityBadge({ availability }) {
    if (availability === 'accepting') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0E7C7B]/10 px-3 py-1 text-xs font-semibold text-[#0E6B6A] ring-1 ring-inset ring-[#0E7C7B]/20">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Accepting new clients
            </span>
        );
    }
    if (availability === 'not_accepting') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFEAE0] px-3 py-1 text-xs font-semibold text-[#6B7A78] ring-1 ring-inset ring-[#D9CFBA]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden><path d="M5 12h14" strokeLinecap="round" /></svg>
                Not accepting new clients
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8B84B]/15 px-3 py-1 text-xs font-semibold text-[#9A6B12] ring-1 ring-inset ring-[#E8B84B]/40">
            <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#E8B84B]/40">
                <HelpCircle className="h-3 w-3" strokeWidth={2.4} aria-hidden />
            </span>
            Contact to confirm availability
        </span>
    );
}

/* ------------------------------ Provider card (mockup 4/5) ------------------------------ */

function ProviderRow({ children }) {
    return <p className="flex items-center gap-2 text-sm text-[#3A4B49]">{children}</p>;
}

function ProviderCard({ p, selectedAreas = [] }) {
    const [imgError, setImgError] = useState(false);
    const specialties = useMemo(() => {
        const all = p.specialties || [];
        if (!selectedAreas.length) return all.slice(0, 3);
        const matched = all.filter((a) => selectedAreas.includes(a));
        const rest = all.filter((a) => !selectedAreas.includes(a));
        return [...matched, ...rest].slice(0, 3);
    }, [p.specialties, selectedAreas]);

    const formatLabel = { in_person: 'In Person', virtual: 'Virtual', both: 'Virtual & In-person' }[p.formatKey]
        || (p.sessionFormat && p.sessionFormat !== 'Not specified' ? p.sessionFormat : null);
    const insurers = p.insurances || [];
    const shownInsurers = insurers.slice(0, 2);
    const extraInsurers = Math.max(0, insurers.length - shownInsurers.length);
    const showPhoto = p.photo && !imgError;

    return (
        <article className="flex flex-col gap-5 rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)] transition hover:border-[#DCD0BA] hover:shadow-[0_10px_30px_-12px_rgba(14,124,123,0.2)] sm:flex-row">
            {/* photo left */}
            {showPhoto ? (
                <img src={p.photo} alt={p.name} onError={() => setImgError(true)} className="h-44 w-full flex-shrink-0 rounded-xl object-cover ring-1 ring-black/5 sm:h-40 sm:w-36" />
            ) : (
                <div aria-hidden className="flex h-44 w-full flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0E4C4B] to-[#0E7C7B] font-serif text-3xl text-white/90 ring-1 ring-black/5 sm:h-40 sm:w-36" style={SERIF}>{initials(p.name)}</div>
            )}

            {/* middle */}
            <div className="min-w-0 flex-1">
                <h3 className="text-[20px] leading-tight text-[#16302F]" style={SERIF}>
                    {p.name}{p.credentials ? <span className="text-[16px] font-normal text-[#5B6B6E]">, {p.credentials}</span> : null}
                </h3>
                {p.title && <p className="mt-0.5 text-sm text-[#5B6B6E]">{p.title}</p>}
                {(p.location || formatLabel) && (
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm text-[#3A4B49]">
                        {p.location && (
                            <span className="inline-flex items-center gap-1">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" /><circle cx="12" cy="11" r="2" /></svg>
                                {p.location}
                            </span>
                        )}
                        {p.location && formatLabel && <span className="text-[#C9CFCE]">•</span>}
                        {formatLabel && <span>{formatLabel}</span>}
                    </p>
                )}
                {specialties.length > 0 && (
                    <>
                        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-[#8A9795]">Areas of support</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {specialties.map((s) => {
                                const matched = selectedAreas.includes(s);
                                return (
                                    <span key={s} className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${matched ? 'bg-[#0E7C7B] text-white' : 'bg-[#EFEAE0] text-[#5B6B6E]'}`}>{s}</span>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* right column */}
            <div className="flex w-full flex-shrink-0 flex-col gap-2.5 border-t border-[#EFEAE0] pt-4 sm:w-52 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                <AvailabilityBadge availability={p.availability} />
                {p.fee && <ProviderRow><span className="font-semibold text-[#16302F]">{p.fee}</span></ProviderRow>}
                {shownInsurers.length > 0 && <ProviderRow><span className="truncate">{shownInsurers.join(', ')}{extraInsurers > 0 ? ` + ${extraInsurers} more` : ''}</span></ProviderRow>}
                {p.slidingScale && <ProviderRow><span className="text-[#0E6B6A]">Sliding scale available</span></ProviderRow>}
                {p.freeLowCost && !p.slidingScale && <ProviderRow><span className="text-[#0E6B6A]">Free / low-cost</span></ProviderRow>}
                {!shownInsurers.length && !p.slidingScale && !p.freeLowCost && p.selfPay && <ProviderRow><span>Self-pay</span></ProviderRow>}
                {p.languages?.length > 0 && <ProviderRow><span className="truncate text-[#5B6B6E]">{p.languages.join(', ')}</span></ProviderRow>}
                <Link href={`/provider/${p.id}`} className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0E7C7B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B6463] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7C7B]/40" aria-label={`View profile for ${p.name}`}>
                    View profile
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
            </div>
        </article>
    );
}

function CardSkeleton() {
    return (
        <div className="flex flex-col gap-5 rounded-2xl border border-[#E7E0D2] bg-white p-5 sm:flex-row">
            <div className="h-40 w-full flex-shrink-0 animate-pulse rounded-xl bg-[#EFEAE0] sm:w-36" />
            <div className="flex-1 space-y-2">
                <div className="h-5 w-2/3 animate-pulse rounded bg-[#EFEAE0]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-[#F2EDE2]" />
                <div className="mt-3 flex gap-2"><div className="h-6 w-24 animate-pulse rounded-full bg-[#F2EDE2]" /><div className="h-6 w-20 animate-pulse rounded-full bg-[#F2EDE2]" /></div>
            </div>
        </div>
    );
}

/* ------------------------------ Refine sidebar (mockup 6) ------------------------------ */

function RefineGroup({ title, children }) {
    return (
        <div className="border-b border-[#EFEAE0] pb-4 last:border-0 last:pb-0">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-[#8A9795]">{title}</p>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function RefineCheck({ checked, onChange, children }) {
    return (
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#3A4B49]">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-[#B9C2C0] text-[#0E7C7B] focus:ring-[#0E7C7B]" />
            {children}
        </label>
    );
}

function RefinePanel({ f, patch, onKeyword, filterOptions }) {
    // Keyword — local until the user presses the search button / Enter (no auto-search).
    const [kw, setKw] = useState(f.keyword || '');
    useEffect(() => { setKw(f.keyword || ''); }, [f.keyword]);
    const submitKeyword = () => onKeyword(kw.trim());

    // Price range — local until "Apply".
    const [priceMin, setPriceMin] = useState(f.fee_min || '');
    const [priceMax, setPriceMax] = useState(f.fee_max || '');
    useEffect(() => { setPriceMin(f.fee_min || ''); setPriceMax(f.fee_max || ''); }, [f.fee_min, f.fee_max]);
    const applyPrice = () => patch({ fee_min: priceMin.trim(), fee_max: priceMax.trim() });
    const clearPrice = () => { setPriceMin(''); setPriceMax(''); patch({ fee_min: '', fee_max: '' }); };
    const onlyNum = (v) => v.replace(/[^0-9]/g, '');

    return (
        <div className="space-y-4">
            <RefineGroup title="Availability">
                <RefineCheck checked={f.accepting} onChange={(v) => patch({ accepting: v })}>Accepting new clients</RefineCheck>
            </RefineGroup>

            <RefineGroup title="Location & format">
                <RefineCheck checked={f.include_virtual} onChange={(v) => patch({ include_virtual: v })}>Include virtual providers</RefineCheck>
                <LabeledSelect id="r-fmt" label="How would you like to meet?" value={f.session_format} onChange={(v) => patch({ session_format: v })} options={filterOptions.sessionFormats || ['In Person', 'Telehealth', 'Both']} />
            </RefineGroup>

            <RefineGroup title="Practical considerations">
                {/* Price range */}
                <div>
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#6B7A78]">Price range (per session)</span>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9AA6A4]">$</span>
                            <input inputMode="numeric" value={priceMin} onChange={(e) => setPriceMin(onlyNum(e.target.value))}
                                onKeyDown={(e) => e.key === 'Enter' && applyPrice()} placeholder="Min"
                                className="w-full rounded-xl border border-[#DED7C9] bg-white py-2.5 pl-6 pr-2 text-sm text-[#1F2A2E] outline-none transition focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20" />
                        </div>
                        <span className="text-[#9AA6A4]">–</span>
                        <div className="relative flex-1">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9AA6A4]">$</span>
                            <input inputMode="numeric" value={priceMax} onChange={(e) => setPriceMax(onlyNum(e.target.value))}
                                onKeyDown={(e) => e.key === 'Enter' && applyPrice()} placeholder="Max"
                                className="w-full rounded-xl border border-[#DED7C9] bg-white py-2.5 pl-6 pr-2 text-sm text-[#1F2A2E] outline-none transition focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                        <button type="button" onClick={applyPrice} className="rounded-lg bg-[#0E7C7B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B6463]">Apply</button>
                        {(f.fee_min || f.fee_max) && <button type="button" onClick={clearPrice} className="text-xs font-medium text-[#C2543B] underline underline-offset-2 hover:opacity-80">Clear</button>}
                    </div>
                </div>

                {/* Payment */}
                <div>
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#6B7A78]">Payment</span>
                    <div role="radiogroup" aria-label="Payment" className="flex flex-wrap gap-2">
                        {PAYMENT_OPTIONS.map((opt) => {
                            const active = f.payment === opt.key;
                            return (
                                <button key={opt.key} type="button" role="radio" aria-checked={active}
                                    onClick={() => patch({ payment: active ? '' : opt.key, insurer: active ? '' : f.insurer })}
                                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${active ? 'border-[#C2543B] bg-[#F6E6DF] text-[#C2543B]' : 'border-[#DED7C9] bg-white text-[#3A4B49] hover:border-[#C2543B]/40'}`}>
                                    {opt.label}
                                </button>
                            );
                        })}
                        <button type="button" role="radio" aria-checked={f.payment === ''} onClick={() => patch({ payment: '', insurer: '' })}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${f.payment === '' ? 'border-[#C2543B] bg-[#F6E6DF] text-[#C2543B]' : 'border-[#DED7C9] bg-white text-[#3A4B49] hover:border-[#C2543B]/40'}`}>All</button>
                    </div>
                    {f.payment === 'insurance' && (filterOptions.insurers?.length || 0) > 0 && (
                        <div className="mt-2.5"><LabeledSelect id="r-insurer" label="Which insurer?" value={f.insurer} onChange={(v) => patch({ insurer: v })} options={filterOptions.insurers || []} placeholder="Any insurer" /></div>
                    )}
                </div>
                <MultiSelect id="r-lang" label="Language" values={f.language} onChange={(v) => patch({ language: v })} options={filterOptions.languages || []} />
            </RefineGroup>

            <RefineGroup title="Provider & service">
                <LabeledSelect id="r-type" label="Provider type" value={f.provider_type} onChange={(v) => patch({ provider_type: v })} options={filterOptions.providerTypes || []} />
                <LabeledSelect id="r-pop" label="Population / age group" value={f.population} onChange={(v) => patch({ population: v })} options={filterOptions.populations || []} />
            </RefineGroup>

            <RefineGroup title="Keyword">
                <div className="flex items-center gap-2">
                    <input value={kw} onChange={(e) => setKw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitKeyword()} placeholder="Name, specialty…"
                        className="w-full rounded-xl border border-[#DED7C9] bg-white px-3.5 py-2.5 text-sm text-[#1F2A2E] outline-none transition focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20" />
                    <button type="button" onClick={submitKeyword} aria-label="Search"
                        className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-xl bg-[#0E7C7B] text-white transition hover:bg-[#0B6463] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7C7B]/40">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                    </button>
                </div>
            </RefineGroup>
        </div>
    );
}

/* --------------------------------- Page --------------------------------- */

export default function Directory({
    providers = [], pagination = {}, filterOptions = {}, countries = [], filters = {}, seed: initialSeed = 0,
}) {
    const [items, setItems] = useState(providers);
    const [meta, setMeta] = useState(pagination);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [seed, setSeed] = useState(initialSeed);
    const [showRefine, setShowRefine] = useState(false);
    const [showAreasModal, setShowAreasModal] = useState(false);
    const resultsRef = useRef(null);

    useEffect(() => { setSeed(initialSeed); }, [initialSeed]);

    const [f, setF] = useState({
        location: filters.location || '',
        region: filters.region || '',
        include_virtual: !!filters.include_virtual,
        areas: Array.isArray(filters.areas) ? filters.areas : [],
        payment: filters.payment || '',
        insurer: filters.insurer || '',
        fee_min: filters.fee_min || '',
        fee_max: filters.fee_max || '',
        population: filters.population || '',
        session_format: filters.session_format || '',
        language: Array.isArray(filters.language) ? filters.language : (filters.language ? [filters.language] : []),
        provider_type: filters.provider_type || '',
        accepting: !!filters.accepting,
        keyword: filters.keyword || '',
    });

    const fRef = useRef(f); fRef.current = f;

    const selectedCountry = useMemo(() => countries.find((c) => c.name === f.location), [countries, f.location]);
    const regions = selectedCountry?.regions ?? [];
    const regionLabel = regions[0]?.regionTypeLabel?.replace(/^Select\s+/i, '') || 'Region';

    const runQuery = (next, { append = false, page = 1 } = {}) => {
        append ? setLoadingMore(true) : setLoading(true);
        router.get('/provider', { ...next, seed, page, perPage: PER_PAGE }, {
            preserveState: true, preserveScroll: true, replace: true,
            only: ['providers', 'pagination', 'seed'],
            onSuccess: (pageObj) => {
                const fresh = pageObj.props.providers || [];
                setItems((prev) => (append ? [...prev, ...fresh] : fresh));
                setMeta(pageObj.props.pagination || {});
                setSeed(pageObj.props.seed || seed);
            },
            onFinish: () => { setLoading(false); setLoadingMore(false); },
        });
    };

    const patch = (partial, { search = true } = {}) => { const next = { ...fRef.current, ...partial }; setF(next); if (search) runQuery(next, { append: false, page: 1 }); };

    const toggleAreas = (areasToToggle) => {
        const s = new Set(fRef.current.areas);
        const allIn = areasToToggle.every((a) => s.has(a));
        areasToToggle.forEach((a) => (allIn ? s.delete(a) : s.add(a)));
        patch({ areas: Array.from(s) });
    };
    const removeArea = (area) => { const s = new Set(fRef.current.areas); s.delete(area); patch({ areas: Array.from(s) }); };

    // Keyword now searches on submit (button/Enter), not on every keystroke.
    const onKeyword = (val) => patch({ keyword: val });

    const clearAll = () => {
        const empty = { location: '', region: '', include_virtual: false, areas: [], payment: '', insurer: '', fee_min: '', fee_max: '', population: '', session_format: '', language: [], provider_type: '', accepting: false, keyword: '' };
        setF(empty); runQuery(empty, { append: false, page: 1 });
    };

    const onFind = () => { runQuery(fRef.current, { append: false, page: 1 }); resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    const loadMore = () => runQuery(fRef.current, { append: true, page: (meta.currentPage || 1) + 1 });

    const activeChips = useMemo(() => {
        const chips = [];
        if (f.location) chips.push({ key: 'location', label: f.location, clear: () => patch({ location: '', region: '' }) });
        if (f.region) chips.push({ key: 'region', label: f.region, clear: () => patch({ region: '' }) });
        if (f.include_virtual) chips.push({ key: 'virtual', label: 'Virtual', clear: () => patch({ include_virtual: false }) });
        f.areas.forEach((a) => chips.push({ key: `area:${a}`, label: a, clear: () => removeArea(a) }));
        if (f.fee_min || f.fee_max) chips.push({ key: 'price', label: `$${f.fee_min || '0'}–$${f.fee_max || '∞'}`, clear: () => patch({ fee_min: '', fee_max: '' }) });
        if (f.payment) chips.push({ key: 'payment', label: PAYMENT_LABEL[f.payment], clear: () => patch({ payment: '', insurer: '' }) });
        if (f.insurer) chips.push({ key: 'insurer', label: f.insurer, clear: () => patch({ insurer: '' }) });
        f.language.forEach((l) => chips.push({ key: `lang:${l}`, label: l, clear: () => patch({ language: f.language.filter((x) => x !== l) }) }));
        if (f.population) chips.push({ key: 'population', label: f.population, clear: () => patch({ population: '' }) });
        if (f.session_format) chips.push({ key: 'session_format', label: f.session_format, clear: () => patch({ session_format: '' }) });
        if (f.provider_type) chips.push({ key: 'provider_type', label: f.provider_type, clear: () => patch({ provider_type: '' }) });
        if (f.accepting) chips.push({ key: 'accepting', label: 'Accepting new clients', clear: () => patch({ accepting: false }) });
        if (f.keyword) chips.push({ key: 'keyword', label: `“${f.keyword}”`, clear: () => patch({ keyword: '' }) });
        return chips;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [f]);

    const hasAnySelection = activeChips.length > 0;
    const total = meta.total ?? items.length;
    const extraSelectedCount = f.areas.filter((a) => !COMMON_SUPPORT_AREAS.some((c) => c.areas.includes(a))).length;

    return (
        <div className="min-h-screen bg-[#F7F3EC] text-[#1F2A2E]">
            <Head title="Find the right support — Bahali" />
            <Header />

            <SeeAllAreasModal open={showAreasModal} onClose={() => setShowAreasModal(false)} selected={f.areas} onApply={(next) => { setShowAreasModal(false); patch({ areas: next }); }} />

            <div className="mx-auto max-w-6xl px-5 py-8">
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2543B]">Find culturally-grounded care</p>
                    <h1 className="mt-2 text-3xl leading-tight text-[#16302F] md:text-4xl" style={SERIF}>Let’s help you find support</h1>
                    <p className="mt-2 max-w-xl text-[15px] text-[#5B6B6E]">Answer as much or as little as you like. You don’t need to know what kind of professional you’re looking for.</p>
                </div>

                {isCrisisQuery(f.keyword) && (
                    <div role="alert" className="mb-6 rounded-2xl border border-[#E7B7A6] bg-[#FBF0EB] p-4 text-sm text-[#8A3F27]">
                        <p className="font-semibold">If you’re in immediate danger, please contact your local emergency services or a crisis line right away.</p>
                        <p className="mt-1 text-[#9A5A44]">Bahali is a directory to help you find a provider — it is not an emergency service and cannot provide crisis support.</p>
                    </div>
                )}

                {/* ============ FIND SUPPORT (guide §2) ============ */}
                <section aria-labelledby="find-support-heading" className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)] sm:p-6">
                    <h2 id="find-support-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C2543B]">Find support</h2>
                    <div className="mt-5 space-y-6">
                        <div>
                            <h3 className="text-[15px] font-semibold text-[#16302F]">Where are you looking for support?</h3>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                <LabeledSelect id="q-location" label="Country or territory" value={f.location} onChange={(v) => patch({ location: v, region: '' })} options={countries.map((c) => c.name)} placeholder="Anywhere" />
                                {f.location && regions.length > 0 && (
                                    <LabeledSelect id="q-region" label={regionLabel} value={f.region} onChange={(v) => patch({ region: v })} options={regions.map((r) => r.name)} placeholder={`All ${regionLabel.toLowerCase()}s`} />
                                )}
                            </div>
                            <label className="mt-3 inline-flex cursor-pointer items-center gap-2.5 text-sm text-[#3A4B49]">
                                <input type="checkbox" checked={f.include_virtual} onChange={(e) => patch({ include_virtual: e.target.checked })} className="h-4 w-4 rounded border-[#B9C2C0] text-[#0E7C7B] focus:ring-[#0E7C7B]" />
                                Also include virtual providers
                            </label>
                        </div>

                        <div>
                            <h3 className="text-[15px] font-semibold text-[#16302F]">What would you like help with?</h3>
                            <div role="group" aria-label="Common areas of support" className="mt-3 flex flex-wrap gap-2">
                                {COMMON_SUPPORT_AREAS.map((chip) => {
                                    const active = chip.areas.every((a) => f.areas.includes(a));
                                    return (
                                        <button key={chip.label} type="button" aria-pressed={active} onClick={() => toggleAreas(chip.areas)}
                                            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7C7B]/40 ${active ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white' : 'border-[#DED7C9] bg-white text-[#3A4B49] hover:border-[#0E7C7B]/40 hover:bg-[#0E7C7B]/5'}`}>
                                            {active && <span aria-hidden className="mr-1">✓</span>}{chip.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <button type="button" onClick={() => setShowAreasModal(true)} className="mt-3 text-sm font-medium text-[#C2543B] underline underline-offset-2 hover:opacity-80">
                                See all areas of support{extraSelectedCount > 0 ? ` (${extraSelectedCount} more selected)` : ''}
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <button type="button" onClick={onFind} className="inline-flex items-center gap-2 rounded-xl bg-[#0E7C7B] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B6463] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7C7B]/40">
                                Find providers
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* ============ RESULTS + REFINE (guide §4/§6) ============ */}
                <div ref={resultsRef} className="mt-8 scroll-mt-24">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-lg text-[#16302F]" style={SERIF} aria-live="polite">
                            {loading ? 'Searching…' : (<><span className="font-semibold">{total}</span> {'provider' + (total === 1 ? '' : 's')}{hasAnySelection ? ' match your search' : ''}</>)}
                        </p>
                        <button type="button" onClick={() => setShowRefine((s) => !s)} className="inline-flex items-center gap-2 rounded-xl border border-[#DED7C9] bg-white px-4 py-2.5 text-sm font-medium text-[#3A4B49] hover:border-[#0E7C7B]/40" aria-expanded={showRefine} aria-controls="refine-panel">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 6h16M7 12h10M10 18h4" /></svg>
                            Refine your search
                        </button>
                    </div>

                    {hasAnySelection && (
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            {activeChips.map((c) => (
                                <button key={c.key} onClick={c.clear} className="group inline-flex items-center gap-1.5 rounded-full border border-[#DFE9E6] bg-[#0E7C7B]/10 px-3 py-1 text-xs font-medium text-[#0E7C7B] transition hover:bg-[#0E7C7B]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7C7B]/40" aria-label={`Remove ${c.label}`}>
                                    {c.label}
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
                                </button>
                            ))}
                            <button onClick={clearAll} className="text-xs font-medium text-[#5B6B6E] underline underline-offset-2 hover:text-[#0E7C7B]">Clear all</button>
                        </div>
                    )}

                    <div className="flex flex-col gap-6 lg:flex-row">
                        {showRefine && (
                            <aside id="refine-panel" className="w-full flex-shrink-0 lg:w-72">
                                <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5 lg:sticky lg:top-24">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-[15px] font-semibold text-[#16302F]">Refine your search</h3>
                                        <button onClick={clearAll} className="text-xs font-medium text-[#C2543B] underline underline-offset-2 hover:opacity-80">Clear all</button>
                                    </div>
                                    <RefinePanel f={f} patch={patch} onKeyword={onKeyword} filterOptions={filterOptions} />
                                </div>
                            </aside>
                        )}

                        <main className="min-w-0 flex-1">
                            {loading ? (
                                <div className="grid grid-cols-1 gap-5">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>
                            ) : items.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-[#D9CFBA] bg-white/70 p-8 text-center sm:p-12">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFEAE0] text-[#9AA6A4]">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                                    </div>
                                    <h3 className="text-lg text-[#16302F]" style={SERIF}>We didn’t find an exact match for your selections</h3>
                                    <p className="mx-auto mt-1 max-w-md text-sm text-[#5B6B6E]">Try including virtual providers, expanding your location, or removing one preference.</p>
                                    <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                                        {!f.include_virtual && <button onClick={() => patch({ include_virtual: true })} className="rounded-xl bg-[#0E7C7B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B6463]">Include virtual providers</button>}
                                        {(f.location || f.region) && <button onClick={() => patch({ location: '', region: '' })} className="rounded-xl border border-[#DED7C9] bg-white px-4 py-2.5 text-sm font-medium text-[#3A4B49] hover:border-[#0E7C7B]/40">Expand search area</button>}
                                        {(f.fee_min || f.fee_max) && <button onClick={() => patch({ fee_min: '', fee_max: '' })} className="rounded-xl border border-[#DED7C9] bg-white px-4 py-2.5 text-sm font-medium text-[#3A4B49] hover:border-[#0E7C7B]/40">Remove price range</button>}
                                        {f.payment && <button onClick={() => patch({ payment: '', insurer: '' })} className="rounded-xl border border-[#DED7C9] bg-white px-4 py-2.5 text-sm font-medium text-[#3A4B49] hover:border-[#0E7C7B]/40">Remove payment preference</button>}
                                        <button onClick={clearAll} className="rounded-xl border border-[#DED7C9] bg-white px-4 py-2.5 text-sm font-medium text-[#3A4B49] hover:border-[#0E7C7B]/40">View all providers</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-5">{items.map((p) => <ProviderCard key={p.id} p={p} selectedAreas={f.areas} />)}</div>
                            )}

                            {meta.hasMore && items.length > 0 && !loading && (
                                <div className="mt-8 flex flex-col items-center gap-2">
                                    <button onClick={loadMore} disabled={loadingMore} className="inline-flex items-center gap-2 rounded-xl bg-[#0E7C7B] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#0B6463] disabled:opacity-60">
                                        {loadingMore ? (<><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden><path d="M21 12a9 9 0 1 1-6.2-8.5" /></svg>Loading…</>) : 'Load more providers'}
                                    </button>
                                    <span className="text-xs text-[#6B7A78]">Showing {items.length} of {total}</span>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
