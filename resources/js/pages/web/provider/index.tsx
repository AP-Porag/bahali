import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SERIF = { fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' };
const PER_PAGE = 6; // Laravel controller default-er sathe mil

/* ---------------------------------------------------------------------- */
/*  Needs-first option lists                                               */
/* ---------------------------------------------------------------------- */

/**
 * Featured "needs" shown first under "What would you like help with?".
 * NOTE: egulo real provider_support_areas.area value-er sathe match kora
 * uchit (AreasOfSupport::GROUPS). "See all" er full list backend theke ashe.
 */
const FEATURED_NEEDS = [
    'Anxiety & Worry',
    'Depression & Low Mood',
    'Grief & Loss',
    'Stress & Burnout',
    'Trauma & PTSD',
    'Relationships & Family',
    'Life Changes & Transitions',
    'Caribbean & Diaspora Wellness',
];

const PAYMENT_OPTIONS = [
    { key: 'insurance', label: 'Insurance' },
    { key: 'self_pay', label: 'Self-pay' },
    { key: 'sliding_scale', label: 'Sliding scale' },
    { key: 'free_low_cost', label: 'Free or low-cost' },
];
const PAYMENT_LABEL = Object.fromEntries(PAYMENT_OPTIONS.map((o) => [o.key, o.label]));

// Populations / provider types / services etc. come from backend filterOptions.
const REFINE_META = {
    population: 'Who it’s for',
    session_format: 'Meeting format',
    language: 'Language',
    provider_type: 'Provider type',
    service: 'Service',
};

// Very light crisis-term detector (client asks for a safety notice; exact
// crisis content to be reviewed separately before publication).
const CRISIS_TERMS = [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'self harm', 'self-harm',
    'hurt myself', 'emergency', 'crisis', 'overdose',
];
const isCrisisQuery = (kw = '') => {
    const t = kw.toLowerCase();
    return CRISIS_TERMS.some((term) => t.includes(term));
};

function initials(name = '') {
    return (
        name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'B'
    );
}

/* ---------------------------------------------------------------------- */
/*  Small pieces                                                          */
/* ---------------------------------------------------------------------- */

function Chip({ children, tone = 'teal' }) {
    const tones = {
        teal: 'bg-[#0E7C7B]/10 text-[#0E7C7B]',
        sand: 'bg-[#F4EEE0] text-[#8A6D3B]',
        coral: 'bg-[#F6E6DF] text-[#C2543B]',
        plain: 'bg-[#EFEAE0] text-[#5B6B6E]',
        amber: 'bg-[#E8B84B]/18 text-[#9A6B12]',
    };
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
            {children}
        </span>
    );
}

// function LabeledSelect({ id, label, value, onChange, options = [], placeholder = 'All' }) {
//     return (
//         <div>
//             <label htmlFor={id} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#6B7A78]">
//                 {label}
//             </label>
//             <Select value={value || 'all'} onValueChange={(v) => onChange(v === 'all' ? '' : v)}>
//                 <SelectTrigger
//                     id={id}
//                     className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20 ${value ? 'border-[#0E7C7B]/40 text-[#1F2A2E]' : 'border-[#DED7C9] text-[#5B6B6E]'
//                         }`}
//                 >
//                     <SelectValue placeholder={placeholder} />
//                 </SelectTrigger>
//                 <SelectContent>
//                     <SelectItem value="all">{placeholder}</SelectItem>
//                     {options.map((opt) => (
//                         <SelectItem key={opt} value={opt}>{opt}</SelectItem>
//                     ))}
//                 </SelectContent>
//             </Select>
//         </div>
//     );
// }

function LabeledSelect({ id, label, value, onChange, options = [], placeholder = 'All' }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#6B7A78]">
                {label}
            </label>
            <Select value={value || 'all'} onValueChange={(v) => onChange(v === 'all' ? '' : v)}>
                <SelectTrigger
                    id={id}
                    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20 ${value ? 'border-[#0E7C7B]/40 text-[#1F2A2E]' : 'border-[#DED7C9] text-[#5B6B6E]'
                        }`}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{placeholder}</SelectItem>
                    {options.map((opt) => {
                        const optionValue = typeof opt === 'string' ? opt : opt.value;
                        const optionLabel = typeof opt === 'string' ? opt : opt.label;
                        return (
                            <SelectItem key={optionValue} value={optionValue}>
                                {optionLabel}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}

/* ---------------------------------------------------------------------- */
/*  Provider card (redesigned per client card spec)                       */
/* ---------------------------------------------------------------------- */

function ProviderCard({ p, selectedAreas = [] }) {
    const [imgError, setImgError] = useState(false);

    // Matched Areas of Support first (client: "show items matching search first")
    const specialties = useMemo(() => {
        const all = p.specialties || [];
        if (!selectedAreas.length) return all.slice(0, 3);
        const matched = all.filter((a) => selectedAreas.includes(a));
        const rest = all.filter((a) => !selectedAreas.includes(a));
        return [...matched, ...rest].slice(0, 3);
    }, [p.specialties, selectedAreas]);

    const formatLabel = { in_person: 'In person', virtual: 'Virtual', both: 'In person & virtual' }[p.formatKey]
        || (p.sessionFormat && p.sessionFormat !== 'Not specified' ? p.sessionFormat : null);

    const insurers = p.insurances || [];
    const shownInsurers = insurers.slice(0, 2);
    const extraInsurers = Math.max(0, insurers.length - shownInsurers.length);

    const showPhoto = p.photo && !imgError;

    return (
        <article className="group flex flex-col rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)] transition hover:-translate-y-0.5 hover:border-[#DCD0BA] hover:shadow-[0_10px_30px_-12px_rgba(14,124,123,0.25)]">
            {/* header */}
            <div className="flex items-start gap-4">
                {showPhoto ? (
                    <img
                        src={p.photo}
                        alt={`${p.name}`}
                        onError={() => setImgError(true)}
                        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover ring-1 ring-black/5"
                    />
                ) : (
                    // Polished neutral placeholder — never a broken image.
                    <div
                        aria-hidden
                        className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0E4C4B] to-[#0E7C7B] font-serif text-lg text-white/90 ring-1 ring-black/5"
                        style={SERIF}
                    >
                        {initials(p.name)}
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[19px] leading-tight text-[#16302F]" style={SERIF}>
                        {p.name}{p.credentials ? <span className="text-[15px] font-normal text-[#5B6B6E]">, {p.credentials}</span> : null}
                    </h3>
                    {p.title && <p className="mt-0.5 line-clamp-2 text-sm text-[#5B6B6E]">{p.title}</p>}

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B7A78]">
                        {p.location && (
                            <span className="inline-flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                                    <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" /><circle cx="12" cy="11" r="2" />
                                </svg>
                                {p.location}
                            </span>
                        )}
                        {formatLabel && <span>{formatLabel}</span>}
                    </div>
                </div>
            </div>

            {/* Can help with */}
            {specialties.length > 0 && (
                <div className="mt-4">
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A9795]">Can help with</p>
                    <div className="flex flex-wrap gap-1.5">
                        {specialties.map((s) => (
                            <Chip key={s} tone={selectedAreas.includes(s) ? 'teal' : 'plain'}>{s}</Chip>
                        ))}
                    </div>
                </div>
            )}

            {/* Works with + languages */}
            {(p.populations?.length > 0 || p.languages?.length > 0) && (
                <div className="mt-3 space-y-1.5 text-xs text-[#5B6B6E]">
                    {p.populations?.length > 0 && (
                        <p><span className="font-semibold text-[#3A4B49]">Works with:</span> {p.populations.slice(0, 3).join(' · ')}</p>
                    )}
                    {p.languages?.length > 0 && (
                        <p><span className="font-semibold text-[#3A4B49]">Languages:</span> {p.languages.join(', ')}</p>
                    )}
                </div>
            )}

            {/* Cost / payment */}
            <div className="mt-4 space-y-2 border-t border-[#EFEAE0] pt-4">
                {p.fee && (
                    <p className="text-sm font-semibold text-[#16302F]">{p.fee}</p>
                )}
                <div className="flex flex-wrap items-center gap-1.5">
                    {shownInsurers.length > 0 && (
                        <span className="text-xs text-[#5B6B6E]">
                            <span className="font-semibold text-[#3A4B49]">Insurance:</span> {shownInsurers.join(' · ')}{extraInsurers > 0 ? ` +${extraInsurers}` : ''}
                        </span>
                    )}
                    {p.slidingScale && <Chip tone="amber">Sliding scale</Chip>}
                    {p.freeLowCost && <Chip tone="amber">Free / low-cost</Chip>}
                    {!p.fee && !shownInsurers.length && !p.slidingScale && !p.freeLowCost && p.selfPay && (
                        <Chip tone="plain">Self-pay</Chip>
                    )}
                </div>
            </div>

            {/* status row */}
            <div className="mt-4 flex items-center justify-between border-t border-[#EFEAE0] pt-4">
                <div className="flex flex-wrap items-center gap-2">
                    {p.acceptingNewClients === true && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E6B6A]">
                            <span className="h-2 w-2 rounded-full bg-[#0E7C7B]" /> Accepting new clients
                        </span>
                    )}
                    {p.acceptingNewClients === false && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#8A9795]">
                            <span className="h-2 w-2 rounded-full bg-[#C9CFCE]" /> Not accepting new clients
                        </span>
                    )}
                    {p.verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0E6B6A]">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                                <path d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Credentials verified
                        </span>
                    )}
                </div>

                <Link
                    href={`/provider/${p.id}`}
                    className="inline-flex items-center gap-1 rounded-lg px-1 text-sm font-semibold text-[#0E7C7B] transition group-hover:gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7C7B]/40"
                    aria-label={`View profile for ${p.name}`}
                >
                    View profile
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </Link>
            </div>
        </article>
    );
}

function CardSkeleton() {
    return (
        <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5">
            <div className="flex gap-4">
                <div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-xl bg-[#EFEAE0]" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-[#EFEAE0]" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-[#F2EDE2]" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-[#F2EDE2]" />
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <div className="h-6 w-24 animate-pulse rounded-full bg-[#F2EDE2]" />
                <div className="h-6 w-16 animate-pulse rounded-full bg-[#F2EDE2]" />
            </div>
        </div>
    );
}

/* ---------------------------------------------------------------------- */
/*  Page                                                                  */
/* ---------------------------------------------------------------------- */

export default function Directory({
    providers = [],
    pagination = {},
    filterOptions = {},
    filters = {},
    seed: initialSeed = 0,
}) {
    const [items, setItems] = useState(providers);
    const [meta, setMeta] = useState(pagination);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [seed, setSeed] = useState(initialSeed);
    const [showAllAreas, setShowAllAreas] = useState(false);
    const [showRefine, setShowRefine] = useState(false);

    const resultsRef = useRef(null);

    useEffect(() => { setSeed(initialSeed); }, [initialSeed]);

    const [f, setF] = useState({
        // primary
        location: filters.location || '',
        include_virtual: !!filters.include_virtual,
        areas: Array.isArray(filters.areas) ? filters.areas : [],
        payment: filters.payment || '',
        insurer: filters.insurer || '',
        // refine
        population: filters.population || '',
        session_format: filters.session_format || '',
        language: filters.language || '',
        provider_type: filters.provider_type || '',
        service: filters.service || '',
        // free keyword (refine / browse)
        keyword: filters.keyword || '',
    });

    const fRef = useRef(f);
    fRef.current = f;
    const kwTimer = useRef(null);

    const runQuery = (next, { append = false, page = 1 } = {}) => {
        append ? setLoadingMore(true) : setLoading(true);
        router.get(
            '/provider',
            { ...next, seed, page, perPage: PER_PAGE },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['providers', 'pagination', 'seed'],
                onSuccess: (pageObj) => {
                    const fresh = pageObj.props.providers || [];
                    setItems((prev) => (append ? [...prev, ...fresh] : fresh));
                    setMeta(pageObj.props.pagination || {});
                    setSeed(pageObj.props.seed || seed);
                },
                onFinish: () => { setLoading(false); setLoadingMore(false); },
            },
        );
    };

    const patch = (partial, { search = true } = {}) => {
        const next = { ...fRef.current, ...partial };
        setF(next);
        if (search) runQuery(next, { append: false, page: 1 });
    };

    const toggleArea = (area) => {
        const set = new Set(fRef.current.areas);
        set.has(area) ? set.delete(area) : set.add(area);
        patch({ areas: Array.from(set) });
    };

    const onKeyword = (val) => {
        setF((prev) => ({ ...prev, keyword: val }));
        clearTimeout(kwTimer.current);
        kwTimer.current = setTimeout(() => {
            runQuery({ ...fRef.current, keyword: val }, { append: false, page: 1 });
        }, 350);
    };

    const clearAll = () => {
        const empty = {
            location: '', include_virtual: false, areas: [], payment: '', insurer: '',
            population: '', session_format: '', language: '', provider_type: '', service: '', keyword: '',
        };
        setF(empty);
        runQuery(empty, { append: false, page: 1 });
    };

    const onFind = () => {
        runQuery(fRef.current, { append: false, page: 1 });
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const loadMore = () =>
        runQuery(fRef.current, { append: true, page: (meta.currentPage || 1) + 1 });

    /* -------- active selections (removable) -------- */
    const activeChips = useMemo(() => {
        const chips = [];
        if (f.location) chips.push({ key: 'location', label: f.location, clear: () => patch({ location: '' }) });
        if (f.include_virtual) chips.push({ key: 'virtual', label: 'Virtual', clear: () => patch({ include_virtual: false }) });
        f.areas.forEach((a) => chips.push({ key: `area:${a}`, label: a, clear: () => toggleArea(a) }));
        if (f.payment) chips.push({ key: 'payment', label: PAYMENT_LABEL[f.payment], clear: () => patch({ payment: '', insurer: '' }) });
        if (f.insurer) chips.push({ key: 'insurer', label: f.insurer, clear: () => patch({ insurer: '' }) });
        (['population', 'session_format', 'language', 'provider_type', 'service']).forEach((k) => {
            if (f[k]) chips.push({ key: k, label: f[k], clear: () => patch({ [k]: '' }) });
        });
        if (f.keyword) chips.push({ key: 'keyword', label: `“${f.keyword}”`, clear: () => onKeyword('') });
        return chips;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [f]);

    const hasAnySelection = activeChips.length > 0;
    const total = meta.total ?? items.length;
    const areaList = showAllAreas ? (filterOptions.areasOfSupport || []) : FEATURED_NEEDS;

    return (
        <div className="min-h-screen bg-[#F7F3EC] text-[#1F2A2E]">
            <Head title="Find the right support — Bahali" />
            <Header />

            <div className="mx-auto max-w-6xl px-5 py-8">
                {/* hero */}
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2543B]">Find culturally-grounded care</p>
                    <h1 className="mt-2 text-3xl leading-tight text-[#16302F] md:text-4xl" style={SERIF}>
                        Let’s help you find support
                    </h1>
                    <p className="mt-2 max-w-xl text-[15px] text-[#5B6B6E]">
                        Answer as much or as little as you like. You don’t need to know what kind of professional you’re looking for.
                    </p>
                </div>

                {/* crisis safety notice */}
                {isCrisisQuery(f.keyword) && (
                    <div role="alert" className="mb-6 rounded-2xl border border-[#E7B7A6] bg-[#FBF0EB] p-4 text-sm text-[#8A3F27]">
                        <p className="font-semibold">If you’re in immediate danger, please contact your local emergency services or a crisis line right away.</p>
                        <p className="mt-1 text-[#9A5A44]">Bahali is a directory to help you find a provider — it is not an emergency service and cannot provide crisis support.</p>
                    </div>
                )}

                {/* ============ FIND THE RIGHT SUPPORT ============ */}
                <section aria-labelledby="find-support-heading" className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)] sm:p-6">
                    <h2 id="find-support-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C2543B]">
                        Find the right support
                    </h2>

                    <div className="mt-5 space-y-6">
                        {/* 3.1 Where */}
                        <div>
                            <h3 className="text-[15px] font-semibold text-[#16302F]">Where do you need support?</h3>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                <LabeledSelect
                                    id="q-location"
                                    label="Country or territory"
                                    value={f.location}
                                    onChange={(v) => patch({ location: v })}
                                    options={filterOptions.locations || []}
                                    placeholder="Anywhere"
                                />
                                <div className="flex items-end">
                                    <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#DED7C9] bg-[#FBF8F2] px-3.5 py-2.5 text-sm text-[#3A4B49] focus-within:ring-2 focus-within:ring-[#0E7C7B]/20">
                                        <input
                                            type="checkbox"
                                            checked={f.include_virtual}
                                            onChange={(e) => patch({ include_virtual: e.target.checked })}
                                            className="h-4 w-4 rounded border-[#B9C2C0] text-[#0E7C7B] focus:ring-[#0E7C7B]"
                                        />
                                        Also include virtual providers
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* 3.2 What */}
                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-[15px] font-semibold text-[#16302F]">What would you like help with?</h3>
                                <Link href="/provider" onClick={(e) => { e.preventDefault(); clearAll(); }} className="text-xs font-medium text-[#0E7C7B] underline underline-offset-2 hover:text-[#0B6463]">
                                    Not sure? Browse all providers
                                </Link>
                            </div>
                            <div role="group" aria-label="Areas of support" className="mt-3 flex flex-wrap gap-2">
                                {areaList.map((need) => {
                                    const active = f.areas.includes(need);
                                    return (
                                        <button
                                            key={need}
                                            type="button"
                                            aria-pressed={active}
                                            onClick={() => toggleArea(need)}
                                            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7C7B]/40 ${active
                                                ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white'
                                                : 'border-[#DED7C9] bg-white text-[#3A4B49] hover:border-[#0E7C7B]/40 hover:bg-[#0E7C7B]/5'
                                                }`}
                                        >
                                            {active && <span aria-hidden className="mr-1">✓</span>}
                                            {need}
                                        </button>
                                    );
                                })}
                            </div>
                            {(filterOptions.areasOfSupport?.length || 0) > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setShowAllAreas((s) => !s)}
                                    className="mt-3 text-sm font-medium text-[#0E7C7B] underline underline-offset-2 hover:text-[#0B6463]"
                                >
                                    {showAllAreas ? 'Show fewer areas' : 'See all areas of support'}
                                </button>
                            )}
                        </div>

                        {/* 3.3 Payment */}
                        <div>
                            <h3 className="text-[15px] font-semibold text-[#16302F]">What payment options work for you?</h3>
                            <div role="radiogroup" aria-label="Payment options" className="mt-3 flex flex-wrap gap-2">
                                {PAYMENT_OPTIONS.map((opt) => {
                                    const active = f.payment === opt.key;
                                    return (
                                        <button
                                            key={opt.key}
                                            type="button"
                                            role="radio"
                                            aria-checked={active}
                                            onClick={() => patch({ payment: active ? '' : opt.key, insurer: active ? '' : f.insurer })}
                                            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7C7B]/40 ${active
                                                ? 'border-[#C2543B] bg-[#F6E6DF] text-[#C2543B]'
                                                : 'border-[#DED7C9] bg-white text-[#3A4B49] hover:border-[#C2543B]/40'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {f.payment === 'insurance' && (filterOptions.insurers?.length || 0) > 0 && (
                                <div className="mt-3 max-w-xs">
                                    <LabeledSelect
                                        id="q-insurer"
                                        label="Which insurer? (optional)"
                                        value={f.insurer}
                                        onChange={(v) => patch({ insurer: v })}
                                        options={filterOptions.insurers || []}
                                        placeholder="Any insurer"
                                    />
                                </div>
                            )}
                        </div>

                        {/* 3.4 Primary action */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <button
                                type="button"
                                onClick={onFind}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#0E7C7B] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B6463] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7C7B]/40"
                            >
                                Find providers
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowRefine((s) => !s)}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#DED7C9] bg-white px-4 py-2.5 text-sm font-medium text-[#3A4B49] hover:border-[#0E7C7B]/40"
                                aria-expanded={showRefine}
                                aria-controls="refine-panel"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 6h16M7 12h10M10 18h4" /></svg>
                                Refine results
                            </button>
                        </div>
                    </div>

                    {/* ============ REFINE RESULTS (secondary) ============ */}
                    {showRefine && (
                        <div id="refine-panel" className="mt-6 rounded-2xl border border-[#EFE7D6] bg-[#FBF8F2] p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-[15px] font-semibold text-[#16302F]">Refine results</h3>
                                <button onClick={() => setShowRefine(false)} className="text-sm text-[#5B6B6E] hover:text-[#0E7C7B]">Done</button>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <LabeledSelect id="r-pop" label="Who is the support for?" value={f.population} onChange={(v) => patch({ population: v })} options={filterOptions.populations || []} />
                                <LabeledSelect id="r-fmt" label="How would you like to meet?" value={f.session_format} onChange={(v) => patch({ session_format: v })} options={filterOptions.sessionFormats || ['In Person', 'Telehealth', 'Both']} />
                                <LabeledSelect id="r-lang" label="Language" value={f.language} onChange={(v) => patch({ language: v })} options={filterOptions.languages || []} />
                                <LabeledSelect id="r-type" label="Provider type" value={f.provider_type} onChange={(v) => patch({ provider_type: v })} options={filterOptions.providerTypes || []} />
                                {/* <LabeledSelect id="r-svc" label="Services offered" value={f.service} onChange={(v) => patch({ service: v })} options={filterOptions.services || []} /> */}
                                <div>
                                    <label htmlFor="r-kw" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#6B7A78]">Keyword</label>
                                    <input
                                        id="r-kw"
                                        value={f.keyword}
                                        onChange={(e) => onKeyword(e.target.value)}
                                        placeholder="Name, specialty…"
                                        className="w-full rounded-xl border border-[#DED7C9] bg-white px-3.5 py-2.5 text-sm text-[#1F2A2E] outline-none transition focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* ============ RESULTS ============ */}
                <div ref={resultsRef} className="mt-8 scroll-mt-24">
                    {/* active selection chips */}
                    {hasAnySelection && (
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            {activeChips.map((c) => (
                                <button
                                    key={c.key}
                                    onClick={c.clear}
                                    className="group inline-flex items-center gap-1.5 rounded-full border border-[#DFE9E6] bg-[#0E7C7B]/10 px-3 py-1 text-xs font-medium text-[#0E7C7B] transition hover:bg-[#0E7C7B]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7C7B]/40"
                                    aria-label={`Remove ${c.label}`}
                                >
                                    {c.label}
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
                                </button>
                            ))}
                            <button onClick={clearAll} className="text-xs font-medium text-[#5B6B6E] underline underline-offset-2 hover:text-[#0E7C7B]">
                                Clear all
                            </button>
                        </div>
                    )}

                    <p className="mb-4 text-sm text-[#5B6B6E]" aria-live="polite">
                        {loading ? 'Searching…' : (
                            <>
                                <span className="font-semibold text-[#16302F]">{total}</span>{' '}
                                {hasAnySelection ? 'provider' + (total === 1 ? '' : 's') + ' matching your search' : 'provider' + (total === 1 ? '' : 's')}
                            </>
                        )}
                    </p>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
                        </div>
                    ) : items.length === 0 ? (
                        /* No-result recovery */
                        <div className="rounded-2xl border border-dashed border-[#D9CFBA] bg-white/70 p-8 text-center sm:p-12">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFEAE0] text-[#9AA6A4]">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                            </div>
                            <h3 className="text-lg text-[#16302F]" style={SERIF}>We didn’t find an exact match for your selections</h3>
                            <p className="mx-auto mt-1 max-w-md text-sm text-[#5B6B6E]">
                                Try including virtual providers, expanding your location, or removing one preference.
                            </p>
                            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                                {!f.include_virtual && (
                                    <button onClick={() => patch({ include_virtual: true })} className="rounded-xl bg-[#0E7C7B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B6463]">
                                        Include virtual providers
                                    </button>
                                )}
                                {f.location && (
                                    <button onClick={() => patch({ location: '' })} className="rounded-xl border border-[#DED7C9] bg-white px-4 py-2.5 text-sm font-medium text-[#3A4B49] hover:border-[#0E7C7B]/40">
                                        Expand search area
                                    </button>
                                )}
                                {f.payment && (
                                    <button onClick={() => patch({ payment: '', insurer: '' })} className="rounded-xl border border-[#DED7C9] bg-white px-4 py-2.5 text-sm font-medium text-[#3A4B49] hover:border-[#0E7C7B]/40">
                                        Remove payment preference
                                    </button>
                                )}
                                <button onClick={clearAll} className="rounded-xl border border-[#DED7C9] bg-white px-4 py-2.5 text-sm font-medium text-[#3A4B49] hover:border-[#0E7C7B]/40">
                                    View all providers
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {items.map((p) => <ProviderCard key={p.id} p={p} selectedAreas={f.areas} />)}
                        </div>
                    )}

                    {/* load more */}
                    {meta.hasMore && items.length > 0 && !loading && (
                        <div className="mt-8 flex flex-col items-center gap-2">
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#0E7C7B] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#0B6463] disabled:opacity-60"
                            >
                                {loadingMore ? (
                                    <>
                                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden><path d="M21 12a9 9 0 1 1-6.2-8.5" /></svg>
                                        Loading…
                                    </>
                                ) : 'Load more providers'}
                            </button>
                            <span className="text-xs text-[#6B7A78]">Showing {items.length} of {total}</span>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
