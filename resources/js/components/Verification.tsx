import { Head, Link, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { VERIFICATION_STATUS } from '@/utils/constants';

/**
 * Bahali Provider Directory — Admin Verification Review
 * ------------------------------------------------------------------
 * A read-only, multi-step mirror of the provider registration flow.
 * The admin walks through every section the provider submitted (no
 * editable fields). Visited sections are checked off in the stepper.
 * On the final "Verification Decision" step the admin picks an action
 * with one of four buttons — Approve / Reject / Suspend / Inactive —
 * each of which posts the new status directly.
 *
 * On update → POST to the verification route → controller redirects to
 * the providers index → a "Verification status changed" toast is shown.
 *
 * Expected routes:
 *   GET  admin/providers/{provider}/verification  → name: providers.verification.show
 *   POST admin/providers/{provider}/verification  → name: providers.verification.update
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SupportAreaGroup {
    category: string;
    areas: string[];
}

interface ProviderData {
    id: number;
    verification_status: string;
    status?: string;

    // Basic
    provider_type?: string;
    organization_name?: string;
    credentials?: string;
    professional_title?: string[];
    professional_title_other?: string;

    // About
    email?: string;
    short_bio?: string;
    years_experience?: string;

    // Licensure
    license_number?: string;
    license_states?: string[];
    license_status?: string;
    verification_document?: string | null; // URL

    // Areas — grouped from the provider_support_areas pivot
    support_areas_grouped?: SupportAreaGroup[];

    // Populations
    populations_served?: string[];

    // Culture
    caribbean_identity?: string;
    caribbean_experience?: string;
    languages?: string[];
    languages_other?: string;
    cultural_approach?: string;

    // Service
    service_formats?: string[];
    practice_settings?: string[];

    // Location
    address?: string;
    city?: string;
    state_province?: string;
    country?: string;
    multiple_locations?: string;
    hide_address?: boolean;
    telehealth_regions?: string[];
    telehealth_regions_other?: string;

    // Payment
    payment_methods?: string[];
    insurance_plans?: string;

    // Contact
    phone?: string;
    website?: string;
    social_links?: string;

    // Media
    profile_photo?: string | null; // URL
    additional_photos?: string[]; // URLs

    // Accessibility
    accessibility?: string[];

    // Consent
    consent_accurate?: boolean;
    consent_notify?: boolean;
    consent_no_endorsement?: boolean;
    consent_public?: boolean;

    // Review meta (optional)
    submitted_at?: string;
    verification_note?: string;
}

interface PageProps {
    provider?: ProviderData;
    indexRoute?: string; // route name to return to (default admin.providers.index)
}

/* ------------------------------------------------------------------ */
/*  Sample data (for standalone preview; real data comes from props)   */
/* ------------------------------------------------------------------ */

const SAMPLE: ProviderData = {
    id: 1,
    verification_status: 'pending',
    provider_type: 'individual',
    organization_name: 'Dr. Marsha Smith',
    credentials: 'PsyD, LMHC',
    professional_title: ['Clinical Psychologist'],
    professional_title_other: '',
    email: 'marsha@example.com',
    short_bio:
        'I’m a Kingston-born counselor with fifteen years of experience walking alongside Caribbean individuals and families as they navigate grief, migration, and the quiet weight of expectation. My work makes room for the things we don’t say out loud, in a way that honors where you come from.',
    years_experience: '11–15 years',
    license_number: 'JM-PSY-04821',
    license_states: ['Jamaica', 'United States'],
    license_status: 'active',
    verification_document: '',
    support_areas_grouped: [
        {
            category: 'Mental & Emotional Well-Being',
            areas: ['Anxiety & Worry', 'Grief & Loss'],
        },
        {
            category: 'Crisis, Trauma & Recovery',
            areas: ['Support for Helping Professionals'],
        },
        {
            category: 'Relationships & Family',
            areas: ['Caregiver Support'],
        },
    ],
    populations_served: ['Adolescents (13–17)', 'Adults', 'Families', 'Couples'],
    caribbean_identity: 'yes',
    caribbean_experience: 'yes',
    languages: ['English', 'Jamaican Patois'],
    languages_other: '',
    cultural_approach:
        'Culture isn’t a footnote in my practice — it’s the ground we stand on. I weave Caribbean family structures, faith, and migration realities into the care I offer.',
    service_formats: ['In-Person', 'Virtual'],
    practice_settings: ['Private Practice', 'Faith-Based Setting'],
    address: '14 Hope Road',
    city: 'Kingston',
    state_province: 'Kingston Parish',
    country: 'Jamaica',
    multiple_locations: 'yes',
    hide_address: false,
    telehealth_regions: ['Jamaica', 'Trinidad and Tobago', 'United States', 'United Kingdom'],
    payment_methods: ['Self-Pay', 'Sliding Scale', 'Private Insurance'],
    insurance_plans: 'Aetna, Blue Cross Blue Shield, Cigna',
    phone: '+1 (876) 555-0142',
    website: 'https://example.com',
    social_links: 'https://instagram.com/example, https://facebook.com/example',
    profile_photo: '',
    additional_photos: [],
    accessibility: ['Wheelchair Accessible', 'Home Visits Available'],
    consent_accurate: true,
    consent_notify: true,
    consent_no_endorsement: true,
    consent_public: true,
    submitted_at: 'June 24, 2026',
    verification_note: '',
};

/* ------------------------------------------------------------------ */
/*  Label maps + steps                                                 */
/* ------------------------------------------------------------------ */

const PROVIDER_TYPE_LABELS: Record<string, string> = {
    individual: 'Individual Provider',
    organization: 'Organization / Agency',
    support_group: 'Support Group',
    faith_based: 'Faith-Based Organization',
    community_program: 'Community Program',
};
const LICENSE_STATUS_LABELS: Record<string, string> = {
    active: 'Active',
    provisional: 'Provisional',
    not_applicable: 'Not Applicable',
};
const YESNO_LABELS: Record<string, string> = { yes: 'Yes', no: 'No', prefer_not: 'Prefer not to say' };
const lbl = (map: Record<string, string>, v?: string) => (v ? map[v] ?? v : undefined);

const STEPS = [
    { key: 'basic', title: 'Provider Information', subtitle: 'Who they are' },
    { key: 'about', title: 'About', subtitle: 'Their approach' },
    { key: 'license', title: 'Licensure & Verification', subtitle: 'Credentials' },
    { key: 'areas', title: 'Areas of Support', subtitle: 'What they help with' },
    { key: 'populations', title: 'Populations Served', subtitle: 'Who they serve' },
    { key: 'culture', title: 'Cultural & Language', subtitle: 'Responsiveness' },
    { key: 'service', title: 'Service Information', subtitle: 'How they work' },
    { key: 'location', title: 'Location', subtitle: 'Where they are' },
    { key: 'payment', title: 'Insurance & Payment', subtitle: 'Accepted methods' },
    { key: 'contact', title: 'Contact Information', subtitle: 'Reach them' },
    { key: 'media', title: 'Profile Media', subtitle: 'Photos & logo' },
    { key: 'accessibility', title: 'Accessibility', subtitle: 'Accommodations' },
    { key: 'consent', title: 'Consent & Agreement', subtitle: 'What they agreed to' },
    { key: 'decision', title: 'Verification Decision', subtitle: 'Approve or update' },
] as const;

const TOTAL_STEPS = STEPS.length;
const DECISION_STEP = TOTAL_STEPS - 1;

const STATUS_META: Record<string, { label: string; cls: string; dot: string }> = {
    pending: { label: 'Pending', cls: 'bg-[#E8B84B]/18 text-[#9A6B12] ring-[#E8B84B]/40', dot: 'bg-[#E8B84B]' },
    approved: { label: 'Approved', cls: 'bg-[#0E7C7B]/12 text-[#0E6B6A] ring-[#0E7C7B]/25', dot: 'bg-[#0E7C7B]' },
    rejected: { label: 'Rejected', cls: 'bg-[#C2543B]/12 text-[#A8412B] ring-[#C2543B]/25', dot: 'bg-[#C2543B]' },
    suspended: { label: 'Suspended', cls: 'bg-[#B86B2B]/14 text-[#9A5418] ring-[#B86B2B]/30', dot: 'bg-[#B86B2B]' },
    inactive: { label: 'Inactive', cls: 'bg-[#8A9795]/15 text-[#5B6B6E] ring-[#8A9795]/30', dot: 'bg-[#8A9795]' },
};

/* The four decision actions (no "pending" — that's the incoming state). */
const DECISION_ACTIONS: { value: string; label: string; cls: string; ring: string; icon: JSX.Element }[] = [
    {
        value: VERIFICATION_STATUS.APPROVED,
        label: 'Approve',
        cls: 'bg-[#0E7C7B] hover:bg-[#0c6a69]',
        ring: 'focus:ring-[#0E7C7B]/30',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />,
    },
    {
        value: VERIFICATION_STATUS.REJECTED,
        label: 'Reject',
        cls: 'bg-[#C2543B] hover:bg-[#aa482f]',
        ring: 'focus:ring-[#C2543B]/30',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />,
    },
    {
        value: VERIFICATION_STATUS.SUSPENDED,
        label: 'Suspend',
        cls: 'bg-[#B86B2B] hover:bg-[#a25c22]',
        ring: 'focus:ring-[#B86B2B]/30',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />,
    },
    {
        value: VERIFICATION_STATUS.INACTIVE,
        label: 'Inactive',
        cls: 'bg-[#6E7B79] hover:bg-[#5d6968]',
        ring: 'focus:ring-[#6E7B79]/30',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />,
    },
];

/* ------------------------------------------------------------------ */
/*  Read-only display primitives                                       */
/* ------------------------------------------------------------------ */

function Muted({ children = '—' }: { children?: React.ReactNode }) {
    return <span className="text-[#9AA6A4]">{children}</span>;
}

function Row({ label, children }: { label: string; children?: React.ReactNode }) {
    const empty = children === undefined || children === null || children === '';
    return (
        <div className="py-3.5">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[#8A9795]">{label}</dt>
            <dd className="mt-1 text-[#26403F]">{empty ? <Muted /> : children}</dd>
        </div>
    );
}

function Pills({ items }: { items?: string[] }) {
    if (!items || items.length === 0) return <Muted />;
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((it) => (
                <span
                    key={it}
                    className="rounded-full border border-[#0E7C7B]/20 bg-[#0E7C7B]/8 px-3 py-1 text-sm font-medium text-[#155E5D]"
                >
                    {it}
                </span>
            ))}
        </div>
    );
}

function GroupedPills({ groups }: { groups?: SupportAreaGroup[] }) {
    if (!groups || groups.length === 0) return <Muted />;
    return (
        <div className="space-y-4">
            {groups.map((g) => (
                <div key={g.category}>
                    <p className="mb-2 text-sm font-semibold text-[#16302F]">{g.category}</p>
                    <div className="flex flex-wrap gap-2">
                        {g.areas.map((area) => (
                            <span
                                key={area}
                                className="rounded-full border border-[#0E7C7B]/20 bg-[#0E7C7B]/8 px-3 py-1 text-sm font-medium text-[#155E5D]"
                            >
                                {area}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function YesNoBadge({ value }: { value?: boolean }) {
    if (value === undefined) return <Muted />;
    return value ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0E7C7B]/12 px-3 py-1 text-sm font-semibold text-[#0E6B6A]">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path d="M7.6 13.4 4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" /></svg>
            Agreed
        </span>
    ) : (
        <span className="inline-flex items-center rounded-full bg-[#C2543B]/12 px-3 py-1 text-sm font-semibold text-[#A8412B]">Not agreed</span>
    );
}

function FileView({ url, label, image, onView }: { url?: string | null; label: string; image?: boolean; onView?: (url: string) => void }) {
    if (!url) return <Muted>Not provided</Muted>;
    if (image) {
        return <img src={url} alt={label} className="w-50 rounded-xl border border-[#E7E0D2] contain" />;
    }
    const inner = (
        <>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
            View document
        </>
    );
    const cls = 'inline-flex items-center gap-2 rounded-lg border border-[#DED7C9] bg-[#FBF8F2] px-3.5 py-2 text-sm font-medium text-[#0E6B6A] transition hover:border-[#0E7C7B]';
    if (onView) {
        return <button type="button" onClick={() => onView(url)} className={cls}>{inner}</button>;
    }
    return <a href={url} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
}

/* ------------------------------------------------------------------ */
/*  Document viewer modal (download + zoom)                            */
/* ------------------------------------------------------------------ */

function DocumentModal({ url, onClose }: { url: string; onClose: () => void }) {
    const [scale, setScale] = useState(1);
    const isImage = /\.(png|jpe?g|webp|gif|bmp|svg)(\?|$)/i.test(url);
    const zoomIn = () => setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)));
    const zoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)));
    const reset = () => setScale(1);

    const toolBtn = 'flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40';

    return (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black/70 backdrop-blur-sm" onClick={onClose}>
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 bg-[#0a3a39] px-4 py-3 text-white sm:px-6" onClick={(e) => e.stopPropagation()}>
                <span className="font-serif text-base">Verification document</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <button type="button" onClick={zoomOut} disabled={scale <= 0.5} aria-label="Zoom out" className={toolBtn}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
                    </button>
                    <button type="button" onClick={reset} className="min-w-[3.5rem] rounded-lg bg-white/10 px-2 py-1.5 text-sm tabular-nums transition hover:bg-white/20" aria-label="Reset zoom">
                        {Math.round(scale * 100)}%
                    </button>
                    <button type="button" onClick={zoomIn} disabled={scale >= 3} aria-label="Zoom in" className={toolBtn}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg>
                    </button>
                    <a href={url} download target="_blank" rel="noopener noreferrer" aria-label="Download" className={toolBtn}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    </a>
                    <button type="button" onClick={onClose} aria-label="Close" className={`${toolBtn} ml-1`}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto p-4 sm:p-8" onClick={(e) => e.stopPropagation()}>
                <div
                    className="mx-auto w-fit origin-top transition-transform duration-150"
                    style={{ transform: `scale(${scale})` }}
                >
                    {isImage ? (
                        <img src={url} alt="Verification document" className="max-w-none rounded-lg bg-white shadow-2xl" />
                    ) : (
                        <iframe src={url} title="Verification document" className="h-[80vh] w-[min(900px,90vw)] rounded-lg bg-white shadow-2xl" />
                    )}
                </div>
            </div>
        </div>
    );
}

function DL({ children }: { children: React.ReactNode }) {
    return <dl className="divide-y divide-[#F0EBE0]">{children}</dl>;
}

/* ------------------------------------------------------------------ */
/*  Read-only step body                                                */
/* ------------------------------------------------------------------ */

function ReviewBody({ step, p, onViewDoc }: { step: number; p: ProviderData; onViewDoc?: (url: string) => void }) {
    switch (step) {
        case 0:
            return (
                <DL>
                    <Row label="Provider type">{lbl(PROVIDER_TYPE_LABELS, p.provider_type)}</Row>
                    <Row label="Provider or Organization Name">{p.organization_name}</Row>
                    <Row label="Credentials / License">{p.credentials}</Row>
                    <Row label="Professional title">
                        <Pills items={p.professional_title} />
                    </Row>
                </DL>
            );
        case 1:
            return (
                <DL>
                    <Row label="Email address">{p.email}</Row>
                    <Row label="Years of experience">{p.years_experience}</Row>
                    <Row label="Short bio">
                        {p.short_bio ? <p className="leading-relaxed text-[#3A4B49]">{p.short_bio}</p> : undefined}
                    </Row>
                </DL>
            );
        case 2:
            return (
                <DL>
                    <Row label="License number">{p.license_number || 'Not Applicable'}</Row>
                    <Row label="License status">{lbl(LICENSE_STATUS_LABELS, p.license_status)}</Row>
                    <Row label="State / Country of licensure"><Pills items={p.license_states} /></Row>
                    <Row label="Verification document"><FileView url={p.verification_document} label="Verification document" onView={onViewDoc} /></Row>
                </DL>
            );
        case 3:
            return (
                <DL>
                    <Row label="Areas of support">
                        <GroupedPills groups={p.support_areas_grouped} />
                    </Row>
                </DL>
            );
        case 4:
            return <DL><Row label="Populations served"><Pills items={p.populations_served} /></Row></DL>;
        case 5:
            return (
                <DL>
                    <Row label="Identifies as
part of the Caribbean community?">{lbl(YESNO_LABELS, p.caribbean_identity)}</Row>
                    <Row label="experience working with
Caribbean individuals and families?">{lbl(YESNO_LABELS, p.caribbean_experience)}</Row>
                    <Row label="Languages spoken"><Pills items={p.languages} /></Row>
                    {p.languages?.includes('Other') && <Row label="Other language(s)">{p.languages_other}</Row>}
                    <Row label="Cultural approach">
                        {p.cultural_approach ? <p className="leading-relaxed text-[#3A4B49]">{p.cultural_approach}</p> : undefined}
                    </Row>
                </DL>
            );
        case 6:
            return (
                <DL>
                    <Row label="Service formats"><Pills items={p.service_formats} /></Row>
                    <Row label="Practice settings"><Pills items={p.practice_settings} /></Row>
                </DL>
            );
        case 7:
            return (
                <DL>
                    <Row label="Address">
                        {p.address}
                        {p.hide_address && <span className="ml-2 rounded-full bg-[#E8B84B]/18 px-2 py-0.5 text-xs font-semibold text-[#9A6B12]">Hidden from public</span>}
                    </Row>
                    <Row label="City">{p.city}</Row>
                    <Row label="State / Province / Region">{p.state_province}</Row>
                    <Row label="Country">{p.country}</Row>
                    <Row label="Serves multiple locations">{lbl(YESNO_LABELS, p.multiple_locations)}</Row>
                    <Row label="Telehealth regions served">
                        <Pills
                            items={[
                                ...(p.telehealth_regions ?? []).filter((r) => r !== 'Other'),
                                ...(p.telehealth_regions_other
                                    ? p.telehealth_regions_other
                                        .split(',')
                                        .map((r) => r.trim())
                                        .filter(Boolean)
                                        .map((r) => r.charAt(0).toUpperCase() + r.slice(1))
                                    : []),
                            ]}
                        />
                    </Row>
                </DL>
            );
        case 8:
            return (
                <DL>
                    <Row label="Accepted payment methods"><Pills items={p.payment_methods} /></Row>
                    <Row label="Insurance plans accepted">{p.insurance_plans}</Row>
                </DL>
            );
        case 9:
            return (
                <DL>
                    <Row label="Phone number">{p.phone}</Row>
                    <Row label="Website">
                        {p.website ? <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-[#0E6B6A] hover:underline">{p.website}</a> : undefined}
                    </Row>
                    <Row label="Social media links">
                        {p.social_links ? <span className="break-words">{p.social_links}</span> : undefined}
                    </Row>
                </DL>
            );
        case 10:
            return (
                <DL>
                    <Row label="Professional photo / logo"><FileView url={p.profile_photo} label="Profile photo" image /></Row>
                    <Row label="Additional photos">
                        {p.additional_photos && p.additional_photos.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {p.additional_photos.map((u, i) => (
                                    <img key={i} src={u} alt={`Photo ${i + 1}`} className="w-50 rounded-lg border border-[#E7E0D2] contain" />
                                ))}
                            </div>
                        ) : undefined}
                    </Row>
                </DL>
            );
        case 11:
            return <DL><Row label="Accessibility"><Pills items={p.accessibility} /></Row></DL>;
        case 12:
            return (
                <DL>
                    <Row label="Information is accurate"><YesNoBadge value={p.consent_accurate} /></Row>
                    <Row label="Will notify Bahali of changes"><YesNoBadge value={p.consent_notify} /></Row>
                    <Row label="Understands this is not an endorsement"><YesNoBadge value={p.consent_no_endorsement} /></Row>
                    <Row label="Consents to public display"><YesNoBadge value={p.consent_public} /></Row>
                </DL>
            );
        default:
            return null;
    }
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProviderVerificationShow({ provider, indexRoute = 'admin.providers.index' }: PageProps) {
    const p = provider;
    const [step, setStep] = useState(0);
    const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
    const [note, setNote] = useState('');
    const [processing, setProcessing] = useState(false);
    const [activeAction, setActiveAction] = useState<string | null>(null);
    const [docUrl, setDocUrl] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ value: string; label: string; cls: string; ring: string } | null>(null);
    const topRef = useRef<HTMLDivElement>(null);

    const current = STATUS_META[p.verification_status] ?? STATUS_META.pending;
    const progress = Math.round(((step + 1) / TOTAL_STEPS) * 100);

    const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const goTo = (i: number) => {
        const next = Math.max(0, Math.min(i, TOTAL_STEPS - 1));
        setVisited((v) => new Set(v).add(next));
        setStep(next);
        scrollTop();
    };

    const submit = (status: string) => {
        if (processing) return;
        setProcessing(true);
        setActiveAction(status);
        router.post(
            route('providers.verification.update', p.id),
            { status, note },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Verification status changed'),
                onError: () => {
                    setProcessing(false);
                    setActiveAction(null);
                    toast.error('Could not update the verification status.');
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <>
            <Head title={`Review — ${p.organization_name ?? 'Provider'} · Bahali Admin`} />

            <div className="min-h-screen bg-[#F7F3EC] text-[#1F2A2E]">
                {/* Header */}
                {/* <header className="sticky top-0 z-40 border-b border-[#E7E0D2] bg-[#F7F3EC]/90 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8B84B] font-serif text-lg font-bold text-[#0E4C4B]">B</span>
                            <span className="leading-none">
                                <span className="block font-serif text-lg text-[#16302F]">Bahali</span>
                                <span className="block text-[11px] tracking-wide text-[#6B7A78]">Provider Review</span>
                            </span>
                        </div>
                        <Link href={`/${indexRoute.replace(/\./g, '/')}`} className="inline-flex items-center gap-2 text-sm font-medium text-[#3A4B49] transition hover:text-[#0E7C7B]">
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                            Back to providers
                        </Link>
                    </div>
                </header> */}

                <div ref={topRef} className="mx-auto max-w-5xl px-5 py-8 lg:py-12">
                    {/* Title + current status */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0E7C7B]">Reviewing application</p>
                            <h1 className="mt-2 font-serif text-3xl text-[#16302F] sm:text-4xl">{p.organization_name}</h1>
                            <p className="mt-1 text-[#5B6B6E]">
                                {p.professional_title === 'Other (specify)' ? p.professional_title_other : p.professional_title}
                                {p.credentials && <span> · {p.credentials}</span>}
                                {p.submitted_at && <span className="text-[#9AA6A4]"> · submitted {p.submitted_at}</span>}
                            </p>
                        </div>
                        <span className={`inline-flex flex-shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ring-inset ${current.cls}`}>
                            <span className={`h-2 w-2 rounded-full ${current.dot}`} />
                            Current: {p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Pending'}
                        </span>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
                        {/* Stepper (all steps clickable; visited steps checked off) */}
                        <aside className="lg:sticky lg:top-24 lg:self-start">
                            {/* Mobile progress + jump */}
                            <div className="mb-4 lg:hidden">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-medium text-[#16302F]">Step {step + 1} of {TOTAL_STEPS}</span>
                                    <button onClick={() => goTo(DECISION_STEP)} className="font-semibold text-[#0E7C7B] hover:underline">Skip to decision →</button>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2DACB]">
                                    <div className="h-full rounded-full bg-[#0E7C7B] transition-all duration-500" style={{ width: `${progress}%` }} />
                                </div>
                                <p className="mt-2 font-serif text-lg text-[#16302F]">{STEPS[step].title}</p>
                            </div>


                            <nav className="hidden lg:block" aria-label="Sections">
                                <ol className="relative">
                                    <span className="absolute left-[24px] top-2 bottom-2 w-px bg-[#E2DACB]" aria-hidden />
                                    {STEPS.map((s, i) => {
                                        const isCurrent = i === step;
                                        const isDecision = i === DECISION_STEP;
                                        const isDone = visited.has(i) && !isCurrent && !isDecision;
                                        return (
                                            <li key={s.key} className="relative mb-1 last:mb-0">
                                                <button
                                                    type="button"
                                                    onClick={() => goTo(i)}
                                                    className={`flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-[#0E7C7B]/5 ${isCurrent ? 'bg-[#0E7C7B]/5' : ''}`}
                                                >
                                                    <span
                                                        className={`relative z-10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition ${isDone
                                                            ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white'
                                                            : isCurrent
                                                                ? 'border-[#0E7C7B] bg-white text-[#0E7C7B]'
                                                                : isDecision
                                                                    ? 'border-[#C2543B]/40 bg-[#F7F3EC] text-[#C2543B]'
                                                                    : 'border-[#D8D0C0] bg-[#F7F3EC] text-[#8A9795]'}`}
                                                    >
                                                        {isDone ? (
                                                            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                                                                <path d="M7.6 13.4 4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" />
                                                            </svg>
                                                        ) : isDecision ? (
                                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75" /></svg>
                                                        ) : (i + 1)}
                                                    </span>
                                                    <span className="min-w-0 pt-0.5">
                                                        <span className={`block text-sm font-medium leading-tight ${isCurrent ? 'text-[#16302F]' : 'text-[#5B6B6E]'}`}>{s.title}</span>
                                                        <span className="block text-xs text-[#9AA6A4]">{s.subtitle}</span>
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ol>
                            </nav>
                        </aside>

                        {/* Content card */}
                        <main>
                            <div className="rounded-2xl border border-[#E7E0D2] bg-white p-6 shadow-sm sm:p-8">
                                <div className="mb-6 border-b border-[#EFEAE0] pb-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0E7C7B]">
                                        {step === DECISION_STEP ? 'Final step' : `Section ${step + 1}`}
                                    </p>
                                    <h2 className="mt-1 font-serif text-2xl text-[#16302F]">{STEPS[step].title}</h2>
                                </div>

                                {step === DECISION_STEP ? (
                                    /* -------- Decision -------- */
                                    <div className="space-y-6">
                                        <div className="rounded-xl bg-[#FBF8F2] p-4">
                                            <p className="text-sm text-[#5B6B6E]">Current verification status</p>
                                            <span className={`mt-2 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ring-inset ${current.cls}`}>
                                                <span className={`h-2 w-2 rounded-full ${current.dot}`} />
                                                Current:  {p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Pending'}
                                            </span>
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-[#26403F]">
                                                Review note <span className="font-normal text-[#9AA6A4]">(optional, internal)</span>
                                            </label>
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                rows={3}
                                                placeholder="Add a note for the record — e.g. reason for rejection or items to follow up on…"
                                                className="w-full resize-y rounded-lg border border-[#DED7C9] bg-white px-3.5 py-2.5 text-[#1F2A2E] placeholder-[#9AA6A4] outline-none transition focus:border-[#0E7C7B] focus:ring-4 focus:ring-[#0E7C7B]/25"
                                            />
                                        </div>

                                        {/* Four action buttons — each posts the status directly */}
                                        <div>
                                            <p className="mb-3 text-sm font-medium text-[#26403F]">Set verification status</p>
                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                {DECISION_ACTIONS.map((a) => {
                                                    const isCurrentStatus = p.status === a.value;

                                                    if (isCurrentStatus) return null;

                                                    const loading = processing && activeAction === a.value;
                                                    return (
                                                        <button
                                                            key={a.value}
                                                            type="button"
                                                            onClick={() => setConfirmAction(a)}
                                                            disabled={processing || isCurrentStatus}
                                                            className={`relative flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 disabled:opacity-60 ${a.cls} ${a.ring}`}
                                                        >
                                                            {loading ? (
                                                                <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" strokeWidth={2.4}>
                                                                    <path strokeLinecap="round" d="M12 3a9 9 0 1 0 9 9" />
                                                                </svg>
                                                            ) : (
                                                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>{a.icon}</svg>
                                                            )}
                                                            {loading ? 'Updating…' : a.label}
                                                            {isCurrentStatus && !loading && (
                                                                <span className="absolute -top-2 right-1.5 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#5B6B6E] shadow-sm ring-1 ring-black/5">
                                                                    Current
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <p className="mt-3 text-xs text-[#9AA6A4]">
                                                Choosing an action updates the provider’s status immediately and returns you to the providers list.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    /* -------- Read-only data -------- */
                                    <ReviewBody step={step} p={p} onViewDoc={setDocUrl} />
                                )}

                                {/* Navigation */}
                                <div className="mt-8 flex items-center justify-between border-t border-[#EFEAE0] pt-6">
                                    <button
                                        type="button"
                                        onClick={() => goTo(step - 1)}
                                        disabled={step === 0}
                                        className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${step === 0 ? 'cursor-not-allowed text-[#B7C0BE]' : 'text-[#3A4B49] hover:bg-[#0E7C7B]/5'}`}
                                    >
                                        ← Back
                                    </button>

                                    {step < DECISION_STEP && (
                                        <button
                                            type="button"
                                            onClick={() => goTo(step + 1)}
                                            className="rounded-lg bg-[#0E7C7B] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c6a69] focus:outline-none focus:ring-4 focus:ring-[#0E7C7B]/30"
                                        >
                                            Continue →
                                        </button>
                                    )}
                                </div>
                            </div>

                            {step !== DECISION_STEP && (
                                <p className="mt-4 text-center text-xs text-[#9AA6A4]">
                                    This is a read-only review.{' '}
                                    <button onClick={() => goTo(DECISION_STEP)} className="font-semibold text-[#0E7C7B] hover:underline">Skip to the decision →</button>
                                </p>
                            )}
                        </main>
                    </div>
                </div>

                {/* Confirm status-change modal */}
                {confirmAction && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => { if (!processing) setConfirmAction(null); }}
                    >
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                            <h2 className="font-serif text-xl text-[#16302F]">Change verification status?</h2>
                            <p className="mt-2 text-sm leading-relaxed text-[#5B6B6E]">
                                Do you want to change this provider’s verification status to{' '}
                                <strong className="text-[#26403F]">{STATUS_META[confirmAction.value]?.label ?? confirmAction.label}</strong>?
                                {' '}This updates {p.organization_name} and returns you to the providers list.
                            </p>

                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setConfirmAction(null)}
                                    disabled={processing}
                                    className="rounded-lg border border-[#DED7C9] bg-white px-5 py-2.5 text-sm font-semibold text-[#3A4B49] transition hover:bg-[#FBF8F2] disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => submit(confirmAction.value)}
                                    disabled={processing}
                                    className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 disabled:opacity-60 ${confirmAction.cls} ${confirmAction.ring}`}
                                >
                                    {processing && (
                                        <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" strokeWidth={2.4}><path strokeLinecap="round" d="M12 3a9 9 0 1 0 9 9" /></svg>
                                    )}
                                    {processing ? 'Updating…' : 'Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Document viewer modal */}
                {docUrl && <DocumentModal url={docUrl} onClose={() => setDocUrl(null)} />}
            </div>
        </>
    );
}
