import AppLayout from '@/layouts/app-layout.js';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle, ArrowDown, ArrowRight, ArrowUp, BarChart3, Building2, Calendar, CheckCircle2, ClipboardList,
    Clock, FileText, Info, Layers, MapPin, Pencil, RefreshCw, Search, SearchX, ShieldAlert, ShieldCheck, Target,
    UserPlus, Users, XCircle, History, type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

/* ------------------------------------------------------------------ */
/*  Types (props from AdminDashboardService)                           */
/* ------------------------------------------------------------------ */
interface Kpi { count: number; change?: number | null }
interface ActionRow {
    key: string;
    label: string;
    icon: 'file' | 'shield' | 'pencil' | 'refresh';
    count: number;
    oldestDays: number | null;
    action: string;
    href: string | null;
    method?: 'post';
}
interface HealthSegment { key: 'complete' | 'needs_updates' | 'incomplete' | 'overdue'; label: string; count: number; percent: number }
interface CoverageRow { b: string; e: string[]; t: string[]; s: string[]; ip: boolean; v: boolean; c: string[]; a: string[] }
interface Gap { location: string; area: string; searches: number; providers: number; href: string }
interface Activity { type: string; text: string; name: string; at: string }

interface DashboardProps {
    range: number;
    ranges: number[];
    kpis: {
        published: Kpi;
        pending: Kpi;
        action: Kpi & { bahali: number; provider: number };
        verified: Kpi;
        searches: Kpi;
        zeroResults: Kpi;
    };
    actions: ActionRow[];
    verification: { verified: number; pending: number; unverified: number; organizations: number };
    health: { total: number; average: number; segments: HealthSegment[] };
    searchDemand: { location: string; count: number; percent: number }[];
    searchOutcomes: { total: number; withResults: number; zero: number; successRate: number | null };
    coverage: CoverageRow[];
    gaps: Gap[];
    activity: Activity[];
    links: { pending: string | null; verification: string | null; published: string | null; reminders: string | null };
}

/* ------------------------------------------------------------------ */
/*  Bahali look                                                        */
/* ------------------------------------------------------------------ */
const SERIF = { fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' };
const C = {
    teal: '#0E7C7B',
    tealDark: '#0E4C4B',
    tealSoft: '#9FD3CC',
    coral: '#C2543B',
    amber: '#E8B84B',
    ink: '#16302F',
    muted: '#5B6B6E',
    line: '#E7E0D2',
};

const breadcrumbs = [{ title: 'Dashboard', href: '/dashboard' }];

const nf = new Intl.NumberFormat('en-US');
const days = (n: number | null) => (n === null ? '—' : n === 0 ? 'Today' : `${n} day${n === 1 ? '' : 's'}`);

function when(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace('AM', 'a.m.').replace('PM', 'p.m.');
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === now.toDateString()) return `Today, ${time}`;
    if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`;
}

function initials(name: string) {
    return name.split(/\s+/).filter((w) => /[a-z]/i.test(w) && !/^(dr|mr|mrs|ms|rev)\.?$/i.test(w)).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('') || 'B';
}

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */
function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <section className={`min-w-0 rounded-2xl border border-[#E7E0D2] bg-white p-4 shadow-sm sm:p-5 ${className}`}>{children}</section>;
}

function CardHeader({ icon: Icon, title, extra, href, hint }: { icon: LucideIcon; title: ReactNode; extra?: ReactNode; href?: string | null; hint?: string }) {
    return (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
                <Icon className="h-5 w-5 flex-shrink-0 text-[#0E7C7B]" strokeWidth={1.8} />
                <h2 className="text-lg font-semibold leading-tight text-[#16302F]" style={SERIF}>{title}</h2>
                {hint && (
                    <span title={hint} className="text-[#9AA6A4]">
                        <Info className="h-4 w-4" />
                    </span>
                )}
            </div>
            <div className="flex items-center gap-3">
                {extra}
                {href && (
                    <Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-[#0E7C7B] hover:underline">
                        View all <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                )}
            </div>
        </div>
    );
}

function Trend({ change, goodWhen = 'up', note }: { change?: number | null; goodWhen?: 'up' | 'down'; note?: string }) {
    if (change === null || change === undefined) return <span className="text-xs text-[#9AA6A4]">{note ?? 'No earlier data'}</span>;
    const up = change >= 0;
    const good = goodWhen === 'up' ? up : !up;
    const Icon = up ? ArrowUp : ArrowDown;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${good ? 'bg-[#0E7C7B]/10 text-[#0B6463]' : 'bg-[#C2543B]/10 text-[#A33D29]'}`}>
            <Icon className="h-3 w-3" />
            {up ? '+' : ''}{change}%{note ? <span className="font-normal opacity-80"> {note}</span> : null}
        </span>
    );
}

function KpiCard({ icon: Icon, tone, value, label, footer }: { icon: LucideIcon; tone: 'teal' | 'coral'; value: number; label: string; footer: ReactNode }) {
    const toneCls = tone === 'teal' ? 'bg-[#0E7C7B]/10 text-[#0E7C7B]' : 'bg-[#C2543B]/10 text-[#C2543B]';
    return (
        <Card className="flex flex-col justify-between gap-3">
            <div className="flex items-start gap-3">
                <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${toneCls}`}>
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                    <p className="text-2xl font-semibold leading-none text-[#16302F] sm:text-3xl" style={SERIF}>{nf.format(value)}</p>
                    <p className="mt-1.5 text-sm leading-snug text-[#3A4B49]">{label}</p>
                </div>
            </div>
            <div>{footer}</div>
        </Card>
    );
}

/* Donut chart from segments (values add up to the total). */
function Donut({ segments, size = 150, stroke = 18, children }: { segments: { value: number; color: string }[]; size?: number; stroke?: number; children?: ReactNode }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const total = segments.reduce((s, x) => s + x.value, 0);
    let offset = 0;
    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EFEAE0" strokeWidth={stroke} />
                {total > 0 && segments.map((s, i) => {
                    const len = (s.value / total) * circ;
                    const el = (
                        <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={stroke}
                            strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-offset} />
                    );
                    offset += len;
                    return el;
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
        </div>
    );
}

function Empty({ children }: { children: ReactNode }) {
    return <p className="rounded-xl bg-[#FBF8F2] px-4 py-6 text-center text-sm text-[#6B7A78]">{children}</p>;
}

/* ------------------------------------------------------------------ */
/*  Provider Coverage by Location — grouped bars (filtered here)        */
/* ------------------------------------------------------------------ */
type CoverageMode = 'all' | 'in_person' | 'virtual';

function CoverageChart({ rows }: { rows: CoverageRow[] }) {
    const [mode, setMode] = useState<CoverageMode>('all');
    const [category, setCategory] = useState('');

    const categories = useMemo(() => Array.from(new Set(rows.flatMap((r) => r.c))).sort(), [rows]);

    const data = useMemo(() => {
        const base = new Map<string, number>();
        const serve = new Map<string, number>();
        rows.forEach((r) => {
            if (category && !r.c.includes(category)) return;
            if (mode === 'in_person' && !r.ip) return;
            if (mode === 'virtual' && !r.v) return;
            if (r.b) base.set(r.b, (base.get(r.b) ?? 0) + 1);
            // Where this provider can serve, for the chosen mode.
            const places = mode === 'in_person' ? [r.b, ...r.e] : mode === 'virtual' ? [r.b, ...r.t] : r.s;
            new Set(places.filter(Boolean)).forEach((p) => serve.set(p, (serve.get(p) ?? 0) + 1));
        });
        return Array.from(serve.keys())
            .map((loc) => ({ loc, base: base.get(loc) ?? 0, serve: serve.get(loc) ?? 0 }))
            .sort((a, b) => b.base - a.base || b.serve - a.serve)
            .slice(0, 5);
    }, [rows, mode, category]);

    const max = Math.max(4, ...data.map((d) => d.serve));
    const step = Math.ceil(max / 4);
    const top = step * 4;
    const W = 440, H = 230, L = 30, B = 40, T = 18;
    const plotH = H - B - T;
    const slot = (W - L) / Math.max(data.length, 1);
    const bw = Math.min(30, slot / 3);
    const y = (v: number) => T + plotH - (v / top) * plotH;

    const pill = (value: CoverageMode, label: string) => (
        <button key={value} type="button" onClick={() => setMode(value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${mode === value ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white' : 'border-[#DED7C9] bg-white text-[#3A4B49] hover:bg-[#F7F3EC]'}`}>
            {label}
        </button>
    );

    return (
        <>
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="max-w-full rounded-lg border border-[#DED7C9] bg-white px-2.5 py-1 text-xs text-[#3A4B49] outline-none focus:border-[#0E7C7B]">
                    <option value="">All services</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex gap-1.5">
                    {pill('all', 'All')}
                    {pill('in_person', 'In-person')}
                    {pill('virtual', 'Virtual')}
                </div>
            </div>
            <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5B6B6E]">
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: C.teal }} />Provider base location</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: C.tealSoft }} />Available to serve (incl. virtual)</span>
            </div>
            {data.length === 0 ? (
                <Empty>No published providers match this filter.</Empty>
            ) : (
                <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label="Provider coverage by location">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <g key={i}>
                            <line x1={L} x2={W} y1={y(i * step)} y2={y(i * step)} stroke="#EFEAE0" />
                            <text x={L - 6} y={y(i * step) + 4} textAnchor="end" fontSize="11" fill="#6B7A78">{i * step}</text>
                        </g>
                    ))}
                    {data.map((d, i) => {
                        const cx = L + slot * i + slot / 2;
                        const words = d.loc.split(' ');
                        const half = Math.ceil(words.length / 2);
                        const lines = d.loc.length > 12 && words.length > 1 ? [words.slice(0, half).join(' '), words.slice(half).join(' ')] : [d.loc];
                        return (
                            <g key={d.loc}>
                                <rect x={cx - bw - 2} y={y(d.base)} width={bw} height={Math.max(0, y(0) - y(d.base))} rx="2" fill={C.teal} />
                                <rect x={cx + 2} y={y(d.serve)} width={bw} height={Math.max(0, y(0) - y(d.serve))} rx="2" fill={C.tealSoft} />
                                <text x={cx - bw / 2 - 2} y={y(d.base) - 5} textAnchor="middle" fontSize="12" fontWeight="600" fill={C.ink}>{d.base}</text>
                                <text x={cx + bw / 2 + 2} y={y(d.serve) - 5} textAnchor="middle" fontSize="12" fontWeight="600" fill={C.ink}>{d.serve}</text>
                                {lines.map((ln, li) => (
                                    <text key={li} x={cx} y={H - B + 16 + li * 13} textAnchor="middle" fontSize="11" fill="#3A4B49">{ln}</text>
                                ))}
                            </g>
                        );
                    })}
                </svg>
            )}
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
const ACTION_ICON: Record<ActionRow['icon'], LucideIcon> = { file: FileText, shield: ShieldCheck, pencil: Pencil, refresh: RefreshCw };
const HEALTH_COLOR: Record<HealthSegment['key'], string> = { complete: C.teal, needs_updates: C.tealSoft, incomplete: C.amber, overdue: C.coral };
const ACTIVITY_ICON: Record<string, { icon: LucideIcon; cls: string }> = {
    approved: { icon: CheckCircle2, cls: 'text-[#0E7C7B]' },
    verification: { icon: ShieldCheck, cls: 'text-[#0E7C7B]' },
    correction: { icon: Pencil, cls: 'text-[#B7791F]' },
    rejected: { icon: XCircle, cls: 'text-[#C2543B]' },
    suspended: { icon: ShieldAlert, cls: 'text-[#C2543B]' },
    application: { icon: UserPlus, cls: 'text-[#0E7C7B]' },
    reconfirmation: { icon: RefreshCw, cls: 'text-[#0E7C7B]' },
};

export default function AdminDashboard(props: DashboardProps) {
    const { range, ranges, kpis, actions, verification, health, searchDemand, searchOutcomes, coverage, gaps, activity, links } = props;
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const changeRange = (value: number) => {
        router.get(window.location.pathname, { range: value }, { preserveScroll: true, preserveState: true, replace: true });
    };

    const runAction = (row: ActionRow) => {
        if (!row.href) return;
        if (row.method === 'post') {
            if (!window.confirm(`Send an availability reminder email to the ${row.count} provider${row.count === 1 ? '' : 's'} due for reconfirmation?`)) return;
            setSending(true);
            router.post(row.href, {}, { preserveScroll: true, onFinish: () => setSending(false) });
            return;
        }
        router.visit(row.href);
    };

    const actionTotal = actions.reduce((s, a) => s + a.count, 0);
    const demandMax = Math.max(1, ...searchDemand.map((d) => d.percent));
    const success = searchOutcomes.successRate;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="min-h-full bg-[#F7F3EC] px-3 py-5 text-[#1F2A2E] sm:px-5 lg:px-6">
                {/* Header */}
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0E7C7B]" style={SERIF}>Provider Directory</p>
                        <h1 className="text-3xl font-semibold leading-tight text-[#16302F] sm:text-4xl" style={SERIF}>Dashboard</h1>
                        <p className="mt-1 text-sm text-[#5B6B6E]">Manage providers, oversee verification, track directory use and find gaps in coverage.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-[#0E7C7B]/25 bg-[#0E7C7B]/5 px-3 py-2 text-sm text-[#0B6463]">
                            <span className="h-2 w-2 rounded-full bg-[#2E9E5B]" />
                            Directory live · {nf.format(kpis.published.count)} published
                        </span>
                        <label className="relative inline-flex items-center">
                            <Calendar className="pointer-events-none absolute left-3 h-4 w-4 text-[#5B6B6E]" />
                            <select value={range} onChange={(e) => changeRange(Number(e.target.value))}
                                className="appearance-none rounded-lg border border-[#DED7C9] bg-white py-2 pl-9 pr-8 text-sm text-[#16302F] outline-none focus:border-[#0E7C7B] focus:ring-4 focus:ring-[#0E7C7B]/20">
                                {ranges.map((r) => <option key={r} value={r}>{r === 365 ? 'Last 12 months' : `Last ${r} days`}</option>)}
                            </select>
                            <ArrowDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-[#5B6B6E]" />
                        </label>
                    </div>
                </div>

                {/* KPI cards */}
                <div className="mb-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6">
                    <KpiCard icon={Users} tone="teal" value={kpis.published.count} label="Published providers"
                        footer={<Trend change={kpis.published.change} note={`vs. ${range} days ago`} />} />
                    <KpiCard icon={ClipboardList} tone="coral" value={kpis.pending.count} label="Pending review"
                        footer={<span className="text-xs text-[#6B7A78]">New submissions not yet reviewed</span>} />
                    <KpiCard icon={AlertTriangle} tone="coral" value={kpis.action.count} label="Action required"
                        footer={<span className="text-xs text-[#6B7A78]">{kpis.action.bahali} Bahali · {kpis.action.provider} provider response</span>} />
                    <KpiCard icon={ShieldCheck} tone="teal" value={kpis.verified.count} label="Verified profiles"
                        footer={<Trend change={kpis.verified.change} />} />
                    <KpiCard icon={Search} tone="teal" value={kpis.searches.count} label="Directory searches"
                        footer={<Trend change={kpis.searches.change} />} />
                    <KpiCard icon={SearchX} tone="coral" value={kpis.zeroResults.count} label="Zero-result searches"
                        footer={<Trend change={kpis.zeroResults.change} goodWhen="down" />} />
                </div>

                {/* Row 2: Action required · Verification · Profile health */}
                <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-[1.3fr_1fr_1fr]">
                    <Card>
                        <CardHeader icon={ClipboardList} href={links.pending}
                            title={<>Action Required <span className="text-[#C2543B]">({actionTotal})</span></>}
                            hint="Work waiting on the Bahali team or on a provider's reply." />
                        {/* Phones: one block per task */}
                        <ul className="divide-y divide-[#F1EDE3] sm:hidden">
                            {actions.map((row) => {
                                const Icon = ACTION_ICON[row.icon];
                                return (
                                    <li key={row.key} className="py-3">
                                        <div className="flex items-start gap-2.5">
                                            <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#C2543B]" strokeWidth={1.8} />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-[#26403F]">{row.label}</p>
                                                <p className="mt-0.5 text-xs text-[#6B7A78]">
                                                    <b className={row.count > 0 ? 'text-[#A33D29]' : ''}>{row.count}</b> · oldest {row.count > 0 ? days(row.oldestDays) : '—'}
                                                </p>
                                            </div>
                                            <button type="button" disabled={!row.href || row.count === 0 || (row.method === 'post' && sending)}
                                                onClick={() => runAction(row)}
                                                className="whitespace-nowrap rounded-lg bg-[#0E7C7B] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0B6463] disabled:cursor-not-allowed disabled:bg-[#C9D9D6]">
                                                {row.method === 'post' && sending ? 'Sending…' : row.action}
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="-mx-1 hidden overflow-x-auto sm:block">
                            <table className="w-full min-w-[400px] text-sm">
                                <thead>
                                    <tr className="text-left text-xs font-semibold text-[#3A4B49]">
                                        <th className="px-1 pb-2">Task</th>
                                        <th className="px-1 pb-2 text-center">Count</th>
                                        <th className="px-1 pb-2">Oldest</th>
                                        <th className="px-1 pb-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actions.map((row) => {
                                        const Icon = ACTION_ICON[row.icon];
                                        return (
                                            <tr key={row.key} className="border-t border-[#F1EDE3]">
                                                <td className="px-1 py-2.5">
                                                    <span className="flex items-center gap-2.5 text-[#26403F]">
                                                        <Icon className="h-4 w-4 flex-shrink-0 text-[#C2543B]" strokeWidth={1.8} />
                                                        {row.label}
                                                    </span>
                                                </td>
                                                <td className="px-1 py-2.5 text-center">
                                                    <span className={`inline-flex min-w-[2rem] justify-center rounded-md px-2 py-0.5 text-sm font-semibold ${row.count > 0 ? 'bg-[#C2543B]/10 text-[#A33D29]' : 'bg-[#F1EDE3] text-[#6B7A78]'}`}>{row.count}</span>
                                                </td>
                                                <td className="whitespace-nowrap px-1 py-2.5 text-[#3A4B49]">{row.count > 0 ? days(row.oldestDays) : '—'}</td>
                                                <td className="px-1 py-2.5 text-right">
                                                    <button type="button" disabled={!row.href || row.count === 0 || (row.method === 'post' && sending)}
                                                        onClick={() => runAction(row)}
                                                        className="whitespace-nowrap rounded-lg bg-[#0E7C7B] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0B6463] disabled:cursor-not-allowed disabled:bg-[#C9D9D6]">
                                                        {row.method === 'post' && sending ? 'Sending…' : row.action}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader icon={ShieldCheck} title="Verification Overview" href={links.verification} />
                        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                            {[
                                { icon: CheckCircle2, value: verification.verified, label: 'Verified', sub: 'Credentials checked · live', cls: 'text-[#0E7C7B]', box: 'bg-[#0E7C7B]/[0.07]' },
                                { icon: Clock, value: verification.pending, label: 'Pending', sub: 'Awaiting verification', cls: 'text-[#C2543B]', box: 'bg-[#C2543B]/[0.07]' },
                                { icon: ShieldAlert, value: verification.unverified, label: 'Not verified', sub: 'Live, credentials not checked', cls: 'text-[#B7791F]', box: 'bg-[#E8B84B]/[0.14]' },
                                { icon: Building2, value: verification.organizations, label: 'Organizations', sub: 'No licence needed', cls: 'text-[#5B6B6E]', box: 'bg-[#F1EDE3]' },
                            ].map((t) => (
                                <div key={t.label} className={`flex items-start gap-3 rounded-xl p-3.5 ${t.box}`}>
                                    <t.icon className={`mt-1 h-6 w-6 flex-shrink-0 ${t.cls}`} strokeWidth={1.7} />
                                    <div className="min-w-0">
                                        <p className={`text-2xl font-semibold leading-none ${t.cls}`} style={SERIF}>{nf.format(t.value)}</p>
                                        <p className="mt-1 text-sm font-semibold text-[#16302F]">{t.label}</p>
                                        <p className="text-xs text-[#5B6B6E]">{t.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="lg:col-span-2 2xl:col-span-1">
                        <CardHeader icon={Layers} title="Profile Health" href={links.published}
                            hint="Published profiles. Overdue = availability not reconfirmed in 60 days." />
                        {health.total === 0 ? (
                            <Empty>No published profiles yet.</Empty>
                        ) : (
                            <div className="flex flex-col items-center gap-5 sm:flex-row">
                                <Donut segments={health.segments.map((s) => ({ value: s.count, color: HEALTH_COLOR[s.key] }))}>
                                    <span className="text-3xl font-semibold text-[#16302F]" style={SERIF}>{health.average}%</span>
                                    <span className="text-xs leading-tight text-[#5B6B6E]">Profile<br />completeness</span>
                                </Donut>
                                <ul className="w-full space-y-2.5 text-sm">
                                    {health.segments.map((s) => (
                                        <li key={s.key} className="flex items-center justify-between gap-3">
                                            <span className="flex items-center gap-2 text-[#26403F]">
                                                <span className="h-3 w-3 flex-shrink-0 rounded-sm" style={{ background: HEALTH_COLOR[s.key] }} />
                                                {s.label} <span className="text-[#6B7A78]">({s.count})</span>
                                            </span>
                                            <span className="font-medium text-[#16302F]">{s.percent}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Row 3: Search demand · Coverage · Outcomes */}
                <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-[1fr_1.4fr_1fr]">
                    <Card>
                        <CardHeader icon={MapPin} title={<>Search Demand by Location <span className="text-sm font-normal text-[#6B7A78]">(Top 5)</span></>} />
                        {searchDemand.length === 0 ? (
                            <Empty>No location searches in this period yet.</Empty>
                        ) : (
                            <ul className="space-y-3">
                                {searchDemand.map((d, i) => (
                                    <li key={d.location} className="grid grid-cols-[minmax(0,8.5rem)_1fr_2.5rem] items-center gap-3 text-sm">
                                        <span className="truncate text-[#26403F]" title={d.location}>{d.location}</span>
                                        <span className="h-3.5 overflow-hidden rounded-sm bg-[#F1EDE3]">
                                            <span className="block h-full rounded-sm" style={{ width: `${(d.percent / demandMax) * 100}%`, background: i === 0 ? C.tealDark : i < 3 ? C.teal : C.tealSoft, opacity: 1 - i * 0.12 }} />
                                        </span>
                                        <span className="text-right font-medium text-[#16302F]">{d.percent}%</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    <Card className="lg:col-span-2 2xl:col-span-1 2xl:order-none">
                        <CardHeader icon={Users} title="Provider Coverage by Location" hint="Published providers only." />
                        <CoverageChart rows={coverage} />
                    </Card>

                    <Card className="lg:order-first 2xl:order-none">
                        <CardHeader icon={BarChart3} title="Search Outcomes" />
                        {searchOutcomes.total === 0 ? (
                            <Empty>No directory searches in this period yet.</Empty>
                        ) : (
                            <div className="flex flex-col items-center gap-5 sm:flex-row">
                                <Donut size={160} stroke={20} segments={[{ value: searchOutcomes.withResults, color: C.teal }, { value: searchOutcomes.zero, color: '#E08A72' }]}>
                                    <span className="text-3xl font-semibold text-[#16302F]" style={SERIF}>{success ?? 0}%</span>
                                    <span className="text-xs leading-tight text-[#5B6B6E]">Search<br />success rate</span>
                                </Donut>
                                <ul className="w-full space-y-3 text-sm">
                                    <li className="flex gap-2.5">
                                        <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-sm" style={{ background: C.teal }} />
                                        <span className="text-[#26403F]">Searches with results<br /><b className="text-[#16302F]">{nf.format(searchOutcomes.withResults)}</b> ({success ?? 0}%)</span>
                                    </li>
                                    <li className="flex gap-2.5">
                                        <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-sm" style={{ background: '#E08A72' }} />
                                        <span className="text-[#26403F]">Zero-result searches<br /><b className="text-[#16302F]">{nf.format(searchOutcomes.zero)}</b> ({success === null ? 0 : Math.round((100 - success) * 10) / 10}%)</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Row 4: Coverage gaps · Recent activity */}
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
                    <Card>
                        <CardHeader icon={Target} title="Coverage Gaps & Recruitment Opportunities"
                            hint="Locations and areas of support people search for, with 0–2 matching published providers." />
                        <p className="-mt-2 mb-3 text-sm text-[#5B6B6E]">Locations with search demand and limited or no matching providers.</p>
                        {gaps.length === 0 ? (
                            <Empty>No coverage gaps found in this period.</Empty>
                        ) : (
                            <>
                                {/* Phones: one block per gap */}
                                <ul className="divide-y divide-[#F1EDE3] sm:hidden">
                                    {gaps.map((g) => (
                                        <li key={`${g.location}-${g.area}`} className="py-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-[#16302F]">{g.location}</p>
                                                    <p className="text-sm text-[#26403F]">{g.area}</p>
                                                    <p className="mt-0.5 text-xs text-[#6B7A78]">{g.searches} searches · {g.providers} matching</p>
                                                </div>
                                                <span className={`whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold ${g.providers === 0 ? 'bg-[#C2543B]/10 text-[#A33D29]' : 'bg-[#E8B84B]/25 text-[#7A5410]'}`}>
                                                    {g.providers === 0 ? 'No coverage' : 'Limited'}
                                                </span>
                                            </div>
                                            <a href={g.href} target="_blank" rel="noreferrer"
                                                className="mt-2 inline-flex rounded-lg bg-[#0E7C7B] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0B6463]">
                                                View in directory
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <div className="-mx-1 hidden overflow-x-auto sm:block">
                                    <table className="w-full min-w-[560px] text-sm">
                                        <thead>
                                            <tr className="text-left text-xs font-semibold text-[#3A4B49]">
                                                <th className="px-1 pb-2">Location</th>
                                                <th className="px-1 pb-2">Area of support</th>
                                                <th className="px-1 pb-2 text-center">Searches</th>
                                                <th className="px-1 pb-2 text-center">Matching<br />providers</th>
                                                <th className="px-1 pb-2">Coverage</th>
                                                <th className="px-1 pb-2 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {gaps.map((g) => (
                                                <tr key={`${g.location}-${g.area}`} className="border-t border-[#F1EDE3]">
                                                    <td className="px-1 py-2.5 font-semibold text-[#16302F]">{g.location}</td>
                                                    <td className="px-1 py-2.5 text-[#26403F]">{g.area}</td>
                                                    <td className="px-1 py-2.5 text-center text-[#16302F]">{g.searches}</td>
                                                    <td className="px-1 py-2.5 text-center text-[#16302F]">{g.providers}</td>
                                                    <td className="px-1 py-2.5">
                                                        <span className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold ${g.providers === 0 ? 'bg-[#C2543B]/10 text-[#A33D29]' : 'bg-[#E8B84B]/25 text-[#7A5410]'}`}>
                                                            {g.providers === 0 ? 'No coverage' : 'Limited coverage'}
                                                        </span>
                                                    </td>
                                                    <td className="px-1 py-2.5 text-right">
                                                        <a href={g.href} target="_blank" rel="noreferrer"
                                                            className="inline-flex whitespace-nowrap rounded-lg bg-[#0E7C7B] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0B6463]">
                                                            View in directory
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </Card>

                    <Card>
                        <CardHeader icon={History} title="Recent Activity" />
                        {activity.length === 0 ? (
                            <Empty>No activity yet.</Empty>
                        ) : (
                            <ul className="divide-y divide-[#F1EDE3]">
                                {activity.map((a, i) => {
                                    const meta = ACTIVITY_ICON[a.type] ?? { icon: Clock, cls: 'text-[#0E7C7B]' };
                                    return (
                                        <li key={i} className="flex items-center gap-3 py-2.5">
                                            <meta.icon className={`h-5 w-5 flex-shrink-0 ${meta.cls}`} strokeWidth={1.8} />
                                            <p className="min-w-0 flex-1 text-sm text-[#26403F]">
                                                {a.text}: <span className="font-medium text-[#16302F]">{a.name}</span>
                                                <span className="block text-xs text-[#6B7A78] min-[480px]:hidden">{when(a.at)}</span>
                                            </p>
                                            <span className="hidden whitespace-nowrap text-xs text-[#6B7A78] min-[480px]:inline">{when(a.at)}</span>
                                            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#F1EDE3] text-[11px] font-semibold text-[#3A4B49]">{initials(a.name)}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
