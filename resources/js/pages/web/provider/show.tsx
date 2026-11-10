import LandingHeader from '@/components/landing/LandingHeader'
import LandingFooter from '@/components/landing/LandingFooter';
import { Head, Link, usePage } from '@inertiajs/react';
import { createContext, useContext, useEffect, useMemo, useState, type MouseEvent, type ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';
import { formatPhoneDisplay, phoneHref } from '@/lib/phone';
import { REDUCED_COST_METHODS } from '@/constants/fees';
import {
    CARIBBEAN_EXPERIENCE_STATEMENT,
    ProviderBadgeRow,
    displayName as providerDisplayName,
    feeWithCurrency,
    initials,
    reducedCostLabel,
    splitPopulations,
    type ProviderType,
    type ReducedCostScope,
} from '@/components/provider/ProviderBadges';

/* ------------------------------------------------------------------ */
/*  Types — shape returned by ProviderService::getPublicProfile()      */
/* ------------------------------------------------------------------ */
type Availability = 'accepting' | 'not_accepting' | 'unknown';

interface SupportAreaGroup {
    category: string;
    areas: string[];
}

interface FeeByService {
    service: string;
    fee: string;
    currency?: string;
}

interface ProviderContact {
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    booking?: string | null;
    social?: string[];
}

interface PublicProvider {
    id: number;
    name: string;
    title?: string | null;
    credentials?: string | null;
    photo?: string | null;
    additionalPhotos?: string[];
    bio?: string | null;
    yearsExperience?: string | null;
    location?: string | null;
    address?: string | null;              // only sent when the provider shows it (always for in-person care)
    additionalLocations?: string[];       // "Kingston, Jamaica" …
    contactPerson?: { name: string; role?: string | null } | null; // organizations
    servesMultiple?: boolean;
    telehealthRegions?: string[];
    sessionFormats?: string[];
    practiceSettings?: string[];
    languages?: string[];
    culturalApproach?: string | null;
    culturallyAffirming?: string | boolean | null;
    lgbtqAffirming?: string | boolean | null;
    providerType?: ProviderType | null;
    licenceVerified?: boolean;
    caribbeanExperience?: boolean;
    caribbeanExperienceDetails?: string | null;
    supportAreas?: SupportAreaGroup[];
    populations?: string[];
    treatmentApproaches?: string[];
    specializedTraining?: string[];
    certifications?: string[];
    accessibility?: string[];
    servicesOffered?: string[];   // not sent yet — needs a "Services offered" signup field
    feesByService?: FeeByService[]; // not sent yet — needs a fee-per-service signup field
    payment?: { methods?: string[]; insurance?: string[] };
    contact?: ProviderContact;
    fee?: string | null;
    currency?: string;
    reducedCostScope?: ReducedCostScope;
    availability?: Availability;
    availabilityConfirmedAt?: string | null;
    acceptingNewClients?: boolean | null;
}

interface Section {
    key: string;
    label: string | null;
    show: boolean;
    content: ReactNode;
}

interface ContactAction {
    key: string;
    icon: ReactNode;
    label: string;
    sub: string;
    href: string;
    external?: boolean;
}

const SERIF = { fontFamily: '"Cormorant Garamond", Georgia, serif' };
const has = <T,>(a: T[] | null | undefined): a is T[] => Array.isArray(a) && a.length > 0;
const uniq = (a: (string | null | undefined)[]): string[] => [...new Set(a.filter((x): x is string => Boolean(x)))];

/* Shared with web/provider/index (Directory) — lets "Back to results" restore filters, loaded results and scroll position. */
const DIRECTORY_STATE_KEY = 'bahali_directory_state_v1';
const DIRECTORY_RETURN_KEY = 'bahali_directory_return';

/* Shared page text — admin-editable (Admin → Website → Provider Profile). Defaults are shown until the admin changes them
   (keep in sync with ProviderProfilePageService::schema()). */
const DEFAULT_CONTENT: Record<string, string> = {
    'page.back': 'Back to results',
    'page.eyebrow': 'Provider profile',
    'availability.accepting_note': 'This information is provided by the provider.',
    'availability.unknown_note': 'Contact the provider directly to confirm current availability.',
    'contact.disclaimer': 'Bahali does not manage appointments or communications between you and the provider.',
    'contact.modal_intro': 'Reach the provider directly. Bahali does not manage appointments or communications between you and the provider.',
    'contact.empty': "This provider hasn't listed a contact method yet.",
    'contact.mobile_button': 'Contact provider',
    'crisis.label': 'Please note.',
    'crisis.body': 'If you are in crisis or need immediate support, contact your local emergency services or a crisis helpline. Bahali is not an emergency service.',
    'fees.no_fee': 'Contact provider for fee information',
    'fees.insurance_note': 'Coverage varies by plan — confirm directly with the provider.',
};
const pageText = (content: Record<string, string> | undefined, key: string): string => content?.[key] || DEFAULT_CONTENT[key] || '';
const PageContentContext = createContext<Record<string, string>>({});
function useTxt() {
    const content = useContext(PageContentContext);
    return (key: string) => pageText(content, key);
}

/* Payment methods that belong under "Insurance accepted" (matches ProviderService::PAYMENT_GROUPS['insurance']). */
const INSURANCE_METHODS = ['Medicaid', 'Medicare', 'Employee Assistance Programs (EAP)'];

function normHref(url?: string | null): string { return url ? (url.startsWith('http') ? url : `https://${url}`) : ''; }
function displayUrl(url: string = ''): string { return url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, ''); }

/* Language list with wrapping / +N more treatment (client §4 Provider Cards) */
function LanguageList({ languages = [], max = 4 }: { languages?: string[]; max?: number }) {
    if (!languages.length) return null;
    const shown = languages.slice(0, max);
    const rest = languages.length - shown.length;
    return (
        <span className="inline-flex flex-wrap items-center gap-x-1.5">
            {shown.join(', ')}
            {rest > 0 && <span className="text-[#2C2C2C]/70"> +{rest} more</span>}
        </span>
    );
}

/* Icons (unchanged) */
const Ico = {
    pin: <><path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" /><circle cx="12" cy="11" r="2" /></>,
    monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
    chat: <path d="M7.5 8.25h9m-9 3H12M4.5 4.5h15a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H13l-4 3v-3H4.5A1.5 1.5 0 0 1 3 15V6a1.5 1.5 0 0 1 1.5-1.5Z" />,
    wallet: <path d="M3 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 0 2-3h11l2 3M16 13h.01" />,
    shield: <path d="M9 12.75 11.25 15 15 9.75M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3Z" />,
    heart: <path d="M12 20s-7-4.35-9.2-8.6C1.4 8.5 3 5.5 6 5.5c1.8 0 3 1 3 1s1.2-1 3-1c3 0 4.6 3 3.2 5.9C19 15.65 12 20 12 20Z" />,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    phone: <path d="M2.5 6.5c0 8 6.5 14.5 14.5 14.5a2 2 0 0 0 2-2v-2.2a1 1 0 0 0-.76-.97l-3.9-1a1 1 0 0 0-1 .35l-.9 1.15A11.5 11.5 0 0 1 7.3 10.2l1.15-.9a1 1 0 0 0 .35-1l-1-3.9A1 1 0 0 0 6.7 3.7H4.5a2 2 0 0 0-2 2Z" />,
    external: <path d="M14 4h6v6M20 4l-8 8M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />,
    check: <path d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    minus: <><circle cx="12" cy="12" r="9" /><path d="M8 12h8" /></>,
    question: <path d="M12 17h.01M12 13a2 2 0 0 0 .5-3.94A2 2 0 1 0 10 7m2 14a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 4.5a3 3 0 0 1 0 6M18 14.5a5 5 0 0 1 3 4.5" /></>,
};
function Icon({ d, className = 'h-4 w-4' }: { d: ReactNode; className?: string }) {
    return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{d}</svg>;
}

function CategoryList({ items }: { items?: string[] | null }) {
    if (!items || items.length === 0) return null;
    return (
        <ul className="mt-1.5 space-y-1">
            {items.map((item) => (
                <li
                    key={item}
                    className="flex items-start gap-2 text-[15px] leading-relaxed text-[#2C2C2C]"
                >
                    <span
                        className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1E4D4A]/40"
                        aria-hidden
                    />
                    <span className="min-w-0 break-words">{item}</span>
                </li>
            ))}
        </ul>
    );
}

/* Renders only the sections that have content — empty headings are never shown. */
function SectionStack({ sections }: { sections: Section[] }) {
    const visible = sections.filter((s) => s.show);
    if (visible.length === 0) return null;
    return (
        <div className="space-y-5">
            {visible.map((s, idx) => (
                <section key={s.key} className={idx > 0 ? 'border-t border-[#E8D9B8] pt-5' : ''}>
                    {s.label && (
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#1E4D4A]">{s.label}</h3>
                    )}
                    {s.content}
                </section>
            ))}
        </div>
    );
}

function SubLabel({ children }: { children: ReactNode }) {
    return <p className="text-sm font-semibold text-[#2C2C2C]">{children}</p>;
}

function AvailabilityBox({ availability, confirmedAt }: { availability?: Availability; confirmedAt?: string | null }) {
    const txt = useTxt();
    if (availability === 'accepting') {
        return (
            <div className="rounded-xl border border-[#1E4D4A]/20 bg-[#1E4D4A]/8 p-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#1E4D4A]">Current availability</p>
                <p className="mt-1.5 flex items-center gap-2 font-semibold text-[#1E4D4A]"><Icon d={Ico.check} className="h-5 w-5 text-[#1E4D4A]" /> Accepting new clients</p>
                {confirmedAt && <p className="mt-0.5 text-sm text-[#2C2C2C]">Last confirmed: {confirmedAt}</p>}
                <p className="mt-1 text-sm italic text-[#2C2C2C]/70">{txt('availability.accepting_note')}</p>
            </div>
        );
    }
    if (availability === 'not_accepting') {
        return (
            <div className="rounded-xl border border-[#1E4D4A]/65 bg-[#FAFAF6] p-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/70">Current availability</p>
                <p className="mt-1.5 flex items-center gap-2 font-semibold text-[#2C2C2C]"><Icon d={Ico.minus} className="h-5 w-5" /> Not currently accepting new clients</p>
                {confirmedAt && <p className="mt-0.5 text-sm text-[#2C2C2C]/70">Last confirmed: {confirmedAt}</p>}
            </div>
        );
    }
    return (
        <div className="rounded-xl border border-[#E8D9B8]/40 bg-[#E8D9B8]/12 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]">Current availability</p>
            <p className="mt-1.5 flex items-center gap-2 font-semibold text-[#2C2C2C]">
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#E8D9B8]">
                    <HelpCircle className="h-3 w-3 text-white" strokeWidth={2.6} aria-hidden />
                </span>
                Availability unknown
            </p>
            <p className="mt-0.5 text-sm text-[#2C2C2C]">{txt('availability.unknown_note')}</p>
        </div>
    );
}

/* Contact — "Call provider" is the primary (teal) action; website, email and booking are secondary. */
function contactActions(provider: PublicProvider): { primary: ContactAction | null; secondary: ContactAction[]; hasAny: boolean } {
    const c: ProviderContact = provider.contact || {};
    const phone: ContactAction | null = c.phone ? {
        key: 'phone', icon: Ico.phone, label: 'Call provider',
        sub: formatPhoneDisplay(c.phone, { international: true }), href: phoneHref(c.phone),
    } : null;
    const booking: ContactAction | null = c.booking ? {
        key: 'booking', icon: Ico.calendar, label: 'Book a consultation',
        sub: "Opens the provider's scheduling site", href: normHref(c.booking), external: true,
    } : null;
    const website: ContactAction | null = c.website ? {
        key: 'website', icon: Ico.globe, label: 'Visit website',
        sub: displayUrl(c.website), href: normHref(c.website), external: true,
    } : null;
    const email: ContactAction | null = c.email ? {
        key: 'email', icon: Ico.mail, label: 'Email provider',
        sub: c.email, href: `mailto:${c.email}`,
    } : null;
    const primary = phone || booking || null;
    const secondary = [website, email, phone ? booking : null].filter((m): m is ContactAction => m !== null);
    return { primary, secondary, hasAny: !!primary || secondary.length > 0 };
}

function PrimaryAction({ m }: { m: ContactAction }) {
    return (
        <a
            href={m.href}
            {...(m.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="flex w-full items-center justify-center gap-3 bg-[#1E4D4A] px-4 py-2.5 text-white shadow-sm transition hover:bg-[#163F3C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D4A]/40 focus-visible:ring-offset-2 min-h-[48px] rounded-[10px] text-[15px] font-semibold"
        >
            <Icon d={m.icon} className="h-5 w-5 flex-shrink-0" />
            <span className="min-w-0 text-left leading-tight">
                <span className="block text-[15px] font-semibold">{m.label}</span>
                <span className="block break-words text-sm text-white/85">{m.sub}</span>
            </span>
        </a>
    );
}

function SecondaryAction({ m }: { m: ContactAction }) {
    return (
        <a
            href={m.href}
            {...(m.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="flex w-full items-center gap-3 border px-4 py-2.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D4A]/30 min-h-[48px] rounded-[10px] border-[#1E4D4A] bg-white text-[15px] font-semibold text-[#1E4D4A] hover:bg-[#1E4D4A]/5"
        >
            <Icon d={m.icon} className="h-4 w-4 flex-shrink-0" />
            <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-[15px] font-semibold">{m.label}</span>
                <span className="block truncate text-sm text-[#2C2C2C]" title={m.sub}>{m.sub}</span>
            </span>
            {m.external && <span className="text-[#2C2C2C]/70"><Icon d={Ico.external} className="h-4 w-4" /></span>}
        </a>
    );
}

function ContactActions({ provider }: { provider: PublicProvider }) {
    const txt = useTxt();
    const { primary, secondary, hasAny } = contactActions(provider);
    if (!hasAny) return <p className="text-sm text-[#2C2C2C]/70">{txt('contact.empty')}</p>;
    return (
        <div className="space-y-2">
            {primary && <PrimaryAction m={primary} />}
            {secondary.map((m) => <SecondaryAction key={m.key} m={m} />)}
        </div>
    );
}

function CrisisNote() {
    const txt = useTxt();
    return (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#FAFAF6] p-3 text-sm leading-relaxed text-[#2C2C2C]">
            <span className="mt-0.5 text-[#1E4D4A]"><Icon d={Ico.info} className="h-4 w-4" /></span>
            <span><span className="font-semibold text-[#2C2C2C]">{txt('crisis.label')}</span> {txt('crisis.body')}</span>
        </div>
    );
}

/* Named contact person for organizations, e.g. "Contact person: Rev. Marcia Brown · Pastoral Care Coordinator". */
function ContactPersonLine({ provider }: { provider: PublicProvider }) {
    const cp = provider.contactPerson;
    if (!cp?.name) return null;
    return (
        <p className="mt-1 text-sm text-[#2C2C2C]">
            <span className="text-[#2C2C2C]">Contact person:</span> <span className="font-medium">{cp.name}</span>
            {cp.role && <span className="text-[#2C2C2C]"> · {cp.role}</span>}
        </p>
    );
}

function ContactPanel({ provider, name }: { provider: PublicProvider; name: string }) {
    const txt = useTxt();
    return (
        <div className="rounded-2xl border border-[#E8D9B8] bg-white p-5 shadow-sm">
            <h3 className="break-words text-[18px] font-semibold leading-[1.2] text-[#1E4D4A] md:text-[20px]">Contact {name}</h3>
            <ContactPersonLine provider={provider} />
            <p className="mt-1 text-sm leading-relaxed text-[#2C2C2C]">{txt('contact.disclaimer')}</p>
            <div className="mt-3">
                <ContactActions provider={provider} />
            </div>
            <CrisisNote />
        </div>
    );
}

function ContactModal({ open, onClose, provider, name }: { open: boolean; onClose: () => void; provider: PublicProvider; name: string }) {
    const txt = useTxt();
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={`Contact ${name}`}>
            <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
                <div className="flex items-start justify-between gap-3 border-b border-[#E8D9B8] p-5">
                    <div className="min-w-0">
                        <h3 className="break-words text-[18px] font-semibold leading-[1.2] text-[#1E4D4A] md:text-[20px]">Contact {name}</h3>
                        <ContactPersonLine provider={provider} />
                        <p className="mt-1 text-sm text-[#2C2C2C]">{txt('contact.modal_intro')}</p>
                    </div>
                    <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-[#2C2C2C]/70 hover:bg-[#FAFAF6]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg></button>
                </div>
                <div className="p-5">
                    <ContactActions provider={provider} />
                    <CrisisNote />
                </div>
            </div>
        </div>
    );
}

/* At a glance — compact: fees, populations, experience, accessibility. Languages and meeting formats stay in the header. */
function GlanceRow({ d, children }: { d: ReactNode; children: ReactNode }) {
    return (
        <li className="flex items-start gap-2.5 py-2 text-sm text-[#2C2C2C]">
            <span className="mt-0.5 flex-shrink-0 text-[#1E4D4A]"><Icon d={d} className="h-4 w-4" /></span>
            <span className="min-w-0 flex-1 break-words">{children}</span>
        </li>
    );
}

interface AtAGlanceProps {
    p: PublicProvider & { slidingScale: boolean; freeLowCost: boolean };
    feeText: string;
    insuranceItems: string[];
    insuranceGeneric: boolean;
}

function AtAGlance({ p, feeText, insuranceItems, insuranceGeneric }: AtAGlanceProps) {
    const txt = useTxt();
    const populations = p.populations || [];
    const shownPopulations = populations.slice(0, 3);
    const extraPopulations = populations.length - shownPopulations.length;
    const shownInsurers = insuranceItems.slice(0, 2);
    const extraInsurers = insuranceItems.length - shownInsurers.length;
    const reduced: 'sliding' | 'free' | null = p.slidingScale ? 'sliding' : (p.freeLowCost ? 'free' : null);

    return (
        <div className="rounded-2xl border border-[#E8D9B8] bg-white px-5 py-4 shadow-sm">
            <h3 className="text-[18px] font-semibold leading-[1.2] text-[#1E4D4A] md:text-[20px]">At a glance</h3>
            <ul className="mt-1 divide-y divide-[#E8D9B8]">
                <GlanceRow d={feeText ? Ico.wallet : Ico.info}>
                    {feeText
                        ? <span className="font-semibold text-[#2C2C2C]">{feeText}</span>
                        : <span className="text-[#2C2C2C]">{txt('fees.no_fee')}</span>}
                </GlanceRow>
                {reduced && (
                    <GlanceRow d={Ico.heart}>
                        <span className="text-[#1E4D4A]">{reducedCostLabel(reduced, p.reducedCostScope)}</span>
                    </GlanceRow>
                )}
                {(shownInsurers.length > 0 || insuranceGeneric) && (
                    <GlanceRow d={Ico.shield}>
                        <span className="font-medium text-[#2C2C2C]">Insurance:</span>{' '}
                        {shownInsurers.length > 0 ? shownInsurers.join(', ') : 'Accepted — confirm your plan'}
                        {extraInsurers > 0 && <span className="whitespace-nowrap text-[#2C2C2C]/70"> +{extraInsurers} more</span>}
                    </GlanceRow>
                )}
                {shownPopulations.length > 0 && (
                    <GlanceRow d={Ico.users}>
                        <span className="font-medium text-[#2C2C2C]">Who I support:</span>{' '}
                        {shownPopulations.join(', ')}
                        {extraPopulations > 0 && <span className="whitespace-nowrap text-[#2C2C2C]/70"> +{extraPopulations} more</span>}
                    </GlanceRow>
                )}
                {p.yearsExperience && (
                    <GlanceRow d={Ico.clock}>{p.yearsExperience} of experience</GlanceRow>
                )}
                {(p.accessibility || []).map((a) => (
                    <GlanceRow key={a} d={Ico.check}>{a}</GlanceRow>
                ))}
            </ul>
        </div>
    );
}

export default function ProviderProfile({ provider, content = {} }: { provider: PublicProvider; content?: Record<string, string> }) {
    const p: PublicProvider = provider || ({} as PublicProvider);
    const txt = (key: string) => pageText(content, key);
    const [imgError, setImgError] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);

    // Header button: Dashboard when signed in (admin → admin dashboard, provider → provider dashboard), Login otherwise.
    const { auth } = usePage<{ auth?: { user?: { role?: string } | null } }>().props;
    const user = auth?.user ?? null;
    const headerButton = user
        ? { label: 'Dashboard', href: user.role === 'admin' ? '/admin/dashboard' : '/provider/dashboard' }
        : { label: 'Login', href: '/login' };

    const name = providerDisplayName(p.name);
    const credentialLine = [p.providerType === 'individual' ? p.credentials : null, p.title].filter(Boolean).join(' · ');
    const showPhoto = p.photo && !imgError;
    const hasContact = contactActions(p).hasAny;

    /* ---- Back to results: keep filters, loaded results and scroll position ---- */
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const backHref = `/provider${search}`;

    useEffect(() => {
        // Tells the results page that the next visit is a return from a profile (also covers the browser back button).
        try { sessionStorage.setItem(DIRECTORY_RETURN_KEY, String(p.id ?? '1')); } catch { /* storage unavailable */ }
    }, [p.id]);

    const onBackToResults = (e: MouseEvent<HTMLAnchorElement>) => {
        try {
            const saved = JSON.parse(sessionStorage.getItem(DIRECTORY_STATE_KEY) || 'null');
            if (saved?.openedId === p.id && window.history.length > 1) {
                // Opened from the results list in this tab → step back to the exact same results page.
                e.preventDefault();
                window.history.back();
            }
        } catch { /* fall back to the link */ }
    };

    /* ---- Shared values (same wording as the results card) ---- */
    const feeText = p.fee ? feeWithCurrency(p.fee, p.currency || 'USD') : '';
    const methods = p.payment?.methods || [];
    const insuranceItems = uniq([...(p.payment?.insurance || []), ...methods.filter((m) => INSURANCE_METHODS.includes(m))]);
    const insuranceGeneric = methods.includes('Insurance Accepted');
    const reducedItems = methods.filter((m) => REDUCED_COST_METHODS.includes(m));
    const selfPay = methods.includes('Self-Pay');
    const glance = {
        ...p,
        slidingScale: methods.includes('Sliding Scale'),
        freeLowCost: reducedItems.length > 0,
    };

    const sectionsByTab = useMemo<[string, Section[]][]>(() => {
        /* About */
        const credentialItems = uniq([
            ...(p.providerType === 'individual' && p.credentials ? String(p.credentials).split(/[,;]/).map((c) => c.trim()) : []),
            ...(p.certifications || []),
        ]);
        const about: Section[] = [
            {
                key: 'bio', label: null, show: !!p.bio,
                content: <p className="whitespace-pre-line text-[16px] leading-[1.6] text-[#2C2C2C]">{p.bio}</p>,
            },
            {
                key: 'background', label: 'Professional background', show: !!(p.title || p.yearsExperience),
                content: (
                    <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr]">
                        {p.title && (<><dt className="text-[#2C2C2C]/70">Profession</dt><dd className="text-[#2C2C2C]">{p.title}</dd></>)}
                        {p.yearsExperience && (<><dt className="text-[#2C2C2C]/70">Years of experience</dt><dd className="text-[#2C2C2C]">{p.yearsExperience}</dd></>)}
                    </dl>
                ),
            },
            { key: 'credentials', label: 'Credentials', show: credentialItems.length > 0, content: <CategoryList items={credentialItems} /> },
            { key: 'training', label: 'Specialized Training', show: has(p.specializedTraining), content: <CategoryList items={p.specializedTraining} /> },
            { key: 'setting', label: 'Practice setting', show: has(p.practiceSettings), content: <CategoryList items={p.practiceSettings} /> },
        ];

        /* Areas of Support — "Who I support" first, then grouped support areas */
        const { ageGroups, others } = splitPopulations(p.populations);
        const supportAreas = (p.supportAreas || []).filter((g) => has(g.areas));
        const areaCount = supportAreas.reduce((n, g) => n + g.areas.length, 0);
        const areas: Section[] = [
            {
                key: 'who', label: 'Who I support', show: ageGroups.length > 0 || others.length > 0,
                content: (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {ageGroups.length > 0 && <div><SubLabel>Age groups</SubLabel><CategoryList items={ageGroups} /></div>}
                        {others.length > 0 && <div><SubLabel>Other populations</SubLabel><CategoryList items={others} /></div>}
                    </div>
                ),
            },
            {
                key: 'areas', label: 'Areas of support', show: supportAreas.length > 0,
                content: (
                    <div className={supportAreas.length > 1 && areaCount > 6 ? 'md:columns-2 md:gap-x-8' : ''}>
                        {supportAreas.map((g) => (
                            <div key={g.category} className="mb-4 break-inside-avoid last:mb-0">
                                <SubLabel>{g.category}</SubLabel>
                                <CategoryList items={g.areas} />
                            </div>
                        ))}
                    </div>
                ),
            },
        ];

        /* Services — only services the provider explicitly selected (no "Services offered" signup field yet) */
        const services: Section[] = [
            { key: 'services', label: 'Services offered', show: has(p.servicesOffered), content: <CategoryList items={p.servicesOffered} /> },
        ];

        /* Fees & Insurance */
        const feeRows = has(p.feesByService)
            ? p.feesByService.filter((r) => r && r.fee).map((r) => ({ label: r.service, value: feeWithCurrency(r.fee, r.currency || p.currency || 'USD') }))
            : (feeText ? [{ label: 'Session fee', value: feeText }] : []);
        const scopeNote = p.reducedCostScope === 'this_service'
            ? 'These options apply to the session fee shown above.'
            : p.reducedCostScope === 'other_offerings'
                ? 'These options apply to other services or programs, not the session fee shown above.'
                : 'Ask the provider which services qualify.';
        const fees: Section[] = [
            {
                key: 'fees', label: 'Fees', show: feeRows.length > 0 || selfPay,
                content: (
                    <ul className="space-y-1.5">
                        {feeRows.map((r) => (
                            <li key={r.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                                <span className="text-sm text-[#2C2C2C]">{r.label}</span>
                                <span className="font-semibold text-[#2C2C2C]">{r.value}</span>
                            </li>
                        ))}
                        {selfPay && <li className="text-sm text-[#2C2C2C]">Self-pay accepted</li>}
                    </ul>
                ),
            },
            {
                key: 'insurance', label: 'Insurance accepted', show: insuranceItems.length > 0 || insuranceGeneric,
                content: (
                    <>
                        {insuranceItems.length > 0
                            ? <CategoryList items={insuranceItems} />
                            : <p className="text-sm text-[#2C2C2C]">Accepts insurance — contact the provider to confirm your plan.</p>}
                        <p className="mt-2 text-sm text-[#2C2C2C]/70">{txt('fees.insurance_note')}</p>
                    </>
                ),
            },
            {
                key: 'reduced', label: 'Reduced-cost options', show: reducedItems.length > 0,
                content: (
                    <>
                        <CategoryList items={reducedItems} />
                        <p className="mt-2 text-sm text-[#2C2C2C]/70">{scopeNote}</p>
                    </>
                ),
            },
        ];

        /* Approach */
        const approach: Section[] = [
            {
                key: 'approach', label: 'About my approach', show: !!p.culturalApproach,
                content: <p className="whitespace-pre-line text-[16px] leading-[1.6] text-[#2C2C2C]">{p.culturalApproach}</p>,
            },
            { key: 'treatment', label: 'Treatment / Support Approaches', show: has(p.treatmentApproaches), content: <CategoryList items={p.treatmentApproaches} /> },
            {
                key: 'caribbean', label: 'Experience with Caribbean communities', show: p.caribbeanExperience === true,
                content: (
                    <>
                        <p className="flex items-start gap-2 text-[15px] leading-relaxed text-[#2C2C2C]">
                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1E4D4A]/40" aria-hidden />
                            <span>{CARIBBEAN_EXPERIENCE_STATEMENT}</span>
                        </p>
                        {p.caribbeanExperienceDetails && (
                            <div className="mt-3 rounded-xl border border-[#E8D9B8] bg-[#FAFAF6] p-3.5">
                                <span className="inline-flex rounded-full bg-[#E8D9B8]/40 px-2 py-0.5 text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]">Provider-reported</span>
                                <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-[#2C2C2C]">{p.caribbeanExperienceDetails}</p>
                            </div>
                        )}
                    </>
                ),
            },
        ];

        const all: [string, Section[]][] = [
            ['About', about],
            ['Areas of Support', areas],
            ['Services', services],
            ['Fees & Insurance', fees],
            ['Approach', approach],
        ];
        return all.filter(([, sections]) => sections.some((s) => s.show));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [p]);

    const tabs = sectionsByTab.map(([t]) => t);
    const [tab, setTab] = useState<string>(tabs[0] || 'About');
    const activeSections: Section[] = (sectionsByTab.find(([t]) => t === tab) || sectionsByTab[0] || ['', []])[1];

    return (
        <PageContentContext.Provider value={content}>
            <div className="min-h-screen bg-[#FAFAF6] pb-24 font-body text-[16px] leading-[1.6] text-[#2C2C2C] lg:pb-0">
                <Head title={`${name} — Bahali`} />
                <LandingHeader button={headerButton} />
                <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} provider={p} name={name} />

                <div className="px-[6%] max-[371px]:px-[4%] py-6 lg:py-8">
                    {/* Back to results — above the header card */}
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <Link
                            href={backHref}
                            onClick={onBackToResults}
                            className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-[#1E4D4A] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D4A]/40"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                                <path d="M10.5 19.5 3 12l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {txt('page.back')}
                        </Link>
                        <p className="hidden text-sm font-semibold uppercase tracking-[0.2em] text-[#1E4D4A] sm:block">{txt('page.eyebrow')}</p>
                    </div>

                    {/* header card */}
                    <div className="rounded-2xl border border-[#E8D9B8] bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-6 lg:flex-row">
                            {showPhoto ? (
                                <img src={p.photo ?? undefined} alt={name} onError={() => setImgError(true)} className="h-44 w-full flex-shrink-0 rounded-2xl object-cover ring-1 ring-black/5 lg:h-44 lg:w-40" />
                            ) : (
                                <div aria-hidden className="flex h-44 w-full flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E4D4A] to-[#1E4D4A] text-4xl font-semibold text-white/90 ring-1 ring-black/5 lg:w-40" style={SERIF}>{initials(p.name)}</div>
                            )}

                            <div className="min-w-0 flex-1">
                                {/* Badges row — Profile Reviewed (+ info), Credentials verified, Caribbean support experience (+ info) */}
                                <ProviderBadgeRow
                                    providerType={p.providerType}
                                    licenceVerified={p.licenceVerified}
                                    caribbeanExperience={p.caribbeanExperience}
                                />

                                {/* 16px below the badge row; name on its own line, professions/credentials beneath */}
                                <h1 className="mt-4 break-words text-[26px] font-semibold leading-[1.15] text-[#1E4D4A] md:text-[28px]" style={SERIF}>{name}</h1>
                                {credentialLine && <p className="mt-1 break-words text-[#2C2C2C]">{credentialLine}</p>}

                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#2C2C2C]">
                                    {(p.address || p.location) && (
                                        <span className="inline-flex items-start gap-1.5">
                                            <span className="mt-0.5 text-[#1E4D4A]"><Icon d={Ico.pin} /></span>
                                            <span>{[p.address, p.location].filter(Boolean).join(', ')}</span>
                                        </span>
                                    )}
                                    {has(p.sessionFormats) && (
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="text-[#1E4D4A]">
                                                <Icon d={Ico.monitor} />
                                            </span>
                                            {p.sessionFormats.join(' | ')}
                                        </span>
                                    )}
                                </div>
                                {has(p.additionalLocations) && (
                                    <p className="mt-1.5 text-sm text-[#2C2C2C]">
                                        <span className="text-[#2C2C2C]">Also serves:</span> {p.additionalLocations.join(' · ')}
                                    </p>
                                )}
                                {has(p.languages) && (
                                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-[#2C2C2C]">
                                        <span className="text-[#1E4D4A]"><Icon d={Ico.chat} /></span>
                                        <LanguageList languages={p.languages} max={4} />
                                    </p>
                                )}
                            </div>

                            <div className="w-full flex-shrink-0 lg:w-72">
                                <AvailabilityBox availability={p.availability} confirmedAt={p.availabilityConfirmedAt} />
                            </div>
                        </div>
                    </div>

                    {/* body */}
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
                        {/* LEFT */}
                        <div className="rounded-2xl border border-[#E8D9B8] bg-white shadow-sm">
                            {tabs.length > 0 && (
                                <div role="tablist" className="flex flex-wrap gap-1 border-b border-[#E8D9B8] px-4 pt-3">
                                    {tabs.map((t) => (
                                        <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`min-h-[44px] rounded-t-lg px-3 py-2 text-[15px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D4A]/40 ${tab === t ? 'border-b-2 border-[#1E4D4A] font-semibold text-[#1E4D4A]' : 'border-b-2 border-transparent font-medium text-[#2C2C2C] hover:text-[#1E4D4A]'}`}>{t}</button>
                                    ))}
                                </div>
                            )}
                            <div className="p-6">
                                {activeSections.length > 0
                                    ? <SectionStack sections={activeSections} />
                                    : <p className="text-sm text-[#2C2C2C]/70">This provider hasn't added profile details yet.</p>}
                            </div>
                        </div>

                        {/* RIGHT — At a glance first, then Contact */}
                        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                            <AtAGlance p={glance} feeText={feeText} insuranceItems={insuranceItems} insuranceGeneric={insuranceGeneric} />
                            <ContactPanel provider={p} name={name} />
                        </aside>
                    </div>
                </div>

                <LandingFooter />

                {/* sticky mobile contact bar */}
                {hasContact && (
                    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E8D9B8] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
                        <div className="mx-auto flex max-w-6xl items-center gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[15px] font-semibold text-[#1E4D4A]">{name}</p>
                                {p.availability === 'accepting' && <p className="text-sm text-[#1E4D4A]">Accepting new clients</p>}
                            </div>
                            <button onClick={() => setContactOpen(true)} className="inline-flex min-h-[48px] items-center gap-2 rounded-[10px] bg-[#1E4D4A] px-5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#163F3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D4A]/40 focus-visible:ring-offset-2">{txt('contact.mobile_button')}</button>
                        </div>
                    </div>
                )}
            </div>
        </PageContentContext.Provider>
    );
}
