import { useMemo, useRef, useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Header from "@/components/provider/ProviderMenu";
import ProviderMenu from '@/components/provider/ProviderMenu';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type ProviderType =
    | 'individual' | 'organization' | 'support_group' | 'faith_based' | 'community_program';
type LicenseStatus = 'active' | 'provisional' | 'not_applicable';
type YesNo = 'yes' | 'no';
type CaribbeanIdentity = 'yes' | 'no' | 'prefer_not';

interface ProviderFormData {
    provider_type: ProviderType | '';
    organization_name: string;
    credentials: string;
    professional_title: string[];
    professional_title_other: string;
    short_bio: string;
    years_experience: string;
    license_number: string;
    license_not_applicable: boolean;
    license_states: string[];
    license_states_other: string;
    license_status: LicenseStatus | '';
    verification_document: File | null;
    areas_of_support: string[];
    areas_of_support_other: string;
    populations_served: string[];
    treatment_approaches: string[];
    treatment_approaches_other: string;
    specialized_training: string[];
    specialized_training_other: string;
    certifications: string[];
    caribbean_identity: CaribbeanIdentity | '';
    caribbean_experience: YesNo | '';
    languages: string[];
    languages_other: string;
    cultural_approach: string;
    service_formats: string[];
    practice_settings: string[];
    practice_settings_other: string;
    address: string;
    city: string;
    state_province: string;
    country: string;
    multiple_locations: YesNo | '';
    hide_address: boolean;
    telehealth_regions: string[];
    telehealth_regions_other: string;
    payment_methods: string[];
    insurance_plans: string;
    phone: string;
    website: string;
    social_links: string;
    profile_photo: File | null;
    additional_photos: File[];
    accessibility: string[];
    accessibility_other: string;
}
type FieldName = keyof ProviderFormData;
type FormErrors = Partial<Record<FieldName, string>>;

/* ------------------------------------------------------------------ */
/*  Option data                                                        */
/* ------------------------------------------------------------------ */
const PROVIDER_TYPES: { value: ProviderType; label: string }[] = [
    { value: 'individual', label: 'Individual Provider' },
    { value: 'organization', label: 'Organization / Agency' },
    { value: 'support_group', label: 'Support Group' },
    { value: 'faith_based', label: 'Faith-Based Organization' },
    { value: 'community_program', label: 'Community Program' },
];
const PROFESSIONAL_TITLES = [
    'Clinical Psychologist', 'Neuropsychologist', 'School Psychologist', 'Psychiatrist',
    'Psychiatric Mental Health Nurse Practitioner', 'Clinical Social Worker', 'Mental Health Counselor',
    'Marriage and Family Therapist', 'Board Certified Behavior Analyst (BCBA)', 'Substance Use Counselor',
    'Addiction Medicine Specialist', 'Developmental-Behavioral Pediatrician', 'Parent Coach',
    'Peer Support Specialist', 'Community Health Worker', 'Pastoral Counselor', 'Other (specify)',
];
const YEARS_EXPERIENCE = [
    'Less than 2 years', '2–5 years', '6–10 years', '11–15 years', '16–20 years', '20+ years',
];
const LICENSE_STATUSES: { value: LicenseStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'provisional', label: 'Provisional' },
    { value: 'not_applicable', label: 'Not Applicable' },
];
const AREAS_OF_SUPPORT_GROUPS: { category: string; items: string[] }[] = [
    { category: 'Mental & Emotional Well-Being', items: ['Anxiety & Worry', 'Depression & Low Mood', 'Stress & Burnout', 'Trauma & Recovery', 'Grief & Loss', 'Anger & Irritability', 'Building Self-Confidence', 'Managing Emotions', 'Life Changes & Transitions', 'Panic Attacks', 'Obsessive Thoughts & Compulsive Behaviors (OCD)', 'Mood Changes'] },
    { category: 'Relationships & Family', items: ['Couples & Relationship Counseling', 'Marriage Counseling', 'Premarital Counseling', 'Parenting Support', 'Co-Parenting', 'Family Conflict', 'Divorce & Separation', 'Blended Families', 'Communication Challenges', 'Caregiver Support', 'Healing from Relationship Abuse', 'Sex Therapy'] },
    { category: 'Children, Teens & Families', items: ['Child Behavioral Challenges', 'Teen Emotional Wellness', 'ADHD', 'Autism & Neurodiversity', 'School Challenges', 'Bullying', 'Social Skills', 'Parent-Child Relationships', 'Childhood Trauma', 'Big Feelings & Emotional Regulation'] },
    { category: "Women's Health & Wellness", items: ['Pregnancy Support', 'Pregnancy & Infant Loss', 'Postpartum Depression', 'Postpartum Anxiety', 'Infertility', 'Menopause & Midlife'] },
    { category: "Men's Health & Wellness", items: ["Men's Emotional Wellness", 'Fatherhood', 'Relationship Challenges', 'Managing Anger', 'Identity & Purpose'] },
    { category: 'Older Adults & Aging', items: ['Healthy Aging & Older Adult Well-Being', 'Memory Concerns', 'Dementia Support', "Alzheimer's Disease Support", 'Retirement & Life Changes', 'Coping with Chronic Illness', 'Grief & Loss in Later Life'] },
    { category: 'Trauma, Crisis & Recovery', items: ['Trauma', 'PTSD', 'Childhood Trauma', 'Sexual Assault & Sexual Trauma', 'Domestic & Intimate Partner Violence', 'Military & Service-Related Trauma', 'Disaster & Displacement', 'Community Violence', 'Self-Harm', 'Suicidal Thoughts & Behaviors'] },
    { category: 'Health & Everyday Wellness', items: ['Living with Chronic Illness', 'Living with Chronic Pain', 'Sleep & Insomnia', 'Health-Related Anxiety', 'Stress Management', 'Lifestyle Changes', 'Emotional Eating & Weight Concerns'] },
    { category: 'Substance Use & Recovery', items: ['Alcohol Use', 'Substance Use', 'Recovery Support', 'Relapse Prevention'] },
    { category: 'Work, School & Daily Life', items: ['Workplace Stress', 'Compassion Fatigue', 'Vicarious Trauma', 'Leadership & Executive Wellness', 'Career Changes', 'Academic Stress', 'College & University Adjustment'] },
    { category: 'Culture, Faith & Community', items: ['Caribbean & Diaspora Wellness', 'Faith & Spiritual Support', 'Psychological First Aid', 'Church & Ministry Support', 'Immigration & Adjusting to a New Culture', 'Cultural Identity & Belonging', 'Experiences of Racism & Discrimination', 'LGBTQIA+ Support'] },
];
const POPULATIONS_SERVED = ['Infants & Toddlers (0–5)', 'Children (6–12)', 'Adolescents (13–17)', 'Young Adults (18–25)', 'Adults (26–64)', 'Older Adults (65+)', 'Parents', 'Caregivers', 'Couples', 'Families', 'Veterans', 'Faith Leaders & Clergy', 'Helping Professionals', 'Educators', 'First Responders', 'Healthcare Professionals', 'Community Leaders'];
const TREATMENT_APPROACHES = ['Acceptance & Commitment Therapy (ACT)', 'Cognitive Behavioral Therapy (CBT)', 'Cognitive Processing Therapy (CPT)', 'Dialectical Behavior Therapy (DBT)', 'Eye Movement Desensitization & Reprocessing (EMDR)', 'Exposure & Response Prevention (ERP)', 'Family Systems Therapy', 'Gottman Method', 'Interpersonal Psychotherapy (IPT)', 'Mindfulness-Based Approaches', 'Motivational Interviewing (MI)', 'Person-Centered Therapy', 'Prolonged Exposure (PE)', 'Psychodynamic Therapy', 'Solution-Focused Brief Therapy (SFBT)', 'Trauma-Focused Cognitive Behavioral Therapy (TF-CBT)', 'Integrative / Eclectic Therapy', 'Other (specify)'];
const SPECIALIZED_TRAINING_OPTIONS = ['Psychological First Aid (PFA)', 'Trauma & PTSD', 'Suicide Prevention & Intervention', 'Grief & Bereavement', 'Perinatal Mental Health', 'Substance Use & Recovery', 'Domestic & Intimate Partner Violence', 'Military & Veteran Mental Health', 'Dementia & Cognitive Care', 'Autism & Neurodiversity', 'ADHD', 'Couples & Family Therapy', 'Other Specialized Training'];
const LANGUAGES = ['English', 'Spanish', 'Haitian Creole', 'French', 'Jamaican Patois', 'Trinidadian Creole', 'Dutch', 'Other'];
const SERVICE_FORMATS = ['In-Person', 'Virtual', 'Hybrid', 'Home-Based / Mobile', 'Group-Based', 'School-Based'];
const PRACTICE_SETTINGS = ['Private Practice', 'Community Agency', 'Hospital / Health System', 'School', 'University', 'Faith-Based Setting', 'Nonprofit Organization', 'Government Agency', 'Independent Contractor'];
const PAYMENT_METHODS = ['Self-Pay', 'Insurance Accepted', 'Medicaid', 'Medicare', 'Employee Assistance Programs (EAP)', 'Sliding Scale', 'Government-Funded', 'Grant-Funded', 'Donation-Based', 'Pro Bono / Volunteer Services', 'No-Cost Services'];
const ACCESSIBILITY_OPTIONS = ['Wheelchair Accessible', 'ADA Accessible', 'Interpreter Available', 'Closed Captioning Available', 'Sensory-Friendly Environment', 'Home Visits Available', 'Public Transportation Accessible'];
const REGIONS = ['Anguilla', 'Antigua and Barbuda', 'Aruba', 'Bahamas', 'Barbados', 'Belize', 'Bermuda', 'British Virgin Islands', 'Cayman Islands', 'Cuba', 'Curaçao', 'Dominica', 'Dominican Republic', 'Grenada', 'Guadeloupe', 'Guyana', 'Haiti', 'Jamaica', 'Martinique', 'Montserrat', 'Puerto Rico', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Spanish Virgin Islands', 'Suriname', 'Trinidad and Tobago', 'Turks and Caicos Islands', 'United States', 'United States Virgin Islands', 'United Kingdom', 'Canada'];

/* ------------------------------------------------------------------ */
/*  Step metadata (no OTP / account / consent — this is edit mode)     */
/* ------------------------------------------------------------------ */
const STEPS = [
    { key: 'basic', title: 'Provider Information', subtitle: 'Who you are' },
    { key: 'about', title: 'About You', subtitle: 'Your approach' },
    { key: 'license', title: 'Licensure & Verification', subtitle: 'Credentials' },
    { key: 'areas', title: 'Areas of Support', subtitle: 'What you help with' },
    { key: 'populations', title: 'Populations Served', subtitle: 'Who you serve' },
    { key: 'expertise', title: 'Professional Expertise', subtitle: 'Approaches & training' },
    { key: 'culture', title: 'Cultural & Language', subtitle: 'Responsiveness' },
    { key: 'service', title: 'Service Information', subtitle: 'How you work' },
    { key: 'location', title: 'Location', subtitle: 'Where you are' },
    { key: 'payment', title: 'Insurance & Payment', subtitle: 'Accepted methods' },
    { key: 'contact', title: 'Contact Information', subtitle: 'Reach you' },
    { key: 'media', title: 'Profile Media', subtitle: 'Photos & logo' },
    { key: 'accessibility', title: 'Accessibility', subtitle: 'Accommodations' },
] as const;
const TOTAL_STEPS = STEPS.length;

const FIELD_STEP: Record<string, number> = {
    provider_type: 0, organization_name: 0, credentials: 0, professional_title: 0, professional_title_other: 0,
    short_bio: 1, years_experience: 1,
    license_number: 2, license_not_applicable: 2, license_states: 2, license_states_other: 2, license_status: 2, verification_document: 2,
    areas_of_support: 3, areas_of_support_other: 3,
    populations_served: 4,
    treatment_approaches: 5, treatment_approaches_other: 5, specialized_training: 5, specialized_training_other: 5, certifications: 5,
    caribbean_identity: 6, caribbean_experience: 6, languages: 6, languages_other: 6, cultural_approach: 6,
    service_formats: 7, practice_settings: 7, practice_settings_other: 7,
    address: 8, city: 8, state_province: 8, country: 8, multiple_locations: 8, hide_address: 8, telehealth_regions: 8, telehealth_regions_other: 8,
    payment_methods: 9, insurance_plans: 9,
    phone: 10, website: 10, social_links: 10,
    profile_photo: 11, additional_photos: 11,
    accessibility: 12, accessibility_other: 12,
};

/* ------------------------------------------------------------------ */
/*  Validation helpers                                                 */
/* ------------------------------------------------------------------ */
const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const isUrl = (s: string) => /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(s.trim());

/* ------------------------------------------------------------------ */
/*  Reverse-mapping of stored values -> form values                   */
/* ------------------------------------------------------------------ */
const splitStored = (stored: string[] | undefined, known: string[], sentinel: string) => {
    const values: string[] = [];
    const others: string[] = [];
    (Array.isArray(stored) ? stored : []).forEach((v) => {
        if (known.includes(v)) values.push(v);
        else others.push(v);
    });
    if (others.length) values.push(sentinel);
    return { values, otherText: others.join(', ') };
};

/* ------------------------------------------------------------------ */
/*  Reusable field components                                          */
/* ------------------------------------------------------------------ */
const errClass = (hasError: boolean) =>
    hasError
        ? 'border-[#C2543B] focus:border-[#C2543B] focus:ring-[#C2543B]/30'
        : 'border-[#DED7C9] focus:border-[#0E7C7B] focus:ring-[#0E7C7B]/25';

function FieldShell({ label, required, hint, error, children }: { label?: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode; }) {
    return (
        <div>
            {label && (
                <label className="mb-1.5 block text-sm font-medium text-[#26403F]">
                    {label}{required && <span className="ml-1 text-[#C2543B]">*</span>}
                </label>
            )}
            {hint && <p className="mb-2 text-xs text-[#6B7A78]">{hint}</p>}
            {children}
            {error && (
                <p className="mt-1.5 flex items-center gap-1 text-sm text-[#C2543B]">
                    <span aria-hidden>⚠</span>{error}
                </p>
            )}
        </div>
    );
}

function TextInput({ value, onChange, error, placeholder, type = 'text', disabled = false }: { value: string; onChange: (v: string) => void; error?: boolean; placeholder?: string; type?: string; disabled?: boolean; }) {
    return (
        <input type={type} value={value} disabled={disabled} placeholder={placeholder}
            onChange={(ev) => onChange(ev.target.value)}
            className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[#1F2A2E] placeholder-[#9AA6A4] outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:bg-[#F1EDE3] disabled:text-[#9AA6A4] ${errClass(!!error)}`} />
    );
}

function TextArea({ value, onChange, error, placeholder, rows = 5 }: { value: string; onChange: (v: string) => void; error?: boolean; placeholder?: string; rows?: number; }) {
    return (
        <textarea value={value} rows={rows} placeholder={placeholder}
            onChange={(ev) => onChange(ev.target.value)}
            className={`w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-[#1F2A2E] placeholder-[#9AA6A4] outline-none transition focus:ring-4 ${errClass(!!error)}`} />
    );
}

function SearchableSelect({ value, onChange, options, error, placeholder = 'Select…', searchPlaceholder = 'Search…', emptyText = 'No results found.' }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] | string[]; error?: boolean; placeholder?: string; searchPlaceholder?: string; emptyText?: string; }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const rootRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const opts = useMemo(() => options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)), [options]);
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return opts;
        return opts.filter((o) => o.label.toLowerCase().includes(q));
    }, [opts, query]);
    const selectedLabel = opts.find((o) => o.value === value)?.label ?? '';
    useEffect(() => {
        if (!open) return;
        const onClick = (e: MouseEvent) => { if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false); };
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
    }, [open]);
    useEffect(() => { if (open) requestAnimationFrame(() => searchRef.current?.focus()); else setQuery(''); }, [open]);
    return (
        <div ref={rootRef} className="relative">
            <button type="button" role="combobox" aria-expanded={open} onClick={() => setOpen((o) => !o)}
                className={`flex w-full items-center justify-between rounded-lg border bg-white px-3.5 py-2.5 text-left outline-none transition focus:ring-4 ${errClass(!!error)} ${open ? 'border-[#0E7C7B] ring-4 ring-[#0E7C7B]/25' : ''}`}>
                <span className={`truncate ${selectedLabel ? 'text-[#1F2A2E]' : 'text-[#9AA6A4]'}`}>{selectedLabel || placeholder}</span>
                <svg viewBox="0 0 24 24" className={`ml-2 h-4 w-4 flex-shrink-0 text-[#6B7A78] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" /></svg>
            </button>
            {open && (
                <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-lg border border-[#DED7C9] bg-white shadow-lg">
                    <div className="flex items-center gap-2 border-b border-[#EFEAE0] px-3">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 text-[#9AA6A4]" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" /></svg>
                        <input ref={searchRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder} className="w-full bg-transparent py-2.5 text-sm text-[#1F2A2E] placeholder-[#9AA6A4] outline-none" />
                    </div>
                    <ul role="listbox" className="max-h-60 overflow-y-auto p-1">
                        {filtered.length === 0 && (<li className="px-3 py-6 text-center text-sm text-[#9AA6A4]">{emptyText}</li>)}
                        {filtered.map((o) => {
                            const active = o.value === value;
                            return (
                                <li key={o.value}>
                                    <button type="button" role="option" aria-selected={active} onClick={() => { onChange(o.value); setOpen(false); }}
                                        className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition ${active ? 'bg-[#0E7C7B]/10 text-[#15403F]' : 'text-[#3A4B49] hover:bg-[#0E7C7B]/5'}`}>
                                        <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center text-[#0E7C7B] ${active ? 'opacity-100' : 'opacity-0'}`} aria-hidden>
                                            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path d="M7.6 13.4 4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" /></svg>
                                        </span>
                                        <span className="leading-snug">{o.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

function RadioRow({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; }) {
    return (
        <div className="flex flex-wrap gap-2.5">
            {options.map((o) => {
                const active = value === o.value;
                return (
                    <button key={o.value} type="button" role="radio" aria-checked={active} onClick={() => onChange(o.value)}
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${active ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white shadow-sm' : 'border-[#DED7C9] bg-white text-[#3A4B49] hover:border-[#0E7C7B]/60 hover:bg-[#0E7C7B]/5'}`}>
                        {o.label}
                    </button>
                );
            })}
        </div>
    );
}

function CheckGrid({ options, selected, onToggle, columns = 2 }: { options: string[]; selected: string[]; onToggle: (v: string) => void; columns?: number; }) {
    return (
        <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {options.map((o) => {
                const active = selected.includes(o);
                return (
                    <button key={o} type="button" role="checkbox" aria-checked={active} onClick={() => onToggle(o)}
                        className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm transition ${active ? 'border-[#0E7C7B] bg-[#0E7C7B]/8 text-[#15403F]' : 'border-[#DED7C9] bg-white text-[#3A4B49] hover:border-[#0E7C7B]/50'}`}>
                        <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition ${active ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white' : 'border-[#C7BEAD] bg-white'}`} aria-hidden>
                            {active && (<svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path d="M7.6 13.4 4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" /></svg>)}
                        </span>
                        <span className="leading-snug">{o}</span>
                    </button>
                );
            })}
        </div>
    );
}

function OtherCheckboxField({ checked, text, onToggle, onTextChange, placeholder, error }: { checked: boolean; text: string; onToggle: () => void; onTextChange: (v: string) => void; placeholder?: string; error?: boolean; }) {
    return (
        <div className="mt-2.5 space-y-2.5">
            <button type="button" role="checkbox" aria-checked={checked} onClick={onToggle}
                className={`flex w-full items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm transition ${checked ? 'border-[#0E7C7B] bg-[#0E7C7B]/8 text-[#15403F]' : 'border-[#DED7C9] bg-white text-[#3A4B49] hover:border-[#0E7C7B]/50'}`}>
                <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition ${checked ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white' : 'border-[#C7BEAD] bg-white'}`} aria-hidden>
                    {checked && (<svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path d="M7.6 13.4 4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" /></svg>)}
                </span>
                <span className="leading-snug">Other (specify)</span>
            </button>
            {checked && (<TextInput value={text} onChange={onTextChange} placeholder={placeholder} error={error} />)}
        </div>
    );
}

function CertificationsInput({ values, onChange }: { values: string[]; onChange: (list: string[]) => void; }) {
    const add = () => onChange([...values, '']);
    const update = (idx: number, val: string) => { const l = [...values]; l[idx] = val; onChange(l); };
    const remove = (idx: number) => onChange(values.filter((_, i) => i !== idx));
    return (
        <div className="space-y-2">
            {values.map((val, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <TextInput value={val} onChange={(v) => update(idx, v)} placeholder="e.g. PMH-C, CCTP, EMDR Certified Therapist" />
                    <button type="button" onClick={() => remove(idx)} className="text-sm text-[#C2543B] hover:underline">Remove</button>
                </div>
            ))}
            <button type="button" onClick={add} className="inline-flex items-center gap-1 text-sm text-[#0E7C7B] hover:underline">
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth={2} /></svg>
                Add credential
            </button>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Page props                                                         */
/* ------------------------------------------------------------------ */
interface RegionData { id: number; name: string; regionTypeName?: string; regionTypeLabel?: string; }
interface CountryData { id: number; name: string; code: string; regions: RegionData[]; }
interface StoredProvider extends Partial<Record<string, unknown>> {
    email?: string;
    status?: string;
}
interface PageProps {
    errors?: Partial<Record<string, string>>;
    countries: CountryData[];
    provider: StoredProvider;
    supportAreas: { category: string; area: string }[];
    existingProfilePhoto: string | null;
    existingVerificationDoc: string | null;
    existingAdditionalPhotos: { path: string; url: string }[];
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function ProviderProfileEdit({
    errors: serverErrors, countries, provider,
    supportAreas = [], existingProfilePhoto, existingVerificationDoc, existingAdditionalPhotos = [],
}: PageProps) {
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const topRef = useRef<HTMLDivElement>(null);

    // Kept existing additional photos (removable).
    const [keptPhotos, setKeptPhotos] = useState(existingAdditionalPhotos);

    /* ---- Build initial form data by reversing the stored "Other" merges ---- */
    const built = useMemo(() => {
        const p = provider || {};
        const arr = (k: string) => (Array.isArray(p[k]) ? (p[k] as string[]) : []);

        const pt = splitStored(arr('professional_title'), PROFESSIONAL_TITLES.filter(t => t !== 'Other (specify)'), 'Other (specify)');
        const lang = splitStored(arr('languages'), LANGUAGES.filter(l => l !== 'Other'), 'Other');
        const ls = splitStored(arr('license_states'), REGIONS, '__other__');
        const tr = splitStored(arr('telehealth_regions'), REGIONS, '__other__');
        const acc = splitStored(arr('accessibility'), ACCESSIBILITY_OPTIONS, '__other__');
        const ps = splitStored(arr('practice_settings'), PRACTICE_SETTINGS, '__other__');
        const ta = splitStored(arr('treatment_approaches'), TREATMENT_APPROACHES.filter(t => t !== 'Other (specify)'), 'Other (specify)');
        const st = splitStored(arr('specialized_training'), SPECIALIZED_TRAINING_OPTIONS.filter(t => t !== 'Other Specialized Training'), 'Other Specialized Training');

        // Areas of support: known area -> flat list; unknown -> custom per category.
        const knownAreas = new Set<string>();
        AREAS_OF_SUPPORT_GROUPS.forEach(g => g.items.forEach(i => knownAreas.add(i)));
        const areasFlat: string[] = [];
        const customAreas: Record<string, { checked: boolean; text: string }> = {};
        AREAS_OF_SUPPORT_GROUPS.forEach(g => { customAreas[g.category] = { checked: false, text: '' }; });
        supportAreas.forEach(({ category, area }) => {
            if (knownAreas.has(area)) {
                if (!areasFlat.includes(area)) areasFlat.push(area);
            } else if (customAreas[category] !== undefined) {
                const prev = customAreas[category].text;
                customAreas[category] = { checked: true, text: prev ? `${prev}, ${area}` : area };
            }
        });

        const data: ProviderFormData = {
            provider_type: (p.provider_type as ProviderType) || '',
            organization_name: (p.organization_name as string) || '',
            credentials: (p.credentials as string) || '',
            professional_title: pt.values,
            professional_title_other: pt.otherText,
            short_bio: (p.short_bio as string) || '',
            years_experience: (p.years_experience as string) || '',
            license_number: (p.license_number as string) || '',
            license_not_applicable: !!p.license_not_applicable,
            license_states: ls.values,
            license_states_other: ls.otherText,
            license_status: (p.license_status as LicenseStatus) || '',
            verification_document: null,
            areas_of_support: areasFlat,
            areas_of_support_other: '',
            populations_served: arr('populations_served'),
            treatment_approaches: ta.values,
            treatment_approaches_other: ta.otherText,
            specialized_training: st.values,
            specialized_training_other: st.otherText,
            certifications: arr('certifications'),
            caribbean_identity: (p.caribbean_identity as CaribbeanIdentity) || '',
            caribbean_experience: (p.caribbean_experience as YesNo) || '',
            languages: lang.values,
            languages_other: lang.otherText,
            cultural_approach: (p.cultural_approach as string) || '',
            service_formats: arr('service_formats'),
            practice_settings: ps.values,
            practice_settings_other: ps.otherText,
            address: (p.address as string) || '',
            city: (p.city as string) || '',
            state_province: (p.state_province as string) || '',
            country: (p.country as string) || '',
            multiple_locations: (p.multiple_locations as YesNo) || '',
            hide_address: !!p.hide_address,
            telehealth_regions: tr.values,
            telehealth_regions_other: tr.otherText,
            payment_methods: arr('payment_methods'),
            insurance_plans: (p.insurance_plans as string) || '',
            phone: (p.phone as string) || '',
            website: (p.website as string) || '',
            social_links: (p.social_links as string) || '',
            profile_photo: null,
            additional_photos: [],
            accessibility: acc.values,
            accessibility_other: acc.otherText,
        };
        return { data, customAreas };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [customSupportAreas, setCustomSupportAreas] = useState(built.customAreas);
    const updateCustomSupportArea = (category: string, field: 'checked' | 'text', value: boolean | string) => {
        setCustomSupportAreas(prev => ({ ...prev, [category]: { ...prev[category], [field]: value } }));
    };

    const form = useForm<ProviderFormData>(built.data);
    const d = form.data;

    /* ---- field helpers --------------------------------------------- */
    const set = <K extends FieldName>(key: K, value: ProviderFormData[K]) => {
        form.setData(key, value);
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };
    const toggle = (key: FieldName, value: string) => {
        const a = (d[key] as string[]) ?? [];
        const next = a.includes(value) ? a.filter((v) => v !== value) : [...a, value];
        set(key, next as ProviderFormData[typeof key]);
    };
    const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    /* ---- Validation ----------------------------------------------- */
    const validateStep = (s: number, d: ProviderFormData): FormErrors => {
        const e: FormErrors = {};
        switch (s) {
            case 0:
                if (!d.provider_type) e.provider_type = 'Please select a provider type.';
                if (!d.organization_name.trim()) e.organization_name = 'Please enter your name or organization.';
                if (d.professional_title.length === 0) e.professional_title = 'Please select at least one professional title.';
                if (d.professional_title.includes('Other (specify)') && !d.professional_title_other.trim()) e.professional_title_other = 'Please specify your title.';
                break;
            case 1:
                if (!d.short_bio.trim()) e.short_bio = 'A short bio is required.';
                else if (wordCount(d.short_bio) > 500) e.short_bio = 'Please keep your bio to 500 words or fewer.';
                break;
            case 2: {
                if (!d.license_not_applicable && !d.license_number.trim()) e.license_number = 'Enter your license number, or select "Not applicable".';
                if (!d.license_status) e.license_status = 'Please select your license status.';
                const hasOther = d.license_states.includes('__other__');
                const hasSel = d.license_states.length > 0 && !(d.license_states.length === 1 && hasOther);
                if (!hasSel && !(hasOther && d.license_states_other.trim())) e.license_states = 'Select at least one state/country or specify "Other".';
                if (hasOther && !d.license_states_other.trim()) e.license_states_other = 'Please specify the other state or country.';
                break;
            }
            case 3: {
                const selectedCount = d.areas_of_support.length;
                let customCount = 0; const customErrors: string[] = [];
                for (const cat of Object.keys(customSupportAreas)) {
                    const c = customSupportAreas[cat];
                    if (c.checked) { if (c.text.trim() === '') customErrors.push(`Please specify the custom area for "${cat}".`); else customCount++; }
                }
                if (selectedCount === 0 && customCount === 0) e.areas_of_support = 'Select at least one area of support or specify an "Other" area.';
                if (customErrors.length > 0) e.areas_of_support = customErrors[0];
                break;
            }
            case 4:
                if (d.populations_served.length === 0) e.populations_served = 'Select at least one population you serve.';
                break;
            case 5:
                if (d.treatment_approaches.includes('Other (specify)') && !d.treatment_approaches_other.trim()) e.treatment_approaches_other = 'Please specify your other approach.';
                if (d.specialized_training.includes('Other Specialized Training') && !d.specialized_training_other.trim()) e.specialized_training_other = 'Please specify your other training.';
                break;
            case 6:
                if (!d.caribbean_identity) e.caribbean_identity = 'Please answer so the directory reflects you accurately.';
                if (!d.caribbean_experience) e.caribbean_experience = 'Please let us know about your experience.';
                if (d.languages.length === 0) e.languages = 'Select at least one language you speak.';
                if (d.languages.includes('Other') && !d.languages_other.trim()) e.languages_other = 'Please specify the other language(s).';
                if (d.cultural_approach && wordCount(d.cultural_approach) > 250) e.cultural_approach = 'Please keep this to 250 words or fewer.';
                break;
            case 7:
                if (d.service_formats.length === 0) e.service_formats = 'Select at least one service format.';
                if (d.practice_settings.length === 0) e.practice_settings = 'Select at least one practice setting.';
                break;
            case 8: {
                if (!d.address.trim()) e.address = 'Address is required.';
                if (!d.city.trim()) e.city = 'City is required.';
                if (!d.state_province) e.state_province = 'State / Province is required.';
                if (!d.country) e.country = 'Country is required.';
                if (!d.multiple_locations) e.multiple_locations = 'Please let us know if you serve multiple locations.';
                const hasOther = d.telehealth_regions.includes('__other__');
                const hasSel = d.telehealth_regions.length > 0 && !(d.telehealth_regions.length === 1 && hasOther);
                if (!hasSel && !(hasOther && d.telehealth_regions_other.trim())) e.telehealth_regions = 'Select at least one telehealth region or specify "Other".';
                if (hasOther && !d.telehealth_regions_other.trim()) e.telehealth_regions_other = 'Please specify the other telehealth region(s).';
                break;
            }
            case 9:
                if (d.payment_methods.length === 0) e.payment_methods = 'Select at least one accepted payment method.';
                break;
            case 10:
                if (!d.phone.trim()) e.phone = 'Phone number is required.';
                else if (d.phone.replace(/[^\d]/g, '').length < 7) e.phone = 'Please enter a valid phone number.';
                if (d.website && !isUrl(d.website)) e.website = 'Enter a valid website';
                break;
            case 11:
                if (!d.profile_photo && !existingProfilePhoto) e.profile_photo = 'A professional photo or organization logo is required.';
                break;
            case 12: {
                const hasOther = d.accessibility.includes('__other__');
                const hasSel = d.accessibility.length > 0 && !(d.accessibility.length === 1 && hasOther);
                if (!hasSel && !(hasOther && d.accessibility_other.trim())) e.accessibility = 'Select at least one option, or specify an "Other" accommodation.';
                if (hasOther && !d.accessibility_other.trim()) e.accessibility_other = 'Please describe the other accommodation.';
                break;
            }
        }
        return e;
    };

    /* ---- navigation ------------------------------------------------- */
    const goNext = () => {
        const stepErrors = validateStep(step, d);
        if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
        setErrors({});
        setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
        scrollTop();
    };
    const goBack = () => { setErrors({}); setStep((s) => Math.max(s - 1, 0)); scrollTop(); };

    const handleSubmit = () => {
        const stepErrors = validateStep(step, d);
        if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
        for (let i = 0; i < TOTAL_STEPS; i++) {
            const e = validateStep(i, d);
            if (Object.keys(e).length > 0) { setErrors(e); setStep(i); scrollTop(); return; }
        }

        const areaToCategoryMap: Record<string, string> = {};
        AREAS_OF_SUPPORT_GROUPS.forEach(g => g.items.forEach(item => { areaToCategoryMap[item] = g.category; }));

        const mergeOther = (a: string[], sentinel: string, text: string): string[] => {
            const out = a.filter(v => v !== sentinel);
            if (a.includes(sentinel) && text && text.trim()) out.push(text.trim());
            return out;
        };

        const keptPaths = keptPhotos.map(p => p.path);

        form.transform((data) => {
            const finalAreas: string[] = [];
            data.areas_of_support.forEach((area) => {
                const category = areaToCategoryMap[area];
                if (category) finalAreas.push(`${category}|${area}`);
            });
            for (const [category, custom] of Object.entries(customSupportAreas)) {
                if (custom.checked && custom.text.trim() !== '') finalAreas.push(`${category}|${custom.text.trim()}`);
            }
            return {
                ...data,
                areas_of_support: finalAreas,
                professional_title: mergeOther(data.professional_title, 'Other (specify)', data.professional_title_other),
                languages: mergeOther(data.languages, 'Other', data.languages_other),
                license_states: mergeOther(data.license_states, '__other__', data.license_states_other),
                telehealth_regions: mergeOther(data.telehealth_regions, '__other__', data.telehealth_regions_other),
                accessibility: mergeOther(data.accessibility, '__other__', data.accessibility_other),
                practice_settings: mergeOther(data.practice_settings, '__other__', data.practice_settings_other),
                treatment_approaches: mergeOther(data.treatment_approaches, 'Other (specify)', data.treatment_approaches_other),
                specialized_training: mergeOther(data.specialized_training, 'Other Specialized Training', data.specialized_training_other),
                certifications: data.certifications.filter(c => c.trim() !== ''),
                existing_additional_photos: keptPaths,
            } as unknown as ProviderFormData;
        });

        form.post('/provider/profile/update', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setSubmitted(true),
            onError: (serverErrs: Record<string, string>) => {
                const firstField = Object.keys(serverErrs)[0];
                if (firstField && FIELD_STEP[firstField] !== undefined) { setStep(FIELD_STEP[firstField]); scrollTop(); }
            },
        });
    };

    const fieldError = (key: FieldName): string | undefined => errors[key] || (serverErrors?.[key] ?? form.errors[key]);
    const progress = Math.round(((step + 1) / TOTAL_STEPS) * 100);

    /* ---- success screen -------------------------------------------- */
    if (submitted) {
        return (
            <>
                <ProviderMenu />
                <Head title="Changes Submitted — Bahali Provider Directory" />
                <div className="min-h-screen bg-[#F7F3EC] px-4 py-16">
                    <div className="mx-auto max-w-xl rounded-2xl border border-[#E7E0D2] bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#0E7C7B]/10">
                            <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#0E7C7B]" fill="none" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" /></svg>
                        </div>
                        <h1 className="font-serif text-2xl text-[#1B2E2D]">Changes submitted for review</h1>
                        <p className="mt-3 text-[#5B6B6E]">
                            Your updated profile has been saved and is now <strong>pending review</strong>. Your public
                            listing continues to show your previously approved details until an admin approves the changes.
                        </p>
                        <div className="mt-8">
                            <a href="/provider/profile/edit" className="inline-flex items-center justify-center rounded-lg bg-[#0E7C7B] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0B6463]">
                                Back to my profile
                            </a>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    /* ---- render ----------------------------------------------------- */
    return (
        <>
            <Head title="Edit Profile — Bahali" />
            <div className="min-h-screen bg-[#F7F3EC] text-[#1F2A2E]">
                <Header />
                <div ref={topRef} className="mx-auto max-w-5xl px-5 py-8 lg:py-12">
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0E7C7B]">Provider portal</p>
                        <h1 className="mt-2 font-serif text-3xl text-[#16302F] sm:text-4xl">Edit your profile</h1>
                        <p className="mt-2 max-w-2xl text-[#5B6B6E]">
                            Update your information below. Saved changes are sent for review before they appear publicly —
                            your current approved listing stays live in the meantime.
                        </p>
                        {provider?.status && (
                            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#F1EDE3] px-3 py-1 text-xs font-medium text-[#6B7A78]">
                                Current status: <span className="capitalize text-[#16302F]">{provider.status}</span>
                            </span>
                        )}
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
                        {/* Stepper */}
                        <aside className="lg:sticky lg:top-8 lg:self-start">
                            <div className="mb-4 lg:hidden">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-medium text-[#16302F]">Step {step + 1} of {TOTAL_STEPS}</span>
                                    <span className="text-[#6B7A78]">{progress}%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2DACB]">
                                    <div className="h-full rounded-full bg-[#0E7C7B] transition-all duration-500" style={{ width: `${progress}%` }} />
                                </div>
                                <p className="mt-2 font-serif text-lg text-[#16302F]">{STEPS[step].title}</p>
                            </div>
                            <nav className="hidden lg:block" aria-label="Progress">
                                <ol className="relative">
                                    <span className="absolute left-[24px] top-2 bottom-2 w-px bg-[#E2DACB]" aria-hidden />
                                    {STEPS.map((s, i) => {
                                        const isDone = i < step; const isCurrent = i === step;
                                        return (
                                            <li key={s.key} className="relative mb-1 last:mb-0">
                                                <button type="button"
                                                    onClick={() => { setErrors({}); setStep(i); scrollTop(); }}
                                                    className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition cursor-pointer hover:bg-[#0E7C7B]/5">
                                                    <span className={`relative z-10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition ${isDone ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white' : isCurrent ? 'border-[#0E7C7B] bg-white text-[#0E7C7B]' : 'border-[#D8D0C0] bg-[#F7F3EC] text-[#A4AFAD]'}`}>
                                                        {isDone ? (<svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path d="M7.6 13.4 4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" /></svg>) : (i + 1)}
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

                        {/* Form card */}
                        <main>
                            <div className="rounded-2xl border border-[#E7E0D2] bg-white p-6 shadow-sm sm:p-8">
                                <div className="mb-6 border-b border-[#EFEAE0] pb-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0E7C7B]">Section {step + 1}</p>
                                    <h2 className="mt-1 font-serif text-2xl text-[#16302F]">{STEPS[step].title}</h2>
                                </div>
                                <div className="space-y-6">
                                    <StepBody
                                        step={step} d={d} set={set} toggle={toggle} fieldError={fieldError} countries={countries}
                                        customSupportAreas={customSupportAreas} onCustomSupportChange={updateCustomSupportArea}
                                        providerEmail={provider?.email} existingProfilePhoto={existingProfilePhoto}
                                        existingVerificationDoc={existingVerificationDoc} keptPhotos={keptPhotos}
                                        onRemoveKept={(path) => setKeptPhotos(prev => prev.filter(p => p.path !== path))}
                                    />
                                </div>
                                <div className="mt-8 flex items-center justify-between border-t border-[#EFEAE0] pt-6">
                                    <button type="button" onClick={goBack} disabled={step === 0}
                                        className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${step === 0 ? 'cursor-not-allowed text-[#B7C0BE]' : 'text-[#3A4B49] hover:bg-[#0E7C7B]/5'}`}>← Back</button>
                                    {step < TOTAL_STEPS - 1 ? (
                                        <button type="button" onClick={goNext}
                                            className="rounded-lg bg-[#0E7C7B] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c6a69] focus:outline-none focus:ring-4 focus:ring-[#0E7C7B]/30">Continue →</button>
                                    ) : (
                                        <button type="button" onClick={handleSubmit} disabled={form.processing}
                                            className="rounded-lg bg-[#0E7C7B] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c6a69] focus:outline-none focus:ring-4 focus:ring-[#0E7C7B]/30 disabled:opacity-60">
                                            {form.processing ? 'Saving…' : 'Save & submit for review'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="mt-4 text-center text-xs text-[#9AA6A4]">Fields marked <span className="text-[#C2543B]">*</span> are required.</p>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  Step body                                                          */
/* ------------------------------------------------------------------ */
function StepBody({
    step, d, set, toggle, fieldError, countries,
    customSupportAreas, onCustomSupportChange,
    providerEmail, existingProfilePhoto, existingVerificationDoc, keptPhotos, onRemoveKept,
}: {
    step: number;
    d: ProviderFormData;
    set: <K extends FieldName>(key: K, value: ProviderFormData[K]) => void;
    toggle: (key: FieldName, value: string) => void;
    fieldError: (key: FieldName) => string | undefined;
    countries: CountryData[];
    customSupportAreas: Record<string, { checked: boolean; text: string }>;
    onCustomSupportChange: (category: string, field: 'checked' | 'text', value: boolean | string) => void;
    providerEmail?: string;
    existingProfilePhoto: string | null;
    existingVerificationDoc: string | null;
    keptPhotos: { path: string; url: string }[];
    onRemoveKept: (path: string) => void;
}) {
    const selectedCountry = countries.find(c => c.name === d.country);
    const availableRegions = selectedCountry?.regions ?? [];
    const regionTypeLabel = selectedCountry?.regions[0]?.regionTypeLabel || 'State / Province';
    const [openCat, setOpenCat] = useState<string>(AREAS_OF_SUPPORT_GROUPS[0]?.category ?? '');

    switch (step) {
        case 0:
            return (
                <>
                    <FieldShell label="Provider type" required error={fieldError('provider_type')}>
                        <RadioRow value={d.provider_type} onChange={(v) => set('provider_type', v as ProviderType)} options={PROVIDER_TYPES} />
                    </FieldShell>
                    <FieldShell label="Provider or Organization Name" required error={fieldError('organization_name')}>
                        <TextInput value={d.organization_name} onChange={(v) => set('organization_name', v)} error={!!fieldError('organization_name')} placeholder="Dr. Jane Doe, PsyD or Harmony Counseling Center" />
                    </FieldShell>
                    <FieldShell label="Credentials / License" hint="Examples: PhD, PsyD, MD, LCSW, LMHC, PMHNP-BC" error={fieldError('credentials')}>
                        <TextInput value={d.credentials} onChange={(v) => set('credentials', v)} placeholder="PsyD, LCSW…" />
                    </FieldShell>
                    <FieldShell label="Professional title(s)" required hint="Select all that apply." error={fieldError('professional_title')}>
                        <CheckGrid options={PROFESSIONAL_TITLES} selected={d.professional_title} onToggle={(v) => toggle('professional_title', v)} columns={2} />
                    </FieldShell>
                    {d.professional_title.includes('Other (specify)') && (
                        <FieldShell label="Please specify your title" required error={fieldError('professional_title_other')}>
                            <TextInput value={d.professional_title_other} onChange={(v) => set('professional_title_other', v)} error={!!fieldError('professional_title_other')} placeholder="Your professional title" />
                        </FieldShell>
                    )}
                </>
            );
        case 1:
            return (
                <>
                    {providerEmail && (
                        <FieldShell label="Email address" hint="Your sign-in email can't be changed here.">
                            <TextInput value={providerEmail} onChange={() => { }} disabled />
                        </FieldShell>
                    )}
                    <FieldShell label="Short bio" required hint="Tell community members about yourself and your approach. (Max 500 words)" error={fieldError('short_bio')}>
                        <TextArea value={d.short_bio} onChange={(v) => set('short_bio', v)} error={!!fieldError('short_bio')} rows={7} placeholder="Share your story, your values, and how you support healing…" />
                        <p className="mt-1.5 text-right text-xs text-[#9AA6A4]">{wordCount(d.short_bio)} / 500 words</p>
                    </FieldShell>
                    <FieldShell label="Years of experience" error={fieldError('years_experience')}>
                        <SearchableSelect value={d.years_experience} onChange={(v) => set('years_experience', v)} options={YEARS_EXPERIENCE} placeholder="Select…" searchPlaceholder="Search experience…" />
                    </FieldShell>
                </>
            );
        case 2:
            return (
                <>
                    <FieldShell label="License number" required hint='Enter your license number, or select "Not applicable" below.' error={fieldError('license_number')}>
                        <TextInput value={d.license_number} onChange={(v) => set('license_number', v)} error={!!fieldError('license_number')} disabled={d.license_not_applicable} placeholder="Your professional license number" />
                    </FieldShell>
                    <ConsentItem checked={d.license_not_applicable} onChange={(v) => { set('license_not_applicable', v); if (v) set('license_number', ''); }}>Not applicable</ConsentItem>
                    <FieldShell label="State / Country of licensure" required hint="Select all that apply." error={fieldError('license_states')}>
                        <CheckGrid options={REGIONS} selected={d.license_states} onToggle={(v) => toggle('license_states', v)} columns={2} />
                        <OtherCheckboxField checked={d.license_states.includes('__other__')} text={d.license_states_other}
                            onToggle={() => { const o = '__other__'; set('license_states', d.license_states.includes(o) ? d.license_states.filter(v => v !== o) : [...d.license_states, o]); }}
                            onTextChange={(v) => set('license_states_other', v)} placeholder="Specify the state or country…" error={!!fieldError('license_states_other')} />
                    </FieldShell>
                    <FieldShell label="License status" required error={fieldError('license_status')}>
                        <RadioRow value={d.license_status} onChange={(v) => set('license_status', v as LicenseStatus)} options={LICENSE_STATUSES} />
                    </FieldShell>
                    <FieldShell label="Verification document" hint="Optional — a license certificate or proof of credentials (PDF, JPG, PNG)." error={fieldError('verification_document')}>
                        {!d.verification_document && existingVerificationDoc && (
                            <a href={existingVerificationDoc} target="_blank" rel="noreferrer" className="mb-2 inline-flex items-center gap-1 text-sm text-[#0E7C7B] hover:underline">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" /></svg>
                                View current document
                            </a>
                        )}
                        <FileInput file={d.verification_document} accept=".pdf,.jpg,.jpeg,.png" onChange={(f) => set('verification_document', (f && f instanceof File) ? f : null)} />
                    </FieldShell>
                </>
            );
        case 3:
            return (
                <FieldShell label="Areas of support" required hint="Expand each category and select every area where you have expertise. You may also add custom areas via 'Other'." error={fieldError('areas_of_support')}>
                    <div className="space-y-2.5">
                        {AREAS_OF_SUPPORT_GROUPS.map((group) => {
                            const category = group.category;
                            const custom = customSupportAreas[category] || { checked: false, text: '' };
                            const count = group.items.filter((i) => d.areas_of_support.includes(i)).length;
                            const customSelected = custom.checked && custom.text.trim() !== '';
                            const totalSelected = count + (customSelected ? 1 : 0);
                            const isOpen = openCat === category;
                            return (
                                <div key={category} className={`overflow-hidden rounded-xl border transition ${totalSelected > 0 ? 'border-[#0E7C7B]/50' : 'border-[#DED7C9]'}`}>
                                    <button type="button" aria-expanded={isOpen} onClick={() => setOpenCat((prev) => (prev === category ? '' : category))}
                                        className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition ${isOpen ? 'bg-[#0E7C7B]/5' : 'bg-[#FBF8F2] hover:bg-[#0E7C7B]/5'}`}>
                                        <span className="flex items-center gap-2.5">
                                            <span className="text-sm font-semibold text-[#16302F]">{category}</span>
                                            {totalSelected > 0 && (<span className="inline-flex items-center rounded-full bg-[#0E7C7B] px-2 py-0.5 text-xs font-semibold text-white">{totalSelected} selected</span>)}
                                        </span>
                                        <svg viewBox="0 0 24 24" className={`h-4 w-4 flex-shrink-0 text-[#0E7C7B] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" /></svg>
                                    </button>
                                    {isOpen && (
                                        <div className="border-t border-[#EFEAE0] bg-white p-3.5">
                                            <CheckGrid options={group.items} selected={d.areas_of_support} onToggle={(v) => toggle('areas_of_support', v)} columns={2} />
                                            <OtherCheckboxField checked={custom.checked} text={custom.text}
                                                onToggle={() => onCustomSupportChange(category, 'checked', !custom.checked)}
                                                onTextChange={(v) => onCustomSupportChange(category, 'text', v)}
                                                placeholder="Describe the other area of support…" error={!!fieldError('areas_of_support')} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {d.areas_of_support.length > 0 && (
                        <p className="mt-3 text-sm font-medium text-[#0E7C7B]">{d.areas_of_support.length} area{d.areas_of_support.length === 1 ? '' : 's'} selected</p>
                    )}
                </FieldShell>
            );
        case 4:
            return (
                <FieldShell label="Populations served" required hint="Select all that apply." error={fieldError('populations_served')}>
                    <CheckGrid options={POPULATIONS_SERVED} selected={d.populations_served} onToggle={(v) => toggle('populations_served', v)} columns={2} />
                </FieldShell>
            );
        case 5:
            return (
                <>
                    <FieldShell label="Treatment Approaches" hint="Select all that apply. (Optional)" error={fieldError('treatment_approaches')}>
                        <CheckGrid options={TREATMENT_APPROACHES} selected={d.treatment_approaches} onToggle={(v) => toggle('treatment_approaches', v)} columns={2} />
                        {d.treatment_approaches.includes('Other (specify)') && (
                            <div className="mt-3"><TextInput value={d.treatment_approaches_other} onChange={(v) => set('treatment_approaches_other', v)} placeholder="Describe your other approach…" error={!!fieldError('treatment_approaches_other')} /></div>
                        )}
                    </FieldShell>
                    <FieldShell label="Specialized Training" hint="Select all that apply. (Optional)" error={fieldError('specialized_training')}>
                        <CheckGrid options={SPECIALIZED_TRAINING_OPTIONS} selected={d.specialized_training} onToggle={(v) => toggle('specialized_training', v)} columns={2} />
                        {d.specialized_training.includes('Other Specialized Training') && (
                            <div className="mt-3"><TextInput value={d.specialized_training_other} onChange={(v) => set('specialized_training_other', v)} placeholder="Describe your other training…" error={!!fieldError('specialized_training_other')} /></div>
                        )}
                    </FieldShell>
                    <FieldShell label="Certifications & Credentials (Optional)" hint="List any relevant certifications you would like displayed." error={fieldError('certifications')}>
                        <CertificationsInput values={d.certifications} onChange={(list) => set('certifications', list)} />
                    </FieldShell>
                </>
            );
        case 6:
            return (
                <>
                    <FieldShell label="Do you identify as part of the Caribbean community?" required error={fieldError('caribbean_identity')}>
                        <RadioRow value={d.caribbean_identity} onChange={(v) => set('caribbean_identity', v as CaribbeanIdentity)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'prefer_not', label: 'Prefer not to say' }]} />
                    </FieldShell>
                    <FieldShell label="Do you have experience working with Caribbean individuals and families?" required error={fieldError('caribbean_experience')}>
                        <RadioRow value={d.caribbean_experience} onChange={(v) => set('caribbean_experience', v as YesNo)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
                    </FieldShell>
                    <FieldShell label="Languages spoken" required hint="Select all that apply." error={fieldError('languages')}>
                        <CheckGrid options={LANGUAGES} selected={d.languages} onToggle={(v) => toggle('languages', v)} columns={2} />
                    </FieldShell>
                    {d.languages.includes('Other') && (
                        <FieldShell label="Please specify other language(s)" required error={fieldError('languages_other')}>
                            <TextInput value={d.languages_other} onChange={(v) => set('languages_other', v)} error={!!fieldError('languages_other')} placeholder="e.g. Papiamento, Portuguese" />
                        </FieldShell>
                    )}
                    <FieldShell label="How do you incorporate culture into your work?" hint="Optional. (Max 250 words)" error={fieldError('cultural_approach')}>
                        <TextArea value={d.cultural_approach} onChange={(v) => set('cultural_approach', v)} error={!!fieldError('cultural_approach')} rows={5} placeholder="Describe how culture, story, and lived experience shape your care…" />
                        <p className="mt-1.5 text-right text-xs text-[#9AA6A4]">{wordCount(d.cultural_approach)} / 250 words</p>
                    </FieldShell>
                </>
            );
        case 7:
            return (
                <>
                    <FieldShell label="Service formats" required hint="Select all that apply." error={fieldError('service_formats')}>
                        <CheckGrid options={SERVICE_FORMATS} selected={d.service_formats} onToggle={(v) => toggle('service_formats', v)} columns={2} />
                    </FieldShell>
                    <FieldShell label="Practice setting" required hint="Select all that apply." error={fieldError('practice_settings')}>
                        <CheckGrid options={PRACTICE_SETTINGS} selected={d.practice_settings} onToggle={(v) => toggle('practice_settings', v)} columns={2} />
                        <OtherCheckboxField checked={d.practice_settings.includes('__other__')} text={d.practice_settings_other || ''}
                            onToggle={() => { const o = '__other__'; set('practice_settings', d.practice_settings.includes(o) ? d.practice_settings.filter(v => v !== o) : [...d.practice_settings, o]); }}
                            onTextChange={(v) => set('practice_settings_other', v)} placeholder="Specify other practice setting…" error={!!fieldError('practice_settings_other')} />
                    </FieldShell>
                </>
            );
        case 8:
            return (
                <>
                    <FieldShell label="Address" required error={fieldError('address')}>
                        <TextInput value={d.address} onChange={(v) => set('address', v)} error={!!fieldError('address')} placeholder="Street address" />
                    </FieldShell>
                    <ConsentItem checked={d.hide_address} onChange={(v) => set('hide_address', v)}>Hide the address from public view</ConsentItem>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <FieldShell label="City" required error={fieldError('city')}>
                            <TextInput value={d.city} onChange={(v) => set('city', v)} error={!!fieldError('city')} placeholder="City" />
                        </FieldShell>
                        <FieldShell label="Country" required error={fieldError('country')}>
                            <SearchableSelect value={d.country} onChange={(v) => { set('country', v); set('state_province', ''); }} options={countries.map(c => ({ value: c.name, label: c.name }))} error={!!fieldError('country')} placeholder="Select country…" searchPlaceholder="Search countries…" />
                        </FieldShell>
                    </div>
                    <FieldShell label={regionTypeLabel} required error={fieldError('state_province')} hint={!d.country ? 'Please select a country first' : undefined}>
                        {d.country && availableRegions.length > 0 ? (
                            <SearchableSelect value={d.state_province} onChange={(v) => set('state_province', v)} options={availableRegions.map(r => ({ value: r.name, label: r.name }))} error={!!fieldError('state_province')} placeholder={`Select ${regionTypeLabel.toLowerCase()}…`} searchPlaceholder={`Search ${regionTypeLabel.toLowerCase()}…`} />
                        ) : d.country && availableRegions.length === 0 ? (
                            <div className="rounded-lg border border-[#DED7C9] bg-[#FBF8F2] px-3.5 py-2.5 text-sm text-[#9AA6A4]">No regions available for this country</div>
                        ) : (
                            <div className="rounded-lg border border-[#DED7C9] bg-[#FBF8F2] px-3.5 py-2.5 text-sm text-[#9AA6A4]">Select a country to see available regions</div>
                        )}
                    </FieldShell>
                    <FieldShell label="Do you provide services across multiple locations?" required error={fieldError('multiple_locations')}>
                        <RadioRow value={d.multiple_locations} onChange={(v) => set('multiple_locations', v as YesNo)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
                    </FieldShell>
                    <FieldShell label="Telehealth regions served" hint="Optional. Select every region where you can offer telehealth." error={fieldError('telehealth_regions')}>
                        <CheckGrid options={REGIONS} selected={d.telehealth_regions} onToggle={(v) => toggle('telehealth_regions', v)} columns={2} />
                        <OtherCheckboxField checked={d.telehealth_regions.includes('__other__')} text={d.telehealth_regions_other}
                            onToggle={() => { const o = '__other__'; set('telehealth_regions', d.telehealth_regions.includes(o) ? d.telehealth_regions.filter(v => v !== o) : [...d.telehealth_regions, o]); }}
                            onTextChange={(v) => set('telehealth_regions_other', v)} placeholder="Specify the other telehealth region(s)…" error={!!fieldError('telehealth_regions_other')} />
                    </FieldShell>
                </>
            );
        case 9:
            return (
                <>
                    <FieldShell label="Accepted payment methods" required hint="Select all that apply." error={fieldError('payment_methods')}>
                        <CheckGrid options={PAYMENT_METHODS} selected={d.payment_methods} onToggle={(v) => toggle('payment_methods', v)} columns={2} />
                    </FieldShell>
                    <FieldShell label="Insurance plans accepted" hint="Optional." error={fieldError('insurance_plans')}>
                        <TextArea value={d.insurance_plans} onChange={(v) => set('insurance_plans', v)} rows={3} placeholder="e.g. Aetna, Blue Cross Blue Shield, Cigna…" />
                    </FieldShell>
                </>
            );
        case 10:
            return (
                <>
                    <FieldShell label="Phone number" required error={fieldError('phone')}>
                        <PhoneInput value={d.phone} onChange={(v) => set('phone', v)} error={!!fieldError('phone')} placeholder="+1 (555) 000-0000" />
                    </FieldShell>
                    <FieldShell label="Website" hint="Optional." error={fieldError('website')}>
                        <TextInput value={d.website} onChange={(v) => set('website', v)} error={!!fieldError('website')} placeholder="yourpractice.com" />
                    </FieldShell>
                    <FieldShell label="Social media links" hint="Optional. Add up to 5 links." error={fieldError('social_links')}>
                        <SocialLinksInput value={d.social_links} onChange={(v) => set('social_links', v)} />
                    </FieldShell>
                </>
            );
        case 11:
            return (
                <>
                    <FieldShell label="Professional photo or organization logo" required hint="A clear headshot or your logo. JPG or PNG." error={fieldError('profile_photo')}>
                        {!d.profile_photo && existingProfilePhoto && (
                            <div className="mb-3 flex items-center gap-3">
                                <img src={existingProfilePhoto} alt="Current" className="h-16 w-16 rounded-lg border border-[#E7E0D2] object-cover" />
                                <span className="text-sm text-[#5B6B6E]">Current photo — choose a file to replace it.</span>
                            </div>
                        )}
                        <FileInput file={d.profile_photo} accept=".jpg,.jpeg,.png" preview allowedTypes={['jpg', 'jpeg', 'png']} onChange={(f) => set('profile_photo', (f && f instanceof File) ? f : null)} />
                    </FieldShell>
                    <FieldShell label="Additional photos" hint="Optional. Images of your space, team, or community work." error={fieldError('additional_photos')}>
                        {keptPhotos.length > 0 && (
                            <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                                {keptPhotos.map((p) => (
                                    <li key={p.path} className="relative">
                                        <img src={p.url} alt="" className="h-24 w-full rounded-lg border border-[#E7E0D2] object-cover" />
                                        <button type="button" onClick={() => onRemoveKept(p.path)} aria-label="Remove photo"
                                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#C2543B] shadow ring-1 ring-black/5 hover:bg-white">
                                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M6 6l12 12M18 6 6 18" /></svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <MultiFileInput files={d.additional_photos} accept=".jpg,.jpeg,.png,.webp" allowedTypes={['jpg', 'jpeg', 'png', 'webp']} onChange={(files) => set('additional_photos', files)} />
                    </FieldShell>
                </>
            );
        case 12:
            return (
                <FieldShell label="Accessibility" required hint='Select all that apply. If you need an option not listed, check "Other".' error={fieldError('accessibility')}>
                    <CheckGrid options={ACCESSIBILITY_OPTIONS} selected={d.accessibility} onToggle={(v) => toggle('accessibility', v)} columns={2} />
                    <OtherCheckboxField checked={d.accessibility.includes('__other__')} text={d.accessibility_other}
                        onToggle={() => { const o = '__other__'; set('accessibility', d.accessibility.includes(o) ? d.accessibility.filter(v => v !== o) : [...d.accessibility, o]); }}
                        onTextChange={(v) => set('accessibility_other', v)} placeholder="Describe the accessibility feature or accommodation…" error={!!fieldError('accessibility_other')} />
                </FieldShell>
            );
        default:
            return null;
    }
}

/* ------------------------------------------------------------------ */
/*  File inputs & consent row                                          */
/* ------------------------------------------------------------------ */
function FileInput({ file, onChange, accept, preview = false, allowedTypes = [] }: { file: File | null; onChange: (f: File | null) => void; accept?: string; preview?: boolean; allowedTypes?: string[]; }) {
    const [fileError, setFileError] = useState('');
    const previewUrl = useMemo(() => (preview && file ? URL.createObjectURL(file) : null), [preview, file]);
    useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
    const validateFile = (f: File): string | null => {
        if (allowedTypes.length === 0) return null;
        const ext = f.name.split('.').pop()?.toLowerCase();
        const ok = allowedTypes.some(t => ext === t.toLowerCase() || f.type.toLowerCase().includes(t.toLowerCase()));
        return ok ? null : `Only ${allowedTypes.join(', ').toUpperCase()} files are allowed.`;
    };
    return (
        <div>
            <div className="flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#C7BEAD] bg-[#FBF8F2] px-4 py-3 text-sm font-medium text-[#3A4B49] transition hover:border-[#0E7C7B] hover:bg-[#0E7C7B]/5">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#0E7C7B]" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></svg>
                    {file ? 'Replace file' : 'Choose file'}
                    <input type="file" accept={accept} className="hidden" onChange={(e) => {
                        const selected = e.target.files?.[0] ?? null; e.target.value = '';
                        if (selected) { const err = validateFile(selected); if (err) { setFileError(err); return; } }
                        setFileError(''); onChange(selected);
                    }} />
                </label>
                {previewUrl && (<img src={previewUrl} alt="Preview" className="h-14 w-14 rounded-lg border border-[#E7E0D2] object-cover" />)}
                {file && (
                    <div className="flex items-center gap-2 text-sm text-[#5B6B6E]">
                        <span className="max-w-[180px] truncate">{file.name}</span>
                        <button type="button" onClick={() => onChange(null)} className="text-[#C2543B] hover:underline">Remove</button>
                    </div>
                )}
            </div>
            {fileError && (<p className="mt-1.5 flex items-center gap-1 text-sm text-[#C2543B]"><span aria-hidden>⚠</span>{fileError}</p>)}
        </div>
    );
}

function MultiFileInput({ files, onChange, accept, allowedTypes = [] }: { files: File[]; onChange: (files: File[]) => void; accept?: string; allowedTypes?: string[]; }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
    const validateFile = (file: File): string | null => {
        if (allowedTypes.length === 0) return null;
        const ext = file.name.split('.').pop()?.toLowerCase();
        const ok = allowedTypes.some(t => ext === t.toLowerCase() || file.type.toLowerCase().includes(t.toLowerCase()));
        return ok ? null : `${file.name}: Only ${allowedTypes.join(', ').toUpperCase()} allowed`;
    };
    return (
        <div className="space-y-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#C7BEAD] bg-[#FBF8F2] px-4 py-3 text-sm font-medium text-[#3A4B49] transition hover:border-[#0E7C7B] hover:bg-[#0E7C7B]/5">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#0E7C7B]" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add photos
                <input ref={inputRef} type="file" accept={accept} multiple className="hidden" onChange={(e) => {
                    const newFiles = e.target.files ? Array.from(e.target.files) : [];
                    const errors: Record<string, string> = {}; const valid: File[] = [];
                    newFiles.forEach((file) => { const err = validateFile(file); if (err) errors[file.name] = err; else valid.push(file); });
                    setFileErrors(errors);
                    if (valid.length > 0) onChange([...files, ...valid]);
                    e.target.value = '';
                }} />
            </label>
            {Object.keys(fileErrors).length > 0 && (
                <div className="rounded-lg border border-[#C2543B]/30 bg-[#C2543B]/5 p-3">
                    {Object.values(fileErrors).map((err, idx) => (<p key={idx} className="mb-1 flex items-center gap-1 text-sm text-[#C2543B]"><span aria-hidden>⚠</span>{err}</p>))}
                </div>
            )}
            {files.length > 0 && (
                <ul className="space-y-1.5">
                    {files.map((f, i) => (
                        <li key={`${f.name}-${i}-${f.lastModified}`} className="flex items-center justify-between rounded-lg border border-[#EFEAE0] bg-[#FBF8F2] px-3 py-2 text-sm text-[#5B6B6E]">
                            <span className="max-w-[240px] truncate">{f.name}</span>
                            <button type="button" onClick={() => onChange(files.filter((_, idx) => idx !== i))} className="text-[#C2543B] hover:underline">Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function SocialLinksInput({ value, onChange }: { value: string; onChange: (v: string) => void; }) {
    const MAX = 5;
    const makeRows = () => {
        const parts = value ? value.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean) : [];
        const init = parts.length ? parts : [''];
        return init.map((v, i) => ({ id: i + 1, value: v }));
    };
    const [rows, setRows] = useState<{ id: number; value: string }[]>(makeRows);
    const nextId = useRef(rows.length + 1);
    const sync = (next: { id: number; value: string }[]) => { setRows(next); onChange(next.map((r) => r.value.trim()).filter(Boolean).join(', ')); };
    const updateAt = (id: number, v: string) => sync(rows.map((r) => (r.id === id ? { ...r, value: v } : r)));
    const addField = () => { if (rows.length >= MAX) return; sync([...rows, { id: nextId.current++, value: '' }]); };
    const removeAt = (id: number) => sync(rows.filter((r) => r.id !== id));
    return (
        <div className="space-y-2.5">
            {rows.map((row, i) => {
                const isFirst = i === 0; const isLast = i === rows.length - 1;
                return (
                    <div key={row.id} className="flex items-center gap-2">
                        <input type="text" placeholder="Enter Platform Name" className="w-full rounded-lg border border-[#DED7C9] bg-white px-3.5 py-2.5 text-[#1F2A2E] placeholder-[#9AA6A4] outline-none transition focus:border-[#0E7C7B] focus:ring-4 focus:ring-[#0E7C7B]/25" />
                        <input type="url" value={row.value} onChange={(e) => updateAt(row.id, e.target.value)} placeholder="https://www.example.com" className="w-full rounded-lg border border-[#DED7C9] bg-white px-3.5 py-2.5 text-[#1F2A2E] placeholder-[#9AA6A4] outline-none transition focus:border-[#0E7C7B] focus:ring-4 focus:ring-[#0E7C7B]/25" />
                        {isLast && rows.length < MAX && (
                            <button type="button" onClick={addField} aria-label="Add another link" className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-[#0E7C7B]/40 bg-[#0E7C7B]/5 text-[#0E7C7B] transition hover:bg-[#0E7C7B]/10">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg>
                            </button>
                        )}
                        {!isFirst && (
                            <button type="button" onClick={() => removeAt(row.id)} aria-label="Remove this link" className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-[#DED7C9] text-[#C2543B] transition hover:border-[#C2543B] hover:bg-[#C2543B]/5">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function PhoneInput({ value, onChange, error, placeholder }: { value: string; onChange: (v: string) => void; error?: boolean; placeholder?: string; }) {
    return (
        <input type="tel" value={value} placeholder={placeholder}
            onChange={(ev) => onChange(ev.target.value.replace(/[^0-9\s\-\+\(\)]/g, ''))}
            className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[#1F2A2E] placeholder-[#9AA6A4] outline-none transition focus:ring-4 ${errClass(!!error)}`} />
    );
}

function ConsentItem({ checked, onChange, error, children }: { checked: boolean; onChange: (v: boolean) => void; error?: string; children: React.ReactNode; }) {
    return (
        <div>
            <button type="button" onClick={() => onChange(!checked)}
                className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition ${checked ? 'border-[#0E7C7B] bg-[#0E7C7B]/8' : error ? 'border-[#C2543B] bg-[#C2543B]/5' : 'border-[#DED7C9] bg-white hover:border-[#0E7C7B]/50'}`}>
                <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition ${checked ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white' : 'border-[#C7BEAD] bg-white'}`} aria-hidden>
                    {checked && (<svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path d="M7.6 13.4 4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" /></svg>)}
                </span>
                <span className="text-sm leading-snug text-[#26403F]">{children}</span>
            </button>
            {error && (<p className="mt-1 ml-1 text-sm text-[#C2543B]">{error}</p>)}
        </div>
    );
}
