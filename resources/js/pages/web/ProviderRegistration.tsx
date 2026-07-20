
import { useMemo, useRef, useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Bahali Provider Directory — Registration
 * ------------------------------------------------------------------
 * A 14-step, validated provider intake form for https://bahali.org/
 *
 * Stack: Laravel 12 + Inertia.js + React + TypeScript + Tailwind CSS.
 *
 * Behaviour:
 *  - Each section is its own step.
 *  - Client-side validation runs when the user clicks "Continue".
 *  - The form will NOT advance to the next step until the current
 *    step passes validation.
 *  - After the "About You" step, an account is created server-side
 *    and a 6-digit OTP is emailed to the provider. The form will not
 *    advance past the "Verify Email" step until the OTP is confirmed.
 *  - Final submit posts multipart/form-data (files included) to the
 *    backend route, which should validate again server-side.
 *
 * Backend routes expected:
 *   POST /provider/directory/register-account (name: providers.register-account)
 *   POST /provider/directory/verify-otp        (name: providers.verify-otp)
 *   POST /provider/directory/resend-otp        (name: providers.resend-otp)
 *   POST /provider/directory/store              (name: providers.store)
 * ------------------------------------------------------------------
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
const SIGNUP_ROUTE = '/provider/directory/create';

type ProviderType =
    | 'individual'
    | 'organization'
    | 'support_group'
    | 'faith_based'
    | 'community_program';

type LicenseStatus = 'active' | 'provisional' | 'not_applicable';
type YesNo = 'yes' | 'no';
type CaribbeanIdentity = 'yes' | 'no' | 'prefer_not';

interface ProviderFormData {
    // Step 1 — Provider Information
    provider_type: ProviderType | '';
    organization_name: string;
    credentials: string;
    professional_title: string[];
    professional_title_other: string;
    // Step 2 — About You & Account
    email: string;
    password: string;
    short_bio: string;
    years_experience: string;
    // Step 3 — Licensure & Verification
    license_number: string;
    license_not_applicable: boolean;
    license_states: string[];
    license_status: LicenseStatus | '';
    verification_document: File | null;
    // Step 4 — Areas of Support
    areas_of_support: string[];
    areas_of_support_other: string;
    // Step 5 — Populations Served
    populations_served: string[];
    // Step 6 — Cultural & Language Responsiveness
    caribbean_identity: CaribbeanIdentity | '';
    caribbean_experience: YesNo | '';
    languages: string[];
    languages_other: string;
    cultural_approach: string;
    // Step 7 — Service Information
    service_formats: string[];
    practice_settings: string[];
    // Step 8 — Location
    address: string;
    city: string;
    state_province: string;
    country: string;
    multiple_locations: YesNo | '';
    hide_address: boolean;
    telehealth_regions: string[];
    telehealth_regions_other: string;
    // Step 9 — Insurance & Payment
    payment_methods: string[];
    insurance_plans: string;
    // Step 10 — Contact Information
    phone: string;
    website: string;
    social_links: string;
    // Step 11 — Profile Media
    profile_photo: File | null;
    additional_photos: File[];
    // Step 12 — Accessibility
    accessibility: string[];
    // Step 13 — Consent & Agreement
    consent_accurate: boolean;
    consent_notify: boolean;
    consent_no_endorsement: boolean;
    consent_public: boolean;
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
    'Clinical Psychologist',
    'Neuropsychologist',
    'School Psychologist',
    'Psychiatrist',
    'Psychiatric Mental Health Nurse Practitioner',
    'Clinical Social Worker',
    'Mental Health Counselor',
    'Marriage and Family Therapist',
    'Board Certified Behavior Analyst (BCBA)',
    'Substance Use Counselor',
    'Addiction Medicine Specialist',
    'Developmental-Behavioral Pediatrician',
    'Parent Coach',
    'Peer Support Specialist',
    'Community Health Worker',
    'Pastoral Counselor',
    'Other (specify)',
];

const YEARS_EXPERIENCE = [
    'Less than 2 years',
    '2–5 years',
    '6–10 years',
    '11–15 years',
    '16–20 years',
    '20+ years',
];

const LICENSE_STATUSES: { value: LicenseStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'provisional', label: 'Provisional' },
    { value: 'not_applicable', label: 'Not Applicable' },
];

/**
 * Areas of Support — grouped taxonomy.
 * To add a new support area later, just append it to the relevant
 * category's `items` array (or add a whole new category object).
 * Nothing else in the form needs to change.
 */
const AREAS_OF_SUPPORT_GROUPS: { category: string; items: string[] }[] = [
    {
        category: 'Mental & Emotional Well-Being',
        items: [
            'Anxiety & Worry',
            'Depression & Low Mood',
            'Stress & Burnout',
            'Trauma & Recovery',
            'Grief & Loss',
            'Anger & Irritability',
            'Building Self-Confidence',
            'Managing Emotions',
            'Life Changes & Transitions',
            'Panic Attacks',
            'Obsessive Thoughts & Compulsive Behaviors (OCD)',
            'Mood Changes',
        ],
    },
    {
        category: 'Relationships & Family',
        items: [
            'Couples & Relationship Counseling',
            'Marriage Counseling',
            'Premarital Counseling',
            'Parenting Support',
            'Co-Parenting',
            'Family Conflict',
            'Divorce & Separation',
            'Blended Families',
            'Communication Challenges',
            'Caregiver Support',
            'Healing from Relationship Abuse',
        ],
    },
    {
        category: 'Children, Teens & Families',
        items: [
            'Child Behavioral Challenges',
            'Teen Emotional Wellness',
            'ADHD',
            'Autism & Neurodiversity',
            'School Challenges',
            'Bullying',
            'Social Skills',
            'Parent-Child Relationships',
            'Childhood Trauma',
            'Big Feelings & Emotional Regulation',
        ],
    },
    {
        category: "Women's Health & Wellness",
        items: [
            'Pregnancy Support',
            'Pregnancy & Infant Loss',
            'Postpartum Depression',
            'Postpartum Anxiety',
            'Infertility',
            'Menopause & Midlife',
        ],
    },
    {
        category: "Men's Health & Wellness",
        items: [
            "Men's Emotional Wellness",
            'Fatherhood',
            'Relationship Challenges',
            'Managing Anger',
            'Identity & Purpose',
        ],
    },
    {
        category: 'Older Adults & Aging',
        items: [
            'Healthy Aging & Older Adult Well-Being',
            'Memory Concerns',
            'Dementia Support',
            "Alzheimer's Disease Support",
            'Retirement & Life Changes',
            'Coping with Chronic Illness',
            'Grief & Loss in Later Life',
        ],
    },
    {
        category: 'Crisis, Trauma & Recovery',
        items: [
            'Crisis Support',
            'Disaster Recovery',
            'Psychological First Aid',
            'Community Violence',
            'Suicide Prevention',
            'Self-Harm Recovery',
            'Support for First Responders',
            'Support for Helping Professionals',
        ],
    },
    {
        category: 'Health & Everyday Wellness',
        items: [
            'Living with Chronic Illness',
            'Living with Chronic Pain',
            'Sleep & Insomnia',
            'Health-Related Anxiety',
            'Stress Management',
            'Lifestyle Changes',
            'Emotional Eating & Weight Concerns',
        ],
    },
    {
        category: 'Substance Use & Recovery',
        items: [
            'Alcohol Use',
            'Substance Use',
            'Recovery Support',
            'Relapse Prevention',
        ],
    },
    {
        category: 'Work, School & Daily Life',
        items: [
            'Workplace Stress',
            'Compassion Fatigue',
            'Vicarious Trauma',
            'Leadership & Executive Wellness',
            'Career Changes',
            'Academic Stress',
            'College & University Adjustment',
        ],
    },
    {
        category: 'Culture, Faith & Community',
        items: [
            'Caribbean & Diaspora Wellness',
            'Faith & Spiritual Support',
            'Church & Ministry Support',
            'Immigration & Adjusting to a New Culture',
            'Cultural Identity & Belonging',
            'Experiences of Racism & Discrimination',
            'LGBTQIA+ Support',
        ],
    },
];

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
    'Community Leaders',
];

const LANGUAGES = [
    'English',
    'Spanish',
    'Haitian Creole',
    'French',
    'Jamaican Patois',
    'Trinidadian Creole',
    'Dutch',
    'Other',
];

const SERVICE_FORMATS = [
    'In-Person',
    'Virtual',
    'Hybrid',
    'Home-Based / Mobile',
    'Group-Based',
    'School-Based',
];

const PRACTICE_SETTINGS = [
    'Private Practice',
    'Community Agency',
    'Hospital / Health System',
    'School',
    'University',
    'Faith-Based Setting',
    'Nonprofit Organization',
    'Government Agency',
    'Independent Contractor',
    'Other',
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

const ACCESSIBILITY_OPTIONS = [
    'Wheelchair Accessible',
    'ADA Accessible',
    'Interpreter Available',
    'Closed Captioning Available',
    'Sensory-Friendly Environment',
    'Home Visits Available',
    'Public Transportation Accessible',
    'Other',
];

const REGIONS = [
    'Anguilla',
    'Antigua and Barbuda',
    'Aruba',
    'Bahamas',
    'Barbados',
    'Belize',
    'Bermuda',
    'British Virgin Islands',
    'Cayman Islands',
    'Cuba',
    'Curaçao',
    'Dominica',
    'Dominican Republic',
    'Grenada',
    'Guadeloupe',
    'Guyana',
    'Haiti',
    'Jamaica',
    'Martinique',
    'Montserrat',
    'Puerto Rico',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Suriname',
    'Trinidad and Tobago',
    'Turks and Caicos Islands',
    'United States',
    'United Kingdom',
    'Canada',
    'Other',
];

const COUNTRIES = [
    'United States',
    'Canada',
    'United Kingdom',
    'Anguilla',
    'Antigua and Barbuda',
    'Aruba',
    'Bahamas',
    'Barbados',
    'Belize',
    'Bermuda',
    'British Virgin Islands',
    'Cayman Islands',
    'Cuba',
    'Curaçao',
    'Dominica',
    'Dominican Republic',
    'Grenada',
    'Guadeloupe',
    'Guyana',
    'Haiti',
    'Jamaica',
    'Martinique',
    'Montserrat',
    'Puerto Rico',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Suriname',
    'Trinidad and Tobago',
    'Turks and Caicos Islands',
    'Other',
];

const US_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
    'Not Applicable / Outside the U.S.',
];

/* ------------------------------------------------------------------ */
/*  Step metadata                                                      */
/* ------------------------------------------------------------------ */
const STEPS = [
    { key: 'basic', title: 'Provider Information', subtitle: 'Who you are' },
    { key: 'about', title: 'About You', subtitle: 'Your approach' },
    { key: 'verify', title: 'Verify Email', subtitle: 'Confirm it\'s you' },
    { key: 'license', title: 'Licensure & Verification', subtitle: 'Credentials' },
    { key: 'areas', title: 'Areas of Support', subtitle: 'What you help with' },
    { key: 'populations', title: 'Populations Served', subtitle: 'Who you serve' },
    { key: 'culture', title: 'Cultural & Language', subtitle: 'Responsiveness' },
    { key: 'service', title: 'Service Information', subtitle: 'How you work' },
    { key: 'location', title: 'Location', subtitle: 'Where you are' },
    { key: 'payment', title: 'Insurance & Payment', subtitle: 'Accepted methods' },
    { key: 'contact', title: 'Contact Information', subtitle: 'Reach you' },
    { key: 'media', title: 'Profile Media', subtitle: 'Photos & logo' },
    { key: 'accessibility', title: 'Accessibility', subtitle: 'Accommodations' },
    { key: 'consent', title: 'Consent & Agreement', subtitle: 'Finish up' },
] as const;

const TOTAL_STEPS = STEPS.length;

// Maps a field to the step index it belongs to — used to jump to the
// first step containing a server-side validation error after submit.
const FIELD_STEP: Record<string, number> = {
    provider_type: 0, organization_name: 0, credentials: 0,
    professional_title: 0, professional_title_other: 0,
    short_bio: 1, years_experience: 1,
    email: 1, password: 1,
    license_number: 3, license_not_applicable: 3,
    license_states: 3, license_status: 3, verification_document: 3,
    areas_of_support: 4, areas_of_support_other: 4,
    populations_served: 5,
    caribbean_identity: 6, caribbean_experience: 6, languages: 6,
    languages_other: 6, cultural_approach: 6,
    service_formats: 7, practice_settings: 7,
    address: 8, city: 8, state_province: 8, country: 8,
    multiple_locations: 8, hide_address: 8, telehealth_regions: 8, telehealth_regions_other: 8,
    payment_methods: 9, insurance_plans: 9,
    phone: 10, website: 10, social_links: 10,
    profile_photo: 11, additional_photos: 11,
    accessibility: 12,
    consent_accurate: 13, consent_notify: 13,
    consent_no_endorsement: 13, consent_public: 13,
};

/* ------------------------------------------------------------------ */
/*  Validation helpers                                                 */
/* ------------------------------------------------------------------ */
const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
const isUrl = (s: string) => /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(s.trim());



function validateStep(step: number, d: ProviderFormData): FormErrors {
    const e: FormErrors = {};
    switch (step) {
        case 0:
            if (!d.provider_type) e.provider_type = 'Please select a provider type.';
            if (!d.organization_name.trim())
                e.organization_name = 'Please enter your name or organization.';
            if (d.professional_title.length === 0)
                e.professional_title = 'Please select at least one professional title.';
            if (d.professional_title.includes('Other (specify)') && !d.professional_title_other.trim())
                e.professional_title_other = 'Please specify your title.';
            break;
        case 1:
            if (!d.email.trim()) e.email = 'Email address is required.';
            else if (!isEmail(d.email)) e.email = 'Please enter a valid email address.';
            if (!d.password) e.password = 'Please create a password.';
            else if (/\s/.test(d.password))
                e.password = 'Password cannot contain spaces.';
            else if (d.password.length < 8)
                e.password = 'Password must be at least 8 characters.';
            else if (!/[a-z]/.test(d.password) || !/[A-Z]/.test(d.password))
                e.password = 'Include at least one uppercase and one lowercase letter.';
            else if (!/[0-9]/.test(d.password))
                e.password = 'Include at least one number.';
            if (!d.short_bio.trim()) e.short_bio = 'A short bio is required.';
            else if (wordCount(d.short_bio) > 500)
                e.short_bio = 'Please keep your bio to 500 words or fewer.';
            break;
        case 2:
            // Verify Email step — validated via OTP flow, not client-side rules.
            break;
        case 3:
            // License number is required UNLESS "Not applicable" is selected.
            if (!d.license_not_applicable && !d.license_number.trim())
                e.license_number = 'Enter your license number, or select "Not applicable".';
            if (d.license_states.length === 0)
                e.license_states = 'Select at least one state or country of licensure.';
            if (!d.license_status) e.license_status = 'Please select your license status.';
            break;
        case 4:
            if (d.areas_of_support.length === 0)
                e.areas_of_support = 'Select at least one area of support.';
            break;
        case 5:
            if (d.populations_served.length === 0)
                e.populations_served = 'Select at least one population you serve.';
            break;
        case 6:
            if (!d.caribbean_identity)
                e.caribbean_identity = 'Please answer so the directory reflects you accurately.';
            if (!d.caribbean_experience)
                e.caribbean_experience = 'Please let us know about your experience.';
            if (d.languages.length === 0)
                e.languages = 'Select at least one language you speak.';
            if (d.languages.includes('Other') && !d.languages_other.trim())
                e.languages_other = 'Please specify the other language(s).';
            if (d.cultural_approach && wordCount(d.cultural_approach) > 250)
                e.cultural_approach = 'Please keep this to 250 words or fewer.';
            break;
        case 7:
            if (d.service_formats.length === 0)
                e.service_formats = 'Select at least one service format.';
            if (d.practice_settings.length === 0)
                e.practice_settings = 'Select at least one practice setting.';
            break;
        case 8:
            if (!d.address.trim()) e.address = 'Address is required.';
            if (!d.city.trim()) e.city = 'City is required.';
            if (!d.state_province) e.state_province = 'State / Province is required.';
            if (!d.country) e.country = 'Country is required.';
            if (!d.multiple_locations)
                e.multiple_locations = 'Please let us know if you serve multiple locations.';
            if (d.telehealth_regions.includes('Other') && !d.telehealth_regions_other.trim())
                e.telehealth_regions_other = 'Please specify the other region(s) you serve.';
            break;
        case 9:
            if (d.payment_methods.length === 0)
                e.payment_methods = 'Select at least one accepted payment method.';
            break;
        case 10:
            if (!d.phone.trim()) e.phone = 'Phone number is required.';
            else if (d.phone.replace(/[^\d]/g, '').length < 7)
                e.phone = 'Please enter a valid phone number.';
            if (d.website && !isUrl(d.website))
                e.website = 'Enter a valid website';
            break;
        case 11:
            if (!d.profile_photo)
                e.profile_photo = 'A professional photo or organization logo is required.';
            break;
        case 12:
            if (d.accessibility.length === 0)
                e.accessibility = 'Select at least one option (choose "Other" if none apply).';
            break;
        case 13:
            if (!d.consent_accurate)
                e.consent_accurate = 'Please confirm the information is accurate.';
            if (!d.consent_notify)
                e.consent_notify = 'Please agree to notify Bahali of changes.';
            if (!d.consent_no_endorsement)
                e.consent_no_endorsement = 'Please acknowledge this is not an endorsement.';
            if (!d.consent_public)
                e.consent_public = 'Please consent to public display of your listing.';
            break;
    }
    return e;
}

/* ------------------------------------------------------------------ */
/*  Reusable field components                                          */
/* ------------------------------------------------------------------ */
const errClass = (hasError: boolean) =>
    hasError
        ? 'border-[#C2543B] focus:border-[#C2543B] focus:ring-[#C2543B]/30'
        : 'border-[#DED7C9] focus:border-[#0E7C7B] focus:ring-[#0E7C7B]/25';

function FieldShell({
    label,
    required,
    hint,
    error,
    children,
}: {
    label?: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            {label && (
                <label className="mb-1.5 block text-sm font-medium text-[#26403F]">
                    {label}
                    {required && <span className="ml-1 text-[#C2543B]">*</span>}
                </label>
            )}
            {hint && <p className="mb-2 text-xs text-[#6B7A78]">{hint}</p>}
            {children}
            {error && (
                <p className="mt-1.5 flex items-center gap-1 text-sm text-[#C2543B]">
                    <span aria-hidden>⚠</span>
                    {error}
                </p>
            )}
        </div>
    );
}

function TextInput({
    value, onChange, error, placeholder, type = 'text', disabled = false,
}: {
    value: string;
    onChange: (v: string) => void;
    error?: boolean;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
}) {
    return (
        <input
            type={type}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(ev) => onChange(ev.target.value)}
            className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[#1F2A2E] placeholder-[#9AA6A4] outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:bg-[#F1EDE3] disabled:text-[#9AA6A4] ${errClass(!!error)}`}
        />
    );
}

function TextArea({
    value, onChange, error, placeholder, rows = 5,
}: {
    value: string;
    onChange: (v: string) => void;
    error?: boolean;
    placeholder?: string;
    rows?: number;
}) {
    return (
        <textarea
            value={value}
            rows={rows}
            placeholder={placeholder}
            onChange={(ev) => onChange(ev.target.value)}
            className={`w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-[#1F2A2E] placeholder-[#9AA6A4] outline-none transition focus:ring-4 ${errClass(!!error)}`}
        />
    );
}

function PasswordInput({
    value, onChange, error, placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    error?: boolean;
    placeholder?: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input
                type={show ? 'text' : 'password'}
                value={value}
                placeholder={placeholder}
                autoComplete="new-password"
                onChange={(ev) => onChange(ev.target.value)}
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 pr-11 text-[#1F2A2E] placeholder-[#9AA6A4] outline-none transition focus:ring-4 ${errClass(!!error)}`}
            />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6B7A78] transition hover:text-[#0E7C7B]"
            >
                {show ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.5 10.5 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L9.88 9.88" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                )}
            </button>
        </div>
    );
}

/**
 * SearchableSelect — shadcn/ui-style Combobox (Popover + Command pattern),
 * self-contained with no external deps, themed for Bahali.
 * Replaces every native <select> dropdown in the form.
 */
function SearchableSelect({
    value, onChange, options, error, placeholder = 'Select…',
    searchPlaceholder = 'Search…', emptyText = 'No results found.',
}: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[] | string[];
    error?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const rootRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const opts = useMemo(
        () => options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)),
        [options]
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return opts;
        return opts.filter((o) => o.label.toLowerCase().includes(q));
    }, [opts, query]);

    const selectedLabel = opts.find((o) => o.value === value)?.label ?? '';

    // Close on outside click / Escape.
    useEffect(() => {
        if (!open) return;
        const onClick = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    // Focus the search box when opening; reset query when closing.
    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => searchRef.current?.focus());
        } else {
            setQuery('');
        }
    }, [open]);

    return (
        <div ref={rootRef} className="relative">
            {/* Trigger */}
            <button
                type="button"
                role="combobox"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className={`flex w-full items-center justify-between rounded-lg border bg-white px-3.5 py-2.5 text-left outline-none transition focus:ring-4 ${errClass(!!error)} ${open ? 'border-[#0E7C7B] ring-4 ring-[#0E7C7B]/25' : ''}`}
            >
                <span className={`truncate ${selectedLabel ? 'text-[#1F2A2E]' : 'text-[#9AA6A4]'}`}>
                    {selectedLabel || placeholder}
                </span>
                <svg
                    viewBox="0 0 24 24"
                    className={`ml-2 h-4 w-4 flex-shrink-0 text-[#6B7A78] transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {/* Popover */}
            {open && (
                <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-lg border border-[#DED7C9] bg-white shadow-lg">
                    {/* Command input */}
                    <div className="flex items-center gap-2 border-b border-[#EFEAE0] px-3">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 text-[#9AA6A4]" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
                        </svg>
                        <input
                            ref={searchRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full bg-transparent py-2.5 text-sm text-[#1F2A2E] placeholder-[#9AA6A4] outline-none"
                        />
                    </div>
                    {/* Command list */}
                    <ul role="listbox" className="max-h-60 overflow-y-auto p-1">
                        {filtered.length === 0 && (
                            <li className="px-3 py-6 text-center text-sm text-[#9AA6A4]">{emptyText}</li>
                        )}
                        {filtered.map((o) => {
                            const active = o.value === value;
                            return (
                                <li key={o.value}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={active}
                                        onClick={() => {
                                            onChange(o.value);
                                            setOpen(false);
                                        }}
                                        className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition ${active
                                            ? 'bg-[#0E7C7B]/10 text-[#15403F]'
                                            : 'text-[#3A4B49] hover:bg-[#0E7C7B]/5'
                                            }`}
                                    >
                                        <span
                                            className={`flex h-4 w-4 flex-shrink-0 items-center justify-center text-[#0E7C7B] ${active ? 'opacity-100' : 'opacity-0'}`}
                                            aria-hidden
                                        >
                                            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                                                <path d="M7.6 13.4 4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" />
                                            </svg>
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

function RadioRow({
    options, value, onChange, name,
}: {
    options: { value: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
    name: string;
}) {
    return (
        <div className="flex flex-wrap gap-2.5">
            {options.map((o) => {
                const active = value === o.value;
                return (
                    <button
                        key={o.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onChange(o.value)}
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${active
                            ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white shadow-sm'
                            : 'border-[#DED7C9] bg-white text-[#3A4B49] hover:border-[#0E7C7B]/60 hover:bg-[#0E7C7B]/5'
                            }`}
                    >
                        {o.label}
                    </button>
                );
            })}
        </div>
    );
}

function CheckGrid({
    options, selected, onToggle, columns = 2,
}: {
    options: string[];
    selected: string[];
    onToggle: (v: string) => void;
    columns?: number;
}) {
    return (
        <div
            className="grid gap-2.5"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
            {options.map((o) => {
                const active = selected.includes(o);
                return (
                    <button
                        key={o}
                        type="button"
                        role="checkbox"
                        aria-checked={active}
                        onClick={() => onToggle(o)}
                        className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm transition ${active
                            ? 'border-[#0E7C7B] bg-[#0E7C7B]/8 text-[#15403F]'
                            : 'border-[#DED7C9] bg-white text-[#3A4B49] hover:border-[#0E7C7B]/50'
                            }`}
                    >
                        <span
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition ${active ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white' : 'border-[#C7BEAD] bg-white'
                                }`}
                            aria-hidden
                        >
                            {active && (
                                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                                    <path d="M7.6 13.4 4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" />
                                </svg>
                            )}
                        </span>
                        <span className="leading-snug">{o}</span>
                    </button>
                );
            })}
        </div>
    );
}

/**
 * AccordionCheckGroups — collapsible category groups for Areas of Support.
 * Each category is an accordion header; expanding it reveals its checkboxes.
 * New categories/items scale automatically from AREAS_OF_SUPPORT_GROUPS.
 */
function AccordionCheckGroups({
    groups, selected, onToggle,
}: {
    groups: { category: string; items: string[] }[];
    selected: string[];
    onToggle: (v: string) => void;
}) {
    // const [openCats, setOpenCats] = useState<Record<string, boolean>>(() =>
    //     groups[0] ? { [groups[0].category]: true } : {}
    // );
    const [openCat, setOpenCat] = useState<string>(
        groups[0]?.category ?? ''
    );

    // const toggleCat = (cat: string) =>
    //     setOpenCats((prev) => ({ ...prev, [cat]: !prev[cat] }));
    const toggleCat = (cat: string) => {
        setOpenCat((prev) => (prev === cat ? '' : cat));
    };

    return (
        <div className="space-y-2.5">
            {groups.map((g) => {
                // const isOpen = !!openCats[g.category];
                const isOpen = openCat === g.category;
                const count = g.items.filter((i) => selected.includes(i)).length;
                return (
                    <div
                        key={g.category}
                        className={`overflow-hidden rounded-xl border transition ${count > 0 ? 'border-[#0E7C7B]/50' : 'border-[#DED7C9]'
                            }`}
                    >
                        {/* Accordion header */}
                        <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => toggleCat(g.category)}
                            className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition ${isOpen ? 'bg-[#0E7C7B]/5' : 'bg-[#FBF8F2] hover:bg-[#0E7C7B]/5'
                                }`}
                        >
                            <span className="flex items-center gap-2.5">
                                <span className="text-sm font-semibold text-[#16302F]">
                                    {g.category}
                                </span>
                                {count > 0 && (
                                    <span className="inline-flex items-center rounded-full bg-[#0E7C7B] px-2 py-0.5 text-xs font-semibold text-white">
                                        {count} selected
                                    </span>
                                )}
                            </span>
                            <svg
                                viewBox="0 0 24 24"
                                className={`h-4 w-4 flex-shrink-0 text-[#0E7C7B] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                        {/* Accordion body */}
                        {isOpen && (
                            <div className="border-t border-[#EFEAE0] bg-white p-3.5">
                                <CheckGrid
                                    options={g.items}
                                    selected={selected}
                                    onToggle={onToggle}
                                    columns={2}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
interface RegionData {
    id: number;
    name: string;
    regionTypeName?: string;
    regionTypeLabel?: string;
}
interface CountryData {
    id: number;
    name: string;
    code: string;
    regions: RegionData[];
}
interface PageProps {
    /** Server-side validation errors keyed by field name (Inertia shared). */
    errors?: Partial<Record<string, string>>;
    countries: CountryData[];
}

export default function ProviderRegistration({ errors: serverErrors, countries }: PageProps) {
    console.log(countries)
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const topRef = useRef<HTMLDivElement>(null);
    // ---- OTP / account-creation state --------------------------------
    const [otpCode, setOtpCode] = useState('');
    const [accountCreated, setAccountCreated] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [creatingAccount, setCreatingAccount] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [resending, setResending] = useState(false);
    const [otpError, setOtpError] = useState('');
    const form = useForm<ProviderFormData>({
        provider_type: '',
        organization_name: '',
        credentials: '',
        professional_title: [],
        professional_title_other: '',
        short_bio: '',
        years_experience: '',
        email: '',
        password: '',
        license_number: '',
        license_not_applicable: false,
        license_states: [],
        license_status: '',
        verification_document: null,
        areas_of_support: [],
        areas_of_support_other: '',
        populations_served: [],
        caribbean_identity: '',
        caribbean_experience: '',
        languages: [],
        languages_other: '',
        cultural_approach: '',
        service_formats: [],
        practice_settings: [],
        address: '',
        city: '',
        state_province: '',
        country: '',
        multiple_locations: '',
        hide_address: false,
        telehealth_regions: [],
        telehealth_regions_other: '',
        payment_methods: [],
        insurance_plans: '',
        phone: '',
        website: '',
        social_links: '',
        profile_photo: null,
        additional_photos: [],
        accessibility: [],
        consent_accurate: false,
        consent_notify: false,
        consent_no_endorsement: false,
        consent_public: false,
    });
    const d = form.data;
    /* ---- field helpers --------------------------------------------- */
    const set = <K extends FieldName>(key: K, value: ProviderFormData[K]) => {
        form.setData(key, value);
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };
    const toggle = (key: FieldName, value: string) => {
        const arr = (d[key] as string[]) ?? [];
        const next = arr.includes(value)
            ? arr.filter((v) => v !== value)
            : [...arr, value];
        set(key, next as ProviderFormData[typeof key]);
    };
    const scrollTop = () =>
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    /* ---- OTP / account helpers --------------------------------------- */
    const getCsrfToken = () =>
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    const createAccountAndSendOtp = async (): Promise<boolean> => {
        setCreatingAccount(true);
        setOtpError('');
        try {
            console.log('[createAccountAndSendOtp] Starting account creation with email:', d.email);
            const csrfToken = getCsrfToken();
            console.log('[createAccountAndSendOtp] CSRF token:', csrfToken ? '✓ present' : '✗ missing');
            const res = await fetch('/provider/directory/register-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    organization_name: d.organization_name,
                    email: d.email,
                    password: d.password,
                }),
            });
            console.log('[createAccountAndSendOtp] Response status:', res.status);
            const json = await res.json();
            console.log('[createAccountAndSendOtp] Response body:', json);
            if (!res.ok) {
                console.error('[createAccountAndSendOtp] Error response:', json);
                const mapped: FormErrors = {};
                if (json.errors?.email) {
                    mapped.email = Array.isArray(json.errors.email) ? json.errors.email[0] : json.errors.email;
                }
                if (json.errors?.password) {
                    mapped.password = Array.isArray(json.errors.password) ? json.errors.password[0] : json.errors.password;
                }
                if (json.errors?.organization_name) {
                    mapped.organization_name = Array.isArray(json.errors.organization_name) ? json.errors.organization_name[0] : json.errors.organization_name;
                }
                if (json.message) {
                    console.error('[createAccountAndSendOtp] Server message:', json.message);
                }
                setErrors(mapped);
                return false;
            }
            console.log('[createAccountAndSendOtp] Account created, OTP sent');
            setAccountCreated(true);
            return true;
        } catch (err) {
            console.error('[createAccountAndSendOtp] Fetch error:', err);
            setOtpError('Something went wrong creating your account. Please try again.');
            return false;
        } finally {
            setCreatingAccount(false);
        }
    };
    const verifyOtp = async () => {
        console.log('[verifyOtp] Starting OTP verification with code:', otpCode);
        setOtpError('');
        setVerifyingOtp(true);
        try {
            const csrfToken = getCsrfToken();
            const res = await fetch('/provider/directory/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                credentials: 'same-origin',
                body: JSON.stringify({ email: d.email, otp: otpCode }),
            });
            const json = await res.json();
            console.log('[verifyOtp] Response status:', res.status, 'body:', json);
            if (!res.ok) {
                console.error('[verifyOtp] Verification failed:', json.message);
                setOtpError(json.message || 'Invalid or expired code. Please try again.');
                return;
            }
            console.log('[verifyOtp] OTP verified successfully, advancing to next step');
            setOtpVerified(true);
            setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
            scrollTop();
        } catch (err) {
            console.error('[verifyOtp] Fetch error:', err);
            setOtpError('Something went wrong verifying your code. Please try again.');
        } finally {
            setVerifyingOtp(false);
        }
    };
    const resendOtp = async () => {
        setResending(true);
        setOtpError('');
        try {
            const res = await fetch('/provider/directory/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ email: d.email }),
            });
            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                setOtpError(json.message || 'Could not resend the code. Please try again.');
            }
        } catch {
            setOtpError('Could not resend the code. Please try again.');
        } finally {
            setResending(false);
        }
    };
    /* ---- navigation ------------------------------------------------- */
    const goNext = async () => {
        const stepErrors = validateStep(step, d);
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            return; // blocked — cannot advance
        }
        setErrors({});
        // Right after "About You", create the account and trigger the OTP email
        // before letting the user reach the Verify Email step.
        if (STEPS[step].key === 'about' && !accountCreated) {
            console.log('[goNext] About step — creating account...');
            const ok = await createAccountAndSendOtp();
            console.log('[goNext] Account creation result:', ok);
            if (!ok) {
                console.log('[goNext] Account creation failed, staying on this step');
                return; // stay on this step, show returned field errors
            }
            console.log('[goNext] Account created successfully, advancing to verify step');
        }
        const nextStep = Math.min(step + 1, TOTAL_STEPS - 1);
        console.log('[goNext] Advancing from step', step, 'to step', nextStep);
        setStep(nextStep);
        scrollTop();
    };
    const goBack = () => {
        setErrors({});
        setStep((s) => Math.max(s - 1, 0));
        scrollTop();
    };
    const handleSubmit = () => {
        const stepErrors = validateStep(step, d);
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            return;
        }
        // Final pass: re-validate every step
        for (let i = 0; i < TOTAL_STEPS; i++) {
            const e = validateStep(i, d);
            if (Object.keys(e).length > 0) {
                setErrors(e);
                setStep(i);
                scrollTop();
                return;
            }
        }
        // Create a FormData object manually for file uploads
        const formData = new FormData();
        // Append all non-file fields
        Object.keys(d).forEach(key => {
            const value = d[key as keyof ProviderFormData];
            if (value === null || value === undefined) return;
            if (key === 'profile_photo' || key === 'verification_document') {
                // Skip files here, we'll handle them separately
                return;
            }
            if (key === 'additional_photos') {
                // Skip, handle separately
                return;
            }
            if (Array.isArray(value)) {
                // For arrays, append each item
                value.forEach(item => {
                    if (item !== null && item !== undefined) {
                        formData.append(`${key}[]`, item);
                    }
                });
            } else if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else {
                formData.append(key, String(value));
            }
        });
        // Append file fields
        if (d.profile_photo instanceof File) {
            formData.append('profile_photo', d.profile_photo);
        }
        if (d.verification_document instanceof File) {
            formData.append('verification_document', d.verification_document);
        }
        if (Array.isArray(d.additional_photos)) {
            d.additional_photos.forEach((file, index) => {
                if (file instanceof File) {
                    formData.append(`additional_photos[]`, file);
                }
            });
        }
        // Submit using the FormData
        form.post('/provider/directory/store', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
            },
            onError: (serverErrs: Record<string, string>) => {
                const firstField = Object.keys(serverErrs)[0];
                if (firstField && FIELD_STEP[firstField] !== undefined) {
                    setStep(FIELD_STEP[firstField]);
                    scrollTop();
                }
            },
        });
    }
    // Merge client + server errors so a field shows whichever is present.
    const fieldError = (key: FieldName): string | undefined =>
        errors[key] || (serverErrors?.[key] ?? form.errors[key]);
    const progress = Math.round(((step + 1) / TOTAL_STEPS) * 100);
    /* ---- success screen -------------------------------------------- */
    if (submitted) {
        return (
            <>
                <Header />
                <Head title="Application Received — Bahali Provider Directory" />
                <div className="min-h-screen bg-[#F7F3EC] px-4 py-16">
                    <div className="mx-auto max-w-xl rounded-2xl border border-[#E7E0D2] bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#0E7C7B]/10">
                            <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#0E7C7B]" fill="none" stroke="currentColor" strokeWidth={2.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="font-serif text-2xl text-[#1B2E2D]">Thank you for joining the circle</h1>
                        <p className="mt-3 text-[#5B6B6E]">
                            Your application has been received. Our team will review your details and
                            reach out about your listing in the Bahali Provider Directory.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <a href="https://bahali.org"
                                className="inline-flex items-center justify-center rounded-lg bg-[#0E7C7B] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0B6463]"
                            >
                                Back to home
                            </a>
                            <a href="https://bahali.org/contact"
                                className="inline-flex items-center justify-center rounded-lg border border-[#E7E0D2] px-5 py-2.5 text-sm font-medium text-[#1B2E2D] transition-colors hover:bg-[#F7F3EC]"
                            >
                                Contact
                            </a>
                        </div>
                    </div >
                </div >
                <Footer />
            </>
        );
    }
    /* ---- render ----------------------------------------------------- */
    return (
        <>
            <Head title="Provider Directory Registration — Bahali" />
            <div className="min-h-screen bg-[#F7F3EC] text-[#1F2A2E]">
                <Header />
                <div ref={topRef} className="mx-auto max-w-5xl px-5 py-8 lg:py-12">
                    <div className="mb-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0E7C7B]">
                            Join the directory
                        </p>
                        <h1 className="mt-2 font-serif text-3xl text-[#16302F] sm:text-4xl">
                            Become a Bahali wellness provider
                        </h1>
                        <p className="mt-2 max-w-2xl text-[#5B6B6E]">
                            Help Caribbean individuals and families find culturally grounded care.
                            Complete each step below — every section must be finished before you continue.
                        </p>
                    </div>
                    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
                        {/* Stepper */}
                        <aside className="lg:sticky lg:top-8 lg:self-start">
                            {/* Mobile progress */}
                            <div className="mb-4 lg:hidden">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-medium text-[#16302F]">
                                        Step {step + 1} of {TOTAL_STEPS}
                                    </span>
                                    <span className="text-[#6B7A78]">{progress}%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2DACB]">
                                    <div
                                        className="h-full rounded-full bg-[#0E7C7B] transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="mt-2 font-serif text-lg text-[#16302F]">
                                    {STEPS[step].title}
                                </p>
                            </div>
                            {/* Desktop vertical stepper */}
                            <nav className="hidden lg:block" aria-label="Progress">
                                <ol className="relative">
                                    <span
                                        className="absolute left-[24px] top-2 bottom-2 w-px bg-[#E2DACB]"
                                        aria-hidden
                                    />
                                    {STEPS.map((s, i) => {
                                        const isDone = i < step;
                                        const isCurrent = i === step;
                                        return (
                                            <li key={s.key} className="relative mb-1 last:mb-0">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (i < step) {
                                                            setErrors({});
                                                            setStep(i);
                                                            scrollTop();
                                                        }
                                                    }}
                                                    disabled={i > step}
                                                    className={`flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition ${i <= step ? 'cursor-pointer hover:bg-[#0E7C7B]/5' : 'cursor-default'
                                                        }`}
                                                >
                                                    <span
                                                        className={`relative z-10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition ${isDone
                                                            ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white'
                                                            : isCurrent
                                                                ? 'border-[#0E7C7B] bg-white text-[#0E7C7B]'
                                                                : 'border-[#D8D0C0] bg-[#F7F3EC] text-[#A4AFAD]'
                                                            }`}
                                                    >
                                                        {isDone ? (
                                                            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                                                                <path d="M7.6 13.4 4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" />
                                                            </svg>
                                                        ) : (
                                                            i + 1
                                                        )}
                                                    </span>
                                                    <span className="min-w-0 pt-0.5">
                                                        <span
                                                            className={`block text-sm font-medium leading-tight ${isCurrent ? 'text-[#16302F]' : 'text-[#5B6B6E]'
                                                                }`}
                                                        >
                                                            {s.title}
                                                        </span>
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
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0E7C7B]">
                                        Section {step + 1}
                                    </p>
                                    <h2 className="mt-1 font-serif text-2xl text-[#16302F]">
                                        {STEPS[step].title}
                                    </h2>
                                </div>
                                <div className="space-y-6">
                                    <StepBody
                                        step={step}
                                        d={d}
                                        set={set}
                                        toggle={toggle}
                                        fieldError={fieldError}
                                        countries={countries}
                                        otpCode={otpCode}
                                        setOtpCode={setOtpCode}
                                        otpError={otpError}
                                        verifyingOtp={verifyingOtp}
                                        resending={resending}
                                        onVerifyOtp={verifyOtp}
                                        onResendOtp={resendOtp}
                                    />
                                </div>
                                {/* Navigation */}
                                <div className="mt-8 flex items-center justify-between border-t border-[#EFEAE0] pt-6">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        disabled={step === 0 || STEPS[step].key === 'verify'}
                                        className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${step === 0 || STEPS[step].key === 'verify'
                                            ? 'cursor-not-allowed text-[#B7C0BE]'
                                            : 'text-[#3A4B49] hover:bg-[#0E7C7B]/5'
                                            }`}
                                    >
                                        ← Back
                                    </button>
                                    {STEPS[step].key === 'verify' ? null : step < TOTAL_STEPS - 1 ? (
                                        <button
                                            type="button"
                                            onClick={goNext}
                                            disabled={creatingAccount}
                                            className="rounded-lg bg-[#0E7C7B] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c6a69] focus:outline-none focus:ring-4 focus:ring-[#0E7C7B]/30 disabled:opacity-60"
                                        >
                                            {creatingAccount ? 'Creating account…' : 'Continue →'}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={form.processing}
                                            className="rounded-lg bg-[#0E7C7B] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition bg-[#0d6c6b] focus:outline-none focus:ring-4 focus:ring-[#0E7C7B]/30 disabled:opacity-60"
                                        >
                                            {form.processing ? 'Submitting…' : 'Submit application'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="mt-4 text-center text-xs text-[#9AA6A4]">
                                Fields marked <span className="text-[#C2543B]">*</span> are required.
                            </p>
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
/* ------------------------------------------------------------------ */
/*  Step body — renders the active section                             */
/* ------------------------------------------------------------------ */
function StepBody({
    step, d, set, toggle, fieldError, countries,
    otpCode, setOtpCode, otpError, verifyingOtp, resending, onVerifyOtp, onResendOtp,
}: {
    step: number;
    d: ProviderFormData;
    set: <K extends FieldName>(key: K, value: ProviderFormData[K]) => void;
    toggle: (key: FieldName, value: string) => void;
    fieldError: (key: FieldName) => string | undefined;
    countries: CountryData[];
    otpCode: string;
    setOtpCode: (v: string) => void;
    otpError: string;
    verifyingOtp: boolean;
    resending: boolean;
    onVerifyOtp: () => void;
    onResendOtp: () => void;
}) {
    const selectedCountry = countries.find(c => c.name === d.country);
    const availableRegions = selectedCountry?.regions ?? [];
    const regionTypeLabel = selectedCountry?.regions[0]?.regionTypeLabel || 'State / Province';
    switch (step) {
        /* ---------------- Step 1: Basic Information ------------------- */
        case 0:
            return (
                <>
                    <FieldShell label="Provider type" required error={fieldError('provider_type')}>
                        <RadioRow
                            name="provider_type"
                            value={d.provider_type}
                            onChange={(v) => set('provider_type', v as ProviderType)}
                            options={PROVIDER_TYPES}
                        />
                    </FieldShell>
                    <FieldShell
                        label="Provider or Organization Name"
                        required
                        error={fieldError('organization_name')}
                    >
                        <TextInput
                            value={d.organization_name}
                            onChange={(v) => set('organization_name', v)}
                            error={!!fieldError('organization_name')}
                            placeholder="Dr. Jane Doe, PsyD or Harmony Counseling Center"
                        />
                    </FieldShell>
                    <FieldShell
                        label="Credentials / License"
                        hint="Examples: PhD, PsyD, MD, LCSW, LMHC, PMHNP-BC"
                        error={fieldError('credentials')}
                    >
                        <TextInput
                            value={d.credentials}
                            onChange={(v) => set('credentials', v)}
                            placeholder="PsyD, LCSW…"
                        />
                    </FieldShell>
                    <FieldShell
                        label="Professional title(s)"
                        required
                        hint="Select all that apply."
                        error={fieldError('professional_title')}
                    >
                        <CheckGrid
                            options={PROFESSIONAL_TITLES}
                            selected={d.professional_title}
                            onToggle={(v) => toggle('professional_title', v)}
                            columns={2}
                        />
                    </FieldShell>
                    {d.professional_title.includes('Other (specify)') && (
                        <FieldShell
                            label="Please specify your title"
                            required
                            error={fieldError('professional_title_other')}
                        >
                            <TextInput
                                value={d.professional_title_other}
                                onChange={(v) => set('professional_title_other', v)}
                                error={!!fieldError('professional_title_other')}
                                placeholder="Your professional title"
                            />
                        </FieldShell>
                    )}
                </>
            );
        /* ---------------- Step 2: About You -------------------------- */
        case 1:
            return (
                <>
                    <FieldShell
                        label="Email address"
                        required
                        hint="You'll use this to sign in and manage your listing."
                        error={fieldError('email')}
                    >
                        <TextInput
                            value={d.email}
                            onChange={(v) => set('email', v)}
                            error={!!fieldError('email')}
                            type="email"
                            placeholder="you@example.com"
                        />
                    </FieldShell>
                    <FieldShell
                        label="Password"
                        required
                        hint="At least 8 characters, no spaces, with upper- and lowercase letters and a number."
                        error={fieldError('password')}
                    >
                        <PasswordInput
                            value={d.password}
                            onChange={(v) => set('password', v)}
                            error={!!fieldError('password')}
                            placeholder="Create a password"
                        />
                    </FieldShell>
                    <FieldShell
                        label="Short bio"
                        required
                        hint="Tell community members a little about yourself and your approach to supporting emotional wellness. (Max 500 words)"
                        error={fieldError('short_bio')}
                    >
                        <TextArea
                            value={d.short_bio}
                            onChange={(v) => set('short_bio', v)}
                            error={!!fieldError('short_bio')}
                            rows={7}
                            placeholder="Share your story, your values, and how you support healing…"
                        />
                        <p className="mt-1.5 text-right text-xs text-[#9AA6A4]">
                            {wordCount(d.short_bio)} / 500 words
                        </p>
                    </FieldShell>
                    <FieldShell label="Years of experience" error={fieldError('years_experience')}>
                        <SearchableSelect
                            value={d.years_experience}
                            onChange={(v) => set('years_experience', v)}
                            options={YEARS_EXPERIENCE}
                            placeholder="Select…"
                            searchPlaceholder="Search experience…"
                        />
                    </FieldShell>
                </>
            );
        /* ---------------- Step 3: Verify Email (OTP) ------------------ */
        case 2:
            return (
                <div className="space-y-5 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0E7C7B]/10">
                        <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#0E7C7B]" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0h3.75v3.75M3.98 8.223A10.477 10.477 0 0 1 12 4.5" />
                        </svg>
                    </div>
                    <p className="text-[#3A4B49]">
                        We sent a 6-digit verification code to <strong>{d.email}</strong>.
                        Enter it below to continue. If you don't see it in your inbox, please check your spam or junk folder.
                    </p>
                    <div className="mx-auto max-w-xs">
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="w-full rounded-lg border border-[#DED7C9] bg-white px-3.5 py-3 text-center text-2xl tracking-[0.4em] text-[#1F2A2E] outline-none transition focus:border-[#0E7C7B] focus:ring-4 focus:ring-[#0E7C7B]/25"
                        />
                        {otpError && (
                            <p className="mt-1.5 flex items-center justify-center gap-1 text-sm text-[#C2543B]">
                                <span aria-hidden>⚠</span>{otpError}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onVerifyOtp}
                        disabled={verifyingOtp || otpCode.length !== 6}
                        className="rounded-lg bg-[#0E7C7B] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c6a69] disabled:opacity-60"
                    >
                        {verifyingOtp ? 'Verifying…' : 'Verify & Continue'}
                    </button>
                    <p className="text-sm text-[#6B7A78]">
                        Didn't get a code?{' '}
                        <button
                            type="button"
                            onClick={onResendOtp}
                            disabled={resending}
                            className="font-medium text-[#0E7C7B] hover:underline disabled:opacity-60"
                        >
                            {resending ? 'Resending…' : 'Resend code'}
                        </button>
                    </p>
                </div>
            );
        /* ---------------- Step 4: Licensure & Verification ----------- */
        case 3:
            return (
                <>
                    <FieldShell
                        label="License number"
                        required
                        hint='Enter your license number, or select "Not applicable" below if you do not hold one.'
                        error={fieldError('license_number')}
                    >
                        <TextInput
                            value={d.license_number}
                            onChange={(v) => set('license_number', v)}
                            error={!!fieldError('license_number')}
                            disabled={d.license_not_applicable}
                            placeholder="Your professional license number"
                        />
                    </FieldShell>
                    <ConsentItem
                        checked={d.license_not_applicable}
                        onChange={(v) => {
                            set('license_not_applicable', v);
                            if (v) set('license_number', '');
                        }}
                    >
                        Not applicable
                    </ConsentItem>
                    <FieldShell
                        label="State / Country of licensure"
                        required
                        hint="Select all that apply."
                        error={fieldError('license_states')}
                    >
                        <CheckGrid
                            options={REGIONS}
                            selected={d.license_states}
                            onToggle={(v) => toggle('license_states', v)}
                            columns={2}
                        />
                    </FieldShell>
                    <FieldShell label="License status" required error={fieldError('license_status')}>
                        <RadioRow
                            name="license_status"
                            value={d.license_status}
                            onChange={(v) => set('license_status', v as LicenseStatus)}
                            options={LICENSE_STATUSES}
                        />
                    </FieldShell>
                    <FieldShell
                        label="Upload verification document"
                        hint="Optional — a license certificate or proof of credentials (PDF, JPG, PNG)."
                        error={fieldError('verification_document')}
                    >
                        <FileInput
                            file={d.verification_document}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(f) => {
                                const validFile = (f && f instanceof File) ? f : null;
                                set('verification_document', validFile);
                            }}
                        />
                    </FieldShell>
                </>
            );
        /* ---------------- Step 5: Areas of Support ------------------- */
        case 4:
            return (
                <FieldShell
                    label="Areas of support"
                    required
                    hint="Expand each category and select every area where you have experience and expertise. Your selections appear on your public profile and are used as searchable filters in the directory. There is no limit to the number of selections."
                    error={fieldError('areas_of_support')}
                >
                    <AccordionCheckGroups
                        groups={AREAS_OF_SUPPORT_GROUPS}
                        selected={d.areas_of_support}
                        onToggle={(v) => toggle('areas_of_support', v)}
                    />
                    {d.areas_of_support.length > 0 && (
                        <p className="mt-3 text-sm font-medium text-[#0E7C7B]">
                            {d.areas_of_support.length} area{d.areas_of_support.length === 1 ? '' : 's'} selected
                        </p>
                    )}
                </FieldShell>
            );
        /* ---------------- Step 6: Populations Served ----------------- */
        case 5:
            return (
                <FieldShell
                    label="Populations served"
                    required
                    hint="Select all that apply."
                    error={fieldError('populations_served')}
                >
                    <CheckGrid
                        options={POPULATIONS_SERVED}
                        selected={d.populations_served}
                        onToggle={(v) => toggle('populations_served', v)}
                        columns={2}
                    />
                </FieldShell>
            );
        /* ---------------- Step 7: Cultural & Language ---------------- */
        case 6:
            return (
                <>
                    <FieldShell
                        label="Do you identify as part of the Caribbean community?"
                        required
                        hint='Providers who select "Yes" receive a "Caribbean Community Member" badge on their public profile.'
                        error={fieldError('caribbean_identity')}
                    >
                        <RadioRow
                            name="caribbean_identity"
                            value={d.caribbean_identity}
                            onChange={(v) => set('caribbean_identity', v as CaribbeanIdentity)}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                                { value: 'prefer_not', label: 'Prefer not to say' },
                            ]}
                        />
                    </FieldShell>
                    <FieldShell
                        label="Do you have experience working with Caribbean individuals and families?"
                        required
                        hint='Providers who select "Yes" receive an "Experience supporting Caribbean individuals and families" badge on their public profile.'
                        error={fieldError('caribbean_experience')}
                    >
                        <RadioRow
                            name="caribbean_experience"
                            value={d.caribbean_experience}
                            onChange={(v) => set('caribbean_experience', v as YesNo)}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        />
                    </FieldShell>
                    <FieldShell
                        label="Languages spoken"
                        required
                        hint="Select all that apply."
                        error={fieldError('languages')}
                    >
                        <CheckGrid
                            options={LANGUAGES}
                            selected={d.languages}
                            onToggle={(v) => toggle('languages', v)}
                            columns={2}
                        />
                    </FieldShell>
                    {d.languages.includes('Other') && (
                        <FieldShell
                            label="Please specify other language(s)"
                            required
                            error={fieldError('languages_other')}
                        >
                            <TextInput
                                value={d.languages_other}
                                onChange={(v) => set('languages_other', v)}
                                error={!!fieldError('languages_other')}
                                placeholder="e.g. Papiamento, Portuguese"
                            />
                        </FieldShell>
                    )}
                    <FieldShell
                        label="How do you incorporate culture into your work?"
                        hint="Optional. (Max 250 words)"
                        error={fieldError('cultural_approach')}
                    >
                        <TextArea
                            value={d.cultural_approach}
                            onChange={(v) => set('cultural_approach', v)}
                            error={!!fieldError('cultural_approach')}
                            rows={5}
                            placeholder="Describe how culture, story, and lived experience shape your care…"
                        />
                        <p className="mt-1.5 text-right text-xs text-[#9AA6A4]">
                            {wordCount(d.cultural_approach)} / 250 words
                        </p>
                    </FieldShell>
                </>
            );
        /* ---------------- Step 8: Service Information ---------------- */
        case 7:
            return (
                <>
                    <FieldShell
                        label="Service formats"
                        required
                        hint="Select all that apply."
                        error={fieldError('service_formats')}
                    >
                        <CheckGrid
                            options={SERVICE_FORMATS}
                            selected={d.service_formats}
                            onToggle={(v) => toggle('service_formats', v)}
                            columns={2}
                        />
                    </FieldShell>
                    <FieldShell
                        label="Practice setting"
                        required
                        hint="Select all that apply."
                        error={fieldError('practice_settings')}
                    >
                        <CheckGrid
                            options={PRACTICE_SETTINGS}
                            selected={d.practice_settings}
                            onToggle={(v) => toggle('practice_settings', v)}
                            columns={2}
                        />
                    </FieldShell>
                </>
            );
        /* ---------------- Step 9: Location --------------------------- */
        case 8:
            return (
                <>
                    <FieldShell label="Address" required error={fieldError('address')}>
                        <TextInput
                            value={d.address}
                            onChange={(v) => set('address', v)}
                            error={!!fieldError('address')}
                            placeholder="Street address"
                        />
                    </FieldShell>
                    <ConsentItem
                        checked={d.hide_address}
                        onChange={(v) => set('hide_address', v)}
                    >
                        Hide the address from public view
                    </ConsentItem>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <FieldShell label="City" required error={fieldError('city')}>
                            <TextInput
                                value={d.city}
                                onChange={(v) => set('city', v)}
                                error={!!fieldError('city')}
                                placeholder="City"
                            />
                        </FieldShell>
                        <FieldShell label="Country" required error={fieldError('country')}>
                            <SearchableSelect
                                value={d.country}
                                onChange={(v) => {
                                    set('country', v);
                                    set('state_province', '');
                                }}
                                options={countries.map(c => ({
                                    value: c.name,
                                    label: c.name
                                }))}
                                error={!!fieldError('country')}
                                placeholder="Select country…"
                                searchPlaceholder="Search countries…"
                            />
                        </FieldShell>
                    </div>
                    <FieldShell
                        label={regionTypeLabel}  // Dynamic label from database
                        required
                        error={fieldError('state_province')}
                        hint={!d.country ? 'Please select a country first' : undefined}
                    >
                        {d.country && availableRegions.length > 0 ? (
                            <SearchableSelect
                                value={d.state_province}
                                onChange={(v) => set('state_province', v)}
                                options={availableRegions.map(r => ({
                                    value: r.name,
                                    label: r.name
                                }))}
                                error={!!fieldError('state_province')}
                                placeholder={`Select ${regionTypeLabel.toLowerCase()}…`}
                                searchPlaceholder={`Search ${regionTypeLabel.toLowerCase()}…`}
                            />
                        ) : d.country && availableRegions.length === 0 ? (
                            <div className="rounded-lg border border-[#DED7C9] bg-[#FBF8F2] px-3.5 py-2.5 text-sm text-[#9AA6A4]">
                                No regions available for this country
                            </div>
                        ) : (
                            <div className="rounded-lg border border-[#DED7C9] bg-[#FBF8F2] px-3.5 py-2.5 text-sm text-[#9AA6A4]">
                                Select a country to see available regions
                            </div>
                        )}
                    </FieldShell>
                    <FieldShell
                        label="Do you provide services across multiple locations?"
                        required
                        error={fieldError('multiple_locations')}
                    >
                        <RadioRow
                            name="multiple_locations"
                            value={d.multiple_locations}
                            onChange={(v) => set('multiple_locations', v as YesNo)}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        />
                    </FieldShell>
                    <FieldShell
                        label="Telehealth regions served"
                        hint="Optional. Select every region where you can offer telehealth."
                        error={fieldError('telehealth_regions')}
                    >
                        <CheckGrid
                            options={REGIONS}
                            selected={d.telehealth_regions}
                            onToggle={(v) => toggle('telehealth_regions', v)}
                            columns={2}
                        />
                    </FieldShell>
                    {d.telehealth_regions.includes('Other') && (
                        <FieldShell
                            label="Please specify other telehealth region(s)"
                            required
                            hint="Separate multiple regions with commas."
                            error={fieldError('telehealth_regions_other')}
                        >
                            <TextInput
                                value={d.telehealth_regions_other}
                                onChange={(v) => set('telehealth_regions_other', v)}
                                error={!!fieldError('telehealth_regions_other')}
                                placeholder="e.g. Panama, Costa Rica, Sint Maarten"
                            />
                        </FieldShell>
                    )}
                </>
            );
        /* ---------------- Step 10: Insurance & Payment ---------------- */
        case 9:
            return (
                <>
                    <FieldShell
                        label="Accepted payment methods"
                        required
                        hint="Select all that apply."
                        error={fieldError('payment_methods')}
                    >
                        <CheckGrid
                            options={PAYMENT_METHODS}
                            selected={d.payment_methods}
                            onToggle={(v) => toggle('payment_methods', v)}
                            columns={2}
                        />
                    </FieldShell>
                    <FieldShell
                        label="Insurance plans accepted"
                        hint="Optional. List the specific plans you accept."
                        error={fieldError('insurance_plans')}
                    >
                        <TextArea
                            value={d.insurance_plans}
                            onChange={(v) => set('insurance_plans', v)}
                            rows={3}
                            placeholder="e.g. Aetna, Blue Cross Blue Shield, Cigna…"
                        />
                    </FieldShell>
                </>
            );
        /* ---------------- Step 11: Contact Information --------------- */
        case 10:
            return (
                <>
                    <FieldShell label="Phone number" required error={fieldError('phone')}>
                        {/* <TextInput
                            value={d.phone}
                            onChange={(v) => set('phone', v)}
                            error={!!fieldError('phone')}
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                        /> */}
                        <PhoneInput
                            value={d.phone}
                            onChange={(v) => set('phone', v)}
                            error={!!fieldError('phone')}
                            placeholder="+1 (555) 000-0000"
                        />
                    </FieldShell>
                    <FieldShell label="Website" hint="Optional." error={fieldError('website')}>
                        <TextInput
                            value={d.website}
                            onChange={(v) => set('website', v)}
                            error={!!fieldError('website')}
                            placeholder="yourpractice.com"
                        />
                    </FieldShell>
                    <FieldShell
                        label="Social media links"
                        hint="Optional. Add up to 5 links."
                        error={fieldError('social_links')}
                    >
                        <SocialLinksInput
                            value={d.social_links}
                            onChange={(v) => set('social_links', v)}
                        />
                    </FieldShell>
                </>
            );
        /* ---------------- Step 12: Profile Media -------------------- */
        case 11:
            return (
                <>
                    <FieldShell
                        label="Professional photo or organization logo"
                        required
                        hint="A clear headshot or your logo. JPG or PNG."
                        error={fieldError('profile_photo')}
                    >
                        {/* <FileInput
                            file={d.profile_photo}
                            accept=".jpg,.jpeg,.png,.webp, .pdf"
                            preview
                            onChange={(f) => {
                                const validFile = (f && f instanceof File) ? f : null;
                                set('profile_photo', validFile);
                            }}
                        /> */}
                        <FileInput
                            file={d.profile_photo}
                            accept=".jpg,.jpeg,.png"
                            preview
                            allowedTypes={['jpg', 'jpeg', 'png']}
                            onChange={(f) => {
                                const validFile = (f && f instanceof File) ? f : null;
                                set('profile_photo', validFile);
                            }}
                        />
                    </FieldShell>
                    <FieldShell
                        label="Additional photos"
                        hint="Optional. Images of your space, team, or community work."
                        error={fieldError('additional_photos')}
                    >
                        {/* <MultiFileInput
                            files={d.additional_photos}
                            accept=".jpg,.jpeg,.png,.webp, .pdf"
                            onChange={(files) => set('additional_photos', files)}
                        /> */}
                        <MultiFileInput
                            files={d.additional_photos}
                            accept=".jpg,.jpeg,.png,.webp"
                            allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
                            onChange={(files) => set('additional_photos', files)}
                        />
                    </FieldShell>
                </>
            );
        /* ---------------- Step 13: Accessibility -------------------- */
        case 12:
            return (
                <FieldShell
                    label="Accessibility"
                    required
                    hint='Select all that apply. Choose "Other" if none apply.'
                    error={fieldError('accessibility')}
                >
                    <CheckGrid
                        options={ACCESSIBILITY_OPTIONS}
                        selected={d.accessibility}
                        onToggle={(v) => toggle('accessibility', v)}
                        columns={2}
                    />
                </FieldShell>
            );
        /* ---------------- Step 14: Consent & Agreement -------------- */
        case 13:
            return (
                <div className="space-y-4">
                    <p className="text-sm text-[#5B6B6E]">
                        Please review and agree to each statement below to complete your application.
                    </p>
                    <ConsentItem
                        checked={d.consent_accurate}
                        onChange={(v) => set('consent_accurate', v)}
                        error={fieldError('consent_accurate')}
                    >
                        I certify that the information provided is accurate.
                    </ConsentItem>
                    <ConsentItem
                        checked={d.consent_notify}
                        onChange={(v) => set('consent_notify', v)}
                        error={fieldError('consent_notify')}
                    >
                        I agree to notify Bahali of any changes to my licensure or contact information.
                    </ConsentItem>
                    <ConsentItem
                        checked={d.consent_no_endorsement}
                        onChange={(v) => set('consent_no_endorsement', v)}
                        error={fieldError('consent_no_endorsement')}
                    >
                        I understand that inclusion in the Bahali Directory does not constitute
                        endorsement by Bahali.
                    </ConsentItem>
                    <ConsentItem
                        checked={d.consent_public}
                        onChange={(v) => set('consent_public', v)}
                        error={fieldError('consent_public')}
                    >
                        I consent to Bahali displaying this information publicly.
                    </ConsentItem>
                </div>
            );
        default:
            return null;
    }
}
/* ------------------------------------------------------------------ */
/*  File inputs & consent row                                          */
/* ------------------------------------------------------------------ */
function FileInput({
    file, onChange, accept, preview = false, allowedTypes = [],
}: {
    file: File | null;
    onChange: (f: File | null) => void;
    accept?: string;
    preview?: boolean;
    allowedTypes?: string[];
}) {
    const [fileError, setFileError] = useState('');
    const previewUrl = useMemo(
        () => (preview && file ? URL.createObjectURL(file) : null),
        [preview, file]
    );
    // Cleanup function for memory leak prevention
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);
    const validateFile = (f: File): string | null => {
        if (allowedTypes.length === 0) return null;
        const fileExtension = f.name.split('.').pop()?.toLowerCase();
        const isAllowed = allowedTypes.some(type =>
            fileExtension === type.toLowerCase() ||
            f.type.toLowerCase().includes(type.toLowerCase())
        );
        if (!isAllowed) {
            return `Only ${allowedTypes.join(', ').toUpperCase()} files are allowed.`;
        }
        return null;
    };
    return (
        <div>
            <div className="flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#C7BEAD] bg-[#FBF8F2] px-4 py-3 text-sm font-medium text-[#3A4B49] transition hover:border-[#0E7C7B] hover:bg-[#0E7C7B]/5">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#0E7C7B]" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                    </svg>
                    {file ? 'Replace file' : 'Choose file'}
                    <input
                        type="file"
                        accept={accept}
                        className="hidden"
                        onChange={(e) => {
                            const selectedFile = e.target.files?.[0] ?? null;
                            // Reset the input value to allow selecting the same file again
                            e.target.value = '';
                            if (selectedFile) {
                                const err = validateFile(selectedFile);
                                if (err) {
                                    setFileError(err);
                                    return;
                                }
                            }
                            setFileError('');
                            onChange(selectedFile);
                        }}
                    />
                </label>
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-14 w-14 rounded-lg border border-[#E7E0D2] object-cover"
                    />
                )}
                {file && (
                    <div className="flex items-center gap-2 text-sm text-[#5B6B6E]">
                        <span className="max-w-[180px] truncate">{file.name}</span>
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="text-[#C2543B] hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>
            {fileError && (
                <p className="mt-1.5 flex items-center gap-1 text-sm text-[#C2543B]">
                    <span aria-hidden>⚠</span>
                    {fileError}
                </p>
            )}
        </div>
    );
}
function MultiFileInput({
    files, onChange, accept, allowedTypes = [],
}: {
    files: File[];
    onChange: (files: File[]) => void;
    accept?: string;
    allowedTypes?: string[];
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
    const validateFile = (file: File): string | null => {
        if (allowedTypes.length === 0) return null;
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const isAllowed = allowedTypes.some(type =>
            fileExtension === type.toLowerCase() ||
            file.type.toLowerCase().includes(type.toLowerCase())
        );
        if (!isAllowed) {
            return `${file.name}: Only ${allowedTypes.join(', ').toUpperCase()} allowed`;
        }
        return null;
    };
    return (
        <div className="space-y-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#C7BEAD] bg-[#FBF8F2] px-4 py-3 text-sm font-medium text-[#3A4B49] transition hover:border-[#0E7C7B] hover:bg-[#0E7C7B]/5">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#0E7C7B]" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add photos
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        const newFiles = e.target.files ? Array.from(e.target.files) : [];
                        const errors: Record<string, string> = {};
                        const validFiles: File[] = [];
                        newFiles.forEach((file) => {
                            const error = validateFile(file);
                            if (error) {
                                errors[file.name] = error;
                            } else {
                                validFiles.push(file);
                            }
                        });
                        setFileErrors(errors);
                        if (validFiles.length > 0) {
                            onChange([...files, ...validFiles]);
                        }
                        e.target.value = '';
                    }}
                />
            </label>
            {/* Show file validation errors */}
            {Object.keys(fileErrors).length > 0 && (
                <div className="rounded-lg border border-[#C2543B]/30 bg-[#C2543B]/5 p-3">
                    {Object.values(fileErrors).map((error, idx) => (
                        <p key={idx} className="flex items-center gap-1 text-sm text-[#C2543B] mb-1">
                            <span aria-hidden>⚠</span>
                            {error}
                        </p>
                    ))}
                </div>
            )}
            {files.length > 0 && (
                <ul className="space-y-1.5">
                    {files.map((f, i) => (
                        <li
                            key={`${f.name}-${i}-${f.lastModified}`}
                            className="flex items-center justify-between rounded-lg border border-[#EFEAE0] bg-[#FBF8F2] px-3 py-2 text-sm text-[#5B6B6E]"
                        >
                            <span className="max-w-[240px] truncate">{f.name}</span>
                            <button
                                type="button"
                                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                                className="text-[#C2543B] hover:underline"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
function SocialLinksInput({
    value, onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    const MAX = 5;
    // Build the initial rows from the stored string (comma/newline separated).
    const makeRows = () => {
        const parts = value ? value.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean) : [];
        const init = parts.length ? parts : [''];
        return init.map((v, i) => ({ id: i + 1, value: v }));
    };
    const [rows, setRows] = useState<{ id: number; value: string }[]>(makeRows);
    const nextId = useRef(rows.length + 1);
    // Update local rows AND push a comma-separated string up to the form.
    const sync = (next: { id: number; value: string }[]) => {
        setRows(next);
        onChange(next.map((r) => r.value.trim()).filter(Boolean).join(', '));
    };
    const updateAt = (id: number, v: string) =>
        sync(rows.map((r) => (r.id === id ? { ...r, value: v } : r)));
    const addField = () => {
        if (rows.length >= MAX) return;
        sync([...rows, { id: nextId.current++, value: '' }]);
    };
    const removeAt = (id: number) => sync(rows.filter((r) => r.id !== id));
    return (
        <div className="space-y-2.5">
            {rows.map((row, i) => {
                const isFirst = i === 0;
                const isLast = i === rows.length - 1;
                return (
                    <div key={row.id} className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Enter Platform Name"
                            className="w-full rounded-lg border border-[#DED7C9] bg-white px-3.5 py-2.5 text-[#1F2A2E] placeholder-[#9AA6A4] outline-none transition focus:border-[#0E7C7B] focus:ring-4 focus:ring-[#0E7C7B]/25"
                        />
                        <input
                            type="url"
                            value={row.value}
                            onChange={(e) => updateAt(row.id, e.target.value)}
                            placeholder="https://www.example.com"
                            className="w-full rounded-lg border border-[#DED7C9] bg-white px-3.5 py-2.5 text-[#1F2A2E] placeholder-[#9AA6A4] outline-none transition focus:border-[#0E7C7B] focus:ring-4 focus:ring-[#0E7C7B]/25"
                        />
                        {/* Plus — only on the last row, and only below the max */}
                        {isLast && rows.length < MAX && (
                            <button
                                type="button"
                                onClick={addField}
                                aria-label="Add another link"
                                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-[#0E7C7B]/40 bg-[#0E7C7B]/5 text-[#0E7C7B] transition hover:bg-[#0E7C7B]/10"
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg>
                            </button>
                        )}
                        {/* Cross — every row except the first */}
                        {!isFirst && (
                            <button
                                type="button"
                                onClick={() => removeAt(row.id)}
                                aria-label="Remove this link"
                                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-[#DED7C9] text-[#C2543B] transition hover:border-[#C2543B] hover:bg-[#C2543B]/5"
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
function PhoneInput({
    value, onChange, error, placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    error?: boolean;
    placeholder?: string;
}) {
    return (
        <input
            type="tel"
            value={value}
            placeholder={placeholder}
            onChange={(ev) => {
                // Allow only numbers, spaces, dashes, plus, and parentheses
                const cleaned = ev.target.value.replace(/[^0-9\s\-\+\(\)]/g, '');
                onChange(cleaned);
            }}
            className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[#1F2A2E] placeholder-[#9AA6A4] outline-none transition focus:ring-4 ${errClass(!!error)}`}
        />
    );
}
function ConsentItem({
    checked, onChange, error, children,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition ${checked
                    ? 'border-[#0E7C7B] bg-[#0E7C7B]/8'
                    : error
                        ? 'border-[#C2543B] bg-[#C2543B]/5'
                        : 'border-[#DED7C9] bg-white hover:border-[#0E7C7B]/50'
                    }`}
            >
                <span
                    className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition ${checked ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white' : 'border-[#C7BEAD] bg-white'
                        }`}
                    aria-hidden
                >
                    {checked && (
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                            <path d="M7.6 13.4 4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" />
                        </svg>
                    )}
                </span>
                <span className="text-sm leading-snug text-[#26403F]">{children}</span>
            </button>
            {error && (
                <p className="mt-1 ml-1 text-sm text-[#C2543B]">{error}</p>
            )}
        </div>
    );
}
