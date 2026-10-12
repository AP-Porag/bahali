// resources/js/components/provider/ProviderBadges.tsx
// Shared by the results cards (web/provider/index) and the expanded profile (web/provider/show)
// so badge wording, badge rules, names and initials stay identical in both places.
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

export type ProviderType = 'individual' | 'organization' | 'support_group' | 'faith_based' | 'community_program' | string;
export type ReducedCostKind = 'sliding' | 'free';
export type ReducedCostScope = 'this_service' | 'other_offerings' | null | undefined | '';

/* ------------------------------------------------------------------ */
/*  Copy                                                               */
/* ------------------------------------------------------------------ */

export const CARIBBEAN_BADGE_LABEL = 'Caribbean support experience';
export const CARIBBEAN_BADGE_INFO =
    'This provider reports experience supporting Caribbean individuals, families, or communities, including the diaspora.';
export const CARIBBEAN_EXPERIENCE_STATEMENT =
    'Experience providing care or support to Caribbean individuals, families, or communities.';

/* Credentials are verified only for individual providers once the Bahali team completes the licence check. */
export function isCredentialsVerified(providerType?: ProviderType | null, licenceVerified?: boolean | null): boolean {
    return providerType === 'individual' && licenceVerified === true;
}

/* Explanation behind the "Profile Reviewed" info icon — reflects the provider's actual review status. */
export function reviewExplanation(providerType?: ProviderType | null, licenceVerified?: boolean | null): string {
    const reviewed = providerType === 'individual'
        ? 'Bahali reviewed the information this provider submitted — including their professional details, credentials and contact information — before publishing this profile.'
        : 'Bahali reviewed the information this organization submitted — including its services, location and contact information — before publishing this profile.';

    let licence: string;
    if (isCredentialsVerified(providerType, licenceVerified)) {
        licence = "The provider's licence has also been independently verified with the relevant licensing authority.";
    } else if (providerType === 'individual') {
        licence = "The provider's licence has not been independently verified.";
    } else {
        licence = 'Organization profiles are not licence-verified.';
    }

    return `${reviewed} ${licence} This is not a guarantee of treatment quality, fit or outcome.`;
}

/* ------------------------------------------------------------------ */
/*  Names & initials                                                   */
/* ------------------------------------------------------------------ */

const KEEP_UPPER = /^(PhD|PsyD|EdD|MD|DO|MSW|MPH|MA|MS|MEd|LCSW|LMSW|LMHC|LPC|LMFT|NP|RN|BCBA|CEO)$/i;

/* Provider name only — drops anything after a comma ("Dr. Jane Doe, PsyD" → "Dr. Jane Doe").
   Names typed in ALL CAPS or all lowercase are title-cased; mixed-case names (McKenzie, DeShawn) stay as entered. */
export function displayName(name: string | null | undefined = ''): string {
    const base = (String(name || '').split(',')[0] || '').trim().replace(/\s+/g, ' ');
    if (!base) return '';
    const needsCase = base === base.toUpperCase() || base === base.toLowerCase();
    if (!needsCase) return base;
    return base
        .split(' ')
        .map((w) => (KEEP_UPPER.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join(' ');
}

/* Placeholder initials from the provider's name — honorifics and credentials ignored ("Dr. Jane Doe, PsyD" → "JD"). */
export function initials(name: string | null | undefined = ''): string {
    const words = displayName(name)
        .replace(/^(dr|mr|mrs|ms|miss|mx|prof|rev|pastor|fr|sr)\.?\s+/i, '')
        .split(/\s+/)
        .filter(Boolean);
    if (!words.length) return 'B';
    const first = words[0][0] || '';
    const last = words.length > 1 ? words[words.length - 1][0] || '' : '';
    return (first + last).toUpperCase() || 'B';
}

/* ------------------------------------------------------------------ */
/*  Info tooltip — hover, keyboard focus and tap                       */
/* ------------------------------------------------------------------ */

interface InfoTipProps {
    label: string;
    children: ReactNode;
}

export function InfoTip({ label, children }: InfoTipProps) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<{ left: number; width: number }>({ left: -8, width: 256 });
    const wrapRef = useRef<HTMLSpanElement>(null);
    const tipId = useId();

    /* Keep the tooltip inside the viewport (badges can sit near either edge on mobile). */
    useEffect(() => {
        if (!open || !wrapRef.current || typeof window === 'undefined') return;
        const rect = wrapRef.current.getBoundingClientRect();
        // clientWidth = real screen width on mobile (innerWidth can grow when a page overflows)
        const vw = document.documentElement.clientWidth || window.innerWidth;
        const width = Math.min(256, vw - 32);
        const desired = rect.left - 8;
        const clamped = Math.max(16, Math.min(desired, vw - 16 - width));
        setPos({ left: clamped - rect.left, width });
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;
        const onPointerDown = (e: PointerEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <span
            ref={wrapRef}
            className="relative inline-flex"
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOpen(true); }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') setOpen(false); }}
        >
            <button
                type="button"
                aria-label={label}
                aria-describedby={tipId}
                aria-expanded={open}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
                className="-m-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-current opacity-70 transition hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#0E7C7B]/40"
            >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 16v-4M12 8h.01" />
                </svg>
            </button>
            <span
                id={tipId}
                role="tooltip"
                style={{ left: pos.left, width: pos.width }}
                className={`absolute top-full z-40 mt-2 rounded-xl border border-[#E7E0D2] bg-white p-3 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-[#3A4B49] shadow-lg ${open ? 'block' : 'hidden'}`}
            >
                {children}
            </span>
        </span>
    );
}

/* ------------------------------------------------------------------ */
/*  Badges                                                             */
/* ------------------------------------------------------------------ */

interface ReviewProps {
    providerType?: ProviderType | null;
    licenceVerified?: boolean | null;
}

export function ProfileReviewedBadge({ providerType, licenceVerified }: ReviewProps) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DED7C9] bg-[#FBF8F2] px-3 py-1 text-xs font-medium text-[#6B7A78]">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2.5 10S5 5 10 5s7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5Z" />
                <circle cx="10" cy="10" r="2.25" />
            </svg>
            Profile Reviewed
            <InfoTip label="What does Profile Reviewed mean?">
                {reviewExplanation(providerType, licenceVerified)}
            </InfoTip>
        </span>
    );
}

export function CredentialsVerifiedBadge() {
    const maskId = `award-cut-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0E7C7B]/25 bg-[#0E7C7B]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#0E6B6A]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="currentColor" aria-hidden="true">
                <defs>
                    <mask id={maskId}>
                        <rect width="24" height="24" fill="#fff" />
                        <circle cx="12" cy="9.5" r="4.9" fill="none" stroke="#000" strokeWidth="1.2" />
                        <path d="M9.7 9.7l1.6 1.6 3.1-3.3" fill="none" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </mask>
                </defs>
                <path d="M8.2 14 5 21.5l2.4-.6 1.2 2.1L11 16.5zM15.8 14 19 21.5l-2.4-.6-1.2 2.1L13 16.5z" />
                <g mask={`url(#${maskId})`}>
                    <circle cx="12" cy="9.5" r="7" />
                    <circle cx="12" cy="2.5" r="1.5" /><circle cx="15.5" cy="3.44" r="1.5" />
                    <circle cx="18.06" cy="6" r="1.5" /><circle cx="19" cy="9.5" r="1.5" />
                    <circle cx="18.06" cy="13" r="1.5" /><circle cx="15.5" cy="15.56" r="1.5" />
                    <circle cx="12" cy="16.5" r="1.5" /><circle cx="8.5" cy="15.56" r="1.5" />
                    <circle cx="5.94" cy="13" r="1.5" /><circle cx="5" cy="9.5" r="1.5" />
                    <circle cx="5.94" cy="6" r="1.5" /><circle cx="8.5" cy="3.44" r="1.5" />
                </g>
            </svg>
            Credentials verified
        </span>
    );
}

export function CaribbeanExperienceBadge() {
    return (
        <span
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D9C89E] bg-[#F5EDDC] px-3 py-1 text-xs font-medium text-[#8A5A2B]"
            style={{ letterSpacing: '0.01em' }}
        >
            {CARIBBEAN_BADGE_LABEL}
            <InfoTip label={`What does ${CARIBBEAN_BADGE_LABEL} mean?`}>
                {CARIBBEAN_BADGE_INFO}
            </InfoTip>
        </span>
    );
}

/* The full badge row, used by both the results card and the profile header. */
interface ProviderBadgeRowProps extends ReviewProps {
    caribbeanExperience?: boolean | null;
    className?: string;
}

export function ProviderBadgeRow({ providerType, licenceVerified, caribbeanExperience, className = '' }: ProviderBadgeRowProps) {
    return (
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>
            <ProfileReviewedBadge providerType={providerType} licenceVerified={licenceVerified} />
            {isCredentialsVerified(providerType, licenceVerified) && <CredentialsVerifiedBadge />}
            {caribbeanExperience === true && <CaribbeanExperienceBadge />}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Fees & populations — same wording on cards, header, tabs, sidebar  */
/* ------------------------------------------------------------------ */

/* Fee with currency beside it (e.g. "$100–$150 / session" → "$100–$150 USD / session") */
export function feeWithCurrency(fee: string | null | undefined = '', currency: string = 'USD'): string {
    if (!fee) return '';
    if (/\b[A-Z]{3}\b/.test(fee)) return fee; // currency code already present
    return /\s\/\s/.test(fee) ? fee.replace(/\s\/\s/, ` ${currency} / `) : `${fee} ${currency}`;
}

/* Reduced-cost wording — says whether it applies to the displayed fee or to other offerings */
export function reducedCostLabel(kind: ReducedCostKind, scope?: ReducedCostScope | string): string {
    const base = kind === 'sliding' ? 'Sliding scale' : 'Free / low-cost options';
    if (scope === 'this_service') return `${base} available for this service`;
    if (scope === 'other_offerings') return `${base} available for other offerings`;
    return `${base} offered — ask which services qualify`;
}

/* Age groups are the populations with an age range, e.g. "Children (6–12)", "Older Adults (65+)". */
const AGE_GROUP_RE = /\(\s*\d+\s*(?:[–-]\s*\d+|\+)\s*\)/;
export function splitPopulations(list: string[] | null | undefined = []): { ageGroups: string[]; others: string[] } {
    const items: string[] = Array.isArray(list) ? list.filter(Boolean) : [];
    return {
        ageGroups: items.filter((x) => AGE_GROUP_RE.test(x)),
        others: items.filter((x) => !AGE_GROUP_RE.test(x)),
    };
}
