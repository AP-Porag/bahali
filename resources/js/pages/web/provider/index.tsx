import { Head, Link, router } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import ProviderMenu from '@/components/provider/ProviderMenu';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SERIF = { fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' };
const PER_PAGE = 6; // Laravel Controller-এর default-এর সাথে মিল

/* ------------------------- static filter options ------------------------- */
/* These mirror the registration form's option lists exactly, minus "Other" */

const POPULATIONS_SERVED = [
    'Infants & Toddlers (0–5)',
    'Children (6–12)',
    'Adolescents (13–17)',
    'Young Adults (18–25)',
    'Adults (26–64)',
    'Older Adults (65+)',
    'Parents',
    'Caregivers',
    'Couples',
    'Families',
    'Veterans',
    'Faith Leaders & Clergy',
    'Helping Professionals',
    'Educators',
    'First Responders',
    'Healthcare Professionals',
    'Community Leaders',
];

const TREATMENT_APPROACHES = [
    'Acceptance & Commitment Therapy (ACT)',
    'Cognitive Behavioral Therapy (CBT)',
    'Cognitive Processing Therapy (CPT)',
    'Dialectical Behavior Therapy (DBT)',
    'Eye Movement Desensitization & Reprocessing (EMDR)',
    'Exposure & Response Prevention (ERP)',
    'Family Systems Therapy',
    'Gottman Method',
    'Interpersonal Psychotherapy (IPT)',
    'Mindfulness-Based Approaches',
    'Motivational Interviewing (MI)',
    'Person-Centered Therapy',
    'Prolonged Exposure (PE)',
    'Psychodynamic Therapy',
    'Solution-Focused Brief Therapy (SFBT)',
    'Trauma-Focused Cognitive Behavioral Therapy (TF-CBT)',
    'Integrative / Eclectic Therapy',
];

const LANGUAGES = [
    'English',
    'Spanish',
    'Haitian Creole',
    'French',
    'Jamaican Patois',
    'Trinidadian Creole',
    'Dutch',
];

const SERVICE_FORMATS = [
    'In-Person',
    'Virtual',
    'Hybrid',
    'Home-Based / Mobile',
    'Group-Based',
    'School-Based',
];

const PAYMENT_METHODS = [
    'Self-Pay',
    'Insurance Accepted',
    'Medicaid',
    'Medicare',
    'Employee Assistance Programs (EAP)',
    'Sliding Scale',
    'Government-Funded',
    'Grant-Funded',
    'Donation-Based',
    'Pro Bono / Volunteer Services',
    'No-Cost Services',
];

const FILTER_META = {
    location: 'Location',
    area_of_support: 'Area of support',
    population: 'Population',
    service: 'Service',
    language: 'Language',
    session_format: 'Format',
    payment: 'Payment',
};

function initials(name = '') {
    return (
        name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'B'
    );
}

/* ----------------------------- small pieces ----------------------------- */

function Chip({ children, tone = 'teal' }) {
    const tones = {
        teal: 'bg-[#0E7C7B]/10 text-[#0E7C7B]',
        sand: 'bg-[#F4EEE0] text-[#8A6D3B]',
        coral: 'bg-[#F6E6DF] text-[#C2543B]',
        plain: 'bg-[#EFEAE0] text-[#5B6B6E]',
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
            {children}
        </span>
    );
}

function FilterSelect({ label, value, onChange, options = [] }) {
    return (
        <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#6B7A78]">
                {label}
            </label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger
                    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/15 ${value ? 'border-[#0E7C7B]/40 text-[#1F2A2E]' : 'border-[#DED7C9] text-[#5B6B6E]'
                        }`}
                >
                    <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                            {opt}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function ProviderCard({ p }) {


    const [imgError, setImgError] = useState(false);

    return (
        <article className="group flex flex-col rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)] transition hover:-translate-y-0.5 hover:border-[#DCD0BA] hover:shadow-[0_10px_30px_-12px_rgba(14,124,123,0.25)]">
            <div className="flex items-start gap-4">
                {p.photo && !imgError ? (
                    <img
                        src={p.photo}
                        alt={p.name}
                        onError={() => setImgError(true)}
                        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover ring-1 ring-black/5"
                    />
                ) : (
                    <img
                        src={`images/dummy-profile.jpg`}
                        alt={p.name}
                        onError={() => setImgError(true)} // if also fails, we might still show broken; better combine with initials
                        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover ring-1 ring-black/5"
                    />
                )}
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[19px] leading-tight text-[#16302F]" style={SERIF}>{p.name}</h3>
                    {p.title && (
                        <p className="mt-1 line-clamp-2 text-sm text-[#5B6B6E]">
                            {p.title}{p.credentials ? ` · ${p.credentials}` : ''}
                        </p>
                    )}
                    {p.location && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-[#6B7A78]">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" /><circle cx="12" cy="11" r="2" />
                            </svg>
                            {p.location}
                        </p>
                    )}
                </div>
            </div>

            {p.specialties?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.specialties.map((s) => <Chip key={s}>{s}</Chip>)}
                </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-[#EFEAE0] pt-4">
                <div className="flex flex-wrap items-center gap-1.5">
                    {p.sessionFormat && <Chip tone="sand">{p.sessionFormat}</Chip>}
                    {p.languages?.slice(0, 2).map((l) => <Chip key={l} tone="plain">{l}</Chip>)}
                </div>
                <Link
                    href={`/provider/${p.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#0E7C7B] transition group-hover:gap-2"
                >
                    View profile
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
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
                <div className="h-6 w-20 animate-pulse rounded-full bg-[#F2EDE2]" />
                <div className="h-6 w-16 animate-pulse rounded-full bg-[#F2EDE2]" />
            </div>
        </div>
    );
}

/* ------------------------------- page ------------------------------- */

export default function Directory({ providers = [], pagination = {}, filterOptions = {}, filters = {}, seed: initialSeed = 0, app_url = '' }) {
    const [items, setItems] = useState(providers);
    const [meta, setMeta] = useState(pagination);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [seed, setSeed] = useState(initialSeed);
    const directoryUrl = `${app_url.replace(/\/$/, '')}/provider`;

    useEffect(() => {
        setSeed(initialSeed);
    }, [initialSeed]);

    const [f, setF] = useState({
        keyword: filters.keyword || '',
        location: filters.location || '',
        area_of_support: filters.area_of_support || '',
        population: filters.population || '',
        service: filters.service || '',
        language: filters.language || '',
        session_format: filters.session_format || '',
        payment: filters.payment || '',
    });
    const filtersRef = useRef(f);
    filtersRef.current = f;
    const kwTimer = useRef(null);

    const runQuery = (nextFilters, { append = false, page = 1 } = {}) => {
        append ? setLoadingMore(true) : setLoading(true);
        router.get(
            '/provider',
            { ...nextFilters, seed, page, perPage: PER_PAGE },
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

    const setFilter = (key, val) => {
        const next = { ...filtersRef.current, [key]: val === 'all' ? '' : val };
        setF(next);
        runQuery(next, { append: false, page: 1 });
    };

    const onKeyword = (val) => {
        setF((prev) => ({ ...prev, keyword: val }));
        clearTimeout(kwTimer.current);
        kwTimer.current = setTimeout(() => {
            runQuery({ ...filtersRef.current, keyword: val }, { append: false, page: 1 });
        }, 350);
    };

    const clearAll = () => {
        const empty = { keyword: '', location: '', area_of_support: '', population: '', service: '', language: '', session_format: '', payment: '' };
        setF(empty);
        runQuery(empty, { append: false, page: 1 });
    };

    const loadMore = () => runQuery(filtersRef.current, { append: true, page: (meta.currentPage || 1) + 1 });

    const activeEntries = Object.entries(f).filter(([, v]) => v);
    const activeCount = activeEntries.length;
    const total = meta.total ?? items.length;

    /* -------- sidebar (search + filters) -------- */
    const Sidebar = (
        <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
            <div className="relative">
                <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA6A4]" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
                </svg>
                <input
                    value={f.keyword}
                    onChange={(e) => onKeyword(e.target.value)}
                    placeholder="Search providers…"
                    className="w-full rounded-xl border border-[#DED7C9] bg-[#FBF8F2] py-2.5 pl-10 pr-3 text-sm text-[#1F2A2E] outline-none transition focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/15"
                />
            </div>

            <div className="my-5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C2543B]">Filters</span>
                {activeCount > 0 && (
                    <button onClick={clearAll} className="text-xs font-medium text-[#5B6B6E] underline decoration-[#D9CFBA] underline-offset-2 hover:text-[#0E7C7B]">
                        Reset ({activeCount})
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <FilterSelect label="Location" value={f.location || 'all'} onChange={(v) => setFilter('location', v)} options={filterOptions.locations || []} />
                <FilterSelect label="Areas of Support" value={f.area_of_support || 'all'} onChange={(v) => setFilter('area_of_support', v)} options={filterOptions.areasOfSupport || []} />
                <FilterSelect label="Population Served" value={f.population || 'all'} onChange={(v) => setFilter('population', v)} options={POPULATIONS_SERVED} />
                <FilterSelect label="Services Offered" value={f.service || 'all'} onChange={(v) => setFilter('service', v)} options={TREATMENT_APPROACHES} />
                <FilterSelect label="Languages" value={f.language || 'all'} onChange={(v) => setFilter('language', v)} options={LANGUAGES} />
                <FilterSelect label="Session Format" value={f.session_format || 'all'} onChange={(v) => setFilter('session_format', v)} options={SERVICE_FORMATS} />
                <FilterSelect label="Insurance / Payment" value={f.payment || 'all'} onChange={(v) => setFilter('payment', v)} options={PAYMENT_METHODS} />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F7F3EC] text-[#1F2A2E]">
            <Head title="Find a Provider — Bahali" />

            {/* top bar */}

            <Header />
            {/* <header className="sticky top-0 z-20 border-b border-[#E7E0D2] bg-[#FBF8F2]/90 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0E7C7B]/10 text-[#0E7C7B]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2 3 2 6 0 8-2-2-2-5 0-8Zm-6 6c3 1 5 3 5 6-3 0-5-2-5-6Zm12 0c0 4-2 6-5 6 0-3 2-5 5-6ZM12 12c1 3 1 7 0 10-1-3-1-7 0-10Z" /></svg>
                        </span>
                        <span className="text-xl text-[#0E7C7B]" style={SERIF}>Bahali</span>
                    </Link>
                    <Link href="/directory" className="text-sm font-medium text-[#0E7C7B]">Provider Directory</Link>
                </div>
            </header> */}

            <div className="mx-auto max-w-7xl px-5 py-8">
                {/* hero */}
                <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2543B]">Find culturally-grounded care</p>
                    <h1 className="mt-2 text-3xl leading-tight text-[#16302F] md:text-4xl" style={SERIF}>Browse trusted providers</h1>
                    <p className="mt-2 max-w-xl text-[15px] text-[#5B6B6E]">
                        Verified providers serving Caribbean island communities and the diaspora — search by language, support area, location and more.
                    </p>
                </div>

                {/* mobile filter toggle */}
                <button
                    onClick={() => setShowFilters((s) => !s)}
                    className="mb-4 inline-flex items-center gap-2 rounded-xl border border-[#DED7C9] bg-white px-4 py-2.5 text-sm font-medium text-[#1F2A2E] lg:hidden"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
                    Filters{activeCount > 0 ? ` (${activeCount})` : ''}
                </button>

                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* LEFT: sticky sidebar */}
                    <aside className={`w-full flex-shrink-0 lg:block lg:w-[300px] ${showFilters ? 'block' : 'hidden'}`}>
                        <div className="lg:sticky lg:top-24">{Sidebar}</div>
                    </aside>

                    {/* RIGHT: results */}
                    <main className="min-w-0 flex-1">
                        {/* active filter chips */}
                        {activeCount > 0 && (
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                {activeEntries.map(([key, val]) => (
                                    <button
                                        key={key}
                                        onClick={() => setFilter(key, '')}
                                        className="group inline-flex items-center gap-1.5 rounded-full border border-[#DFE9E6] bg-[#0E7C7B]/10 px-3 py-1 text-xs font-medium text-[#0E7C7B] transition hover:bg-[#0E7C7B]/20"
                                    >
                                        <span className="text-[#5B6B6E]">{key === 'keyword' ? 'Search' : FILTER_META[key]}:</span>
                                        {val}
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 6l12 12M18 6 6 18" /></svg>
                                    </button>
                                ))}
                                <button onClick={clearAll} className="text-xs font-medium text-[#5B6B6E] underline underline-offset-2 hover:text-[#0E7C7B]">
                                    Clear all
                                </button>
                            </div>
                        )}

                        <p className="mb-4 text-sm text-[#5B6B6E]">
                            {loading ? 'Searching…' : (
                                <><span className="font-semibold text-[#16302F]">{total}</span> provider{total === 1 ? '' : 's'} found</>
                            )}
                        </p>

                        {loading ? (
                            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                                {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
                            </div>
                        ) : items.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-[#D9CFBA] bg-white/60 p-14 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFEAE0] text-[#9AA6A4]">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                                </div>
                                <h3 className="text-lg text-[#16302F]" style={SERIF}>No providers match your search</h3>
                                <p className="mt-1 text-sm text-[#5B6B6E]">Try removing a filter or searching a broader term.</p>
                                {activeCount > 0 && (
                                    <button onClick={clearAll} className="mt-4 rounded-xl bg-[#0E7C7B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B6463]">
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                                {items.map((p) => <ProviderCard key={p.id} p={p} />)}
                            </div>
                        )}

                        {/* Load more */}
                        {meta.hasMore && items.length > 0 && !loading && (
                            <div className="mt-8 flex flex-col items-center gap-2">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#0E7C7B] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#0B6463] disabled:opacity-60"
                                >
                                    {loadingMore ? (
                                        <>
                                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                                <path d="M21 12a9 9 0 1 1-6.2-8.5" />
                                            </svg>
                                            Loading…
                                        </>
                                    ) : (
                                        'Load more providers'
                                    )}
                                </button>
                                <span className="text-xs text-[#6B7A78]">Showing {items.length} of {total}</span>
                            </div>
                        )}
                    </main>
                </div>

            </div>
            <Footer />
        </div>
    );
}
