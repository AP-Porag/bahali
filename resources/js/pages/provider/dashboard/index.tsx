import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ProviderMenu from '@/components/provider/ProviderMenu'; // নতুন মেনু কম্পোনেন্ট
import Footer from '@/components/Footer';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DashboardProps {
    provider: {
        id: number;
        organization_name: string;
        professional_title: string[];
        credentials?: string;
        short_bio?: string;
        years_experience?: string;
        email?: string;
        phone?: string;
        website?: string;
        social_links?: string;
        address?: string;
        city?: string;
        state_province?: string;
        country?: string;
        hide_address?: boolean;
        multiple_locations?: string;
        service_formats?: string[];
        practice_settings?: string[];
        areas_of_support?: string[];
        populations_served?: string[];
        languages?: string[];
        treatment_approaches?: string[];
        specialized_training?: string[];
        certifications?: string[];
        caribbean_identity?: string;
        caribbean_experience?: string;
        cultural_approach?: string;
        payment_methods?: string[];
        insurance_plans?: string;
        accessibility?: string[];
        profile_photo?: string | null;
        telehealth_regions?: string[];
        license_number?: string;
        license_status?: string;
        license_states?: string[];
        verification_document?: string | null;
        submitted_at?: string | null;
        reviewed_at?: string | null;
        review_note?: string | null;
        status?: string;
        accepting_new_clients?: boolean | null;
        availability_confirmed_at?: string | null;
        availability_next_reminder?: string | null;
        availability_state?: 'accepting' | 'not_accepting' | 'unknown';
        availability_due?: boolean;
    };
    status: {
        value: string;
        label: string;
        isPublic: boolean;
        description: string;
    };
    completeness: {
        percent: number;
        done: number;
        total: number;
        missing: string[];
    };
    stats: {
        supportAreas: number;
        languages: number;
        populations: number;
        sessionFormat: string | null;
    };
    links: {
        editProfile: string;
        publicProfile: string | null;
        directory: string;
    };
}

/* ------------------------------------------------------------------ */
/*  Status styles (Bahali theme)                                      */
/* ------------------------------------------------------------------ */

const STATUS_STYLES: Record<string, string> = {
    approved: 'bg-[#1E4D4A]/10 text-[#1E4D4A]',
    pending: 'bg-[#E8D9B8]/60 text-[#2C2C2C]',
    needs_correction: 'bg-[#E8D9B8]/60 text-[#2C2C2C]',
    pending_verification: 'bg-[#1E4D4A]/10 text-[#1E4D4A]',
    rejected: 'bg-[#C2543B]/10 text-[#A33D29]',
    suspended: 'bg-[#E99E84]/20 text-[#2C2C2C]',
    inactive: 'bg-[#9CAEA9]/20 text-[#2C2C2C]',
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function initials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('') || 'B';
}

function Badge({ text }: { text: string }) {
    return (
        <span className="inline-flex items-center rounded-full bg-[#E8D9B8]/40 px-3 py-1 text-sm font-medium text-[#2C2C2C]">
            {text}
        </span>
    );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
            <dt className="text-sm font-medium text-[#2C2C2C]/75">{label}</dt>
            <dd className="text-sm text-[#2C2C2C] sm:text-right">{value}</dd>
        </div>
    );
}

function SectionCard({
    title,
    children,
    action,
}: {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-[#E8D9B8] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[18px] font-semibold leading-[1.2] text-[#1E4D4A] md:text-[20px]">{title}</h2>
                {action}
            </div>
            {children}
        </div>
    );
}

function BadgeList({ items }: { items?: string[] }) {
    if (!items || items.length === 0) return <p className="text-sm text-[#2C2C2C]/70">—</p>;
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item, idx) => (
                <Badge key={`${item}-${idx}`} text={item} />
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Availability panel (guide §6)                                      */
/* ------------------------------------------------------------------ */

function AvailabilityPanel({ provider }: { provider: DashboardProps['provider'] }) {
    // Never set on the server -> nothing is pre-selected, so the provider makes an explicit choice.
    const initial: 'yes' | 'no' | '' =
        provider.accepting_new_clients === true ? 'yes' : provider.accepting_new_clients === false ? 'no' : '';
    const [choice, setChoice] = useState<'yes' | 'no' | ''>(initial);
    const [saving, setSaving] = useState(false);

    const neverSet = provider.accepting_new_clients !== true && provider.accepting_new_clients !== false;
    // Set before, but not reconfirmed within 60 days -> the public listing shows "Contact to confirm availability".
    const expired = !neverSet && provider.availability_state === 'unknown';
    const dueSoon = !neverSet && !expired && !!provider.availability_due;

    const currentStatusLabel = neverSet
        ? 'Not set yet'
        : expired
            ? 'Needs reconfirming'
            : provider.accepting_new_clients
                ? 'Accepting new clients'
                : 'Not accepting new clients';

    const save = () => {
        if (saving || !choice) return;
        setSaving(true);
        router.post(
            '/provider/availability',
            { accepting_new_clients: choice === 'yes' ? 1 : 0 },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            },
        );
    };

    const Radio = ({ value, label }: { value: 'yes' | 'no'; label: string }) => {
        const active = choice === value;
        return (
            <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setChoice(value)}
                className="flex min-h-[48px] w-full items-center gap-3 rounded-[10px] px-2 py-1.5 text-left transition hover:bg-[#1E4D4A]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D4A]/40"
            >
                <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${active ? 'border-[#1E4D4A]' : 'border-[#1E4D4A]/65'}`}>
                    {active && <span className="h-2.5 w-2.5 rounded-full bg-[#1E4D4A]" />}
                </span>
                <span className={`text-[15px] text-[#2C2C2C] ${active ? 'font-semibold' : ''}`}>{label}</span>
            </button>
        );
    };

    return (
        <div className="mb-6 grid grid-cols-1 gap-6 rounded-2xl border border-[#E8D9B8] bg-white p-5 shadow-sm sm:p-6 lg:grid-cols-[1fr_1px_320px]">
            {/* left — question + save */}
            <div>
                {(neverSet || expired || dueSoon) && (
                    <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#E8D9B8] bg-[#E8D9B8]/40 px-4 py-3 text-sm text-[#2C2C2C]">
                        <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1E4D4A]" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                        </svg>
                        <span>
                            {neverSet && (
                                <>
                                    <span className="block font-semibold">Let visitors know if you're accepting new clients.</span>
                                    Your listing shows “Contact to confirm availability” until you choose an answer below and save.
                                </>
                            )}
                            {expired && (
                                <>
                                    <span className="block font-semibold">Please reconfirm your availability.</span>
                                    It wasn't reconfirmed in the last 60 days, so your listing now shows “Contact to confirm availability”. Choose an answer below and save.
                                </>
                            )}
                            {dueSoon && (
                                <>
                                    <span className="block font-semibold">Time to reconfirm your availability.</span>
                                    Please save your answer by {provider.availability_next_reminder}, otherwise your listing will show “Contact to confirm availability”.
                                </>
                            )}
                        </span>
                    </div>
                )}
                <h2 className="text-[18px] font-semibold leading-[1.2] text-[#1E4D4A] md:text-[20px]">Are you currently accepting new clients?</h2>
                <p className="mt-1 text-sm text-[#2C2C2C]/75">This shows on your public listing. Please reconfirm periodically so it stays accurate.</p>
                <div className="mt-4 space-y-1">
                    <Radio value="yes" label="Yes, I am accepting new clients" />
                    <Radio value="no" label="No, I am not currently accepting new clients" />
                </div>
                <button
                    type="button"
                    onClick={save}
                    disabled={saving || !choice}
                    className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#1E4D4A] px-5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#163F3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D4A]/40 focus-visible:ring-offset-2 disabled:opacity-60 sm:w-auto sm:min-w-[220px]"
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden><path d="M21 12a9 9 0 1 1-6.2-8.5" /></svg>
                            Saving…
                        </>
                    ) : 'Save availability'}
                </button>
            </div>

            {/* divider */}
            <div className="hidden bg-[#E8D9B8] lg:block" aria-hidden />

            {/* right — status information */}
            <div className="rounded-xl bg-[#FAFAF6] p-4">
                <p className="text-sm font-semibold text-[#2C2C2C]">Status Information <span className="font-normal text-[#2C2C2C]/70">(shown to provider)</span></p>
                <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-3">
                        <dt className="text-[#2C2C2C]/75">Current status:</dt>
                        <dd className="text-right font-medium text-[#2C2C2C]">{currentStatusLabel}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                        <dt className="text-[#2C2C2C]/75">Last confirmed:</dt>
                        <dd className="text-right text-[#2C2C2C]">{provider.availability_confirmed_at || '—'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                        <dt className="text-[#2C2C2C]/75">Reconfirm by:</dt>
                        <dd className="text-right text-[#2C2C2C]">{provider.availability_next_reminder || '—'}</dd>
                    </div>
                </dl>
                <p className="mt-3 text-sm leading-relaxed text-[#2C2C2C]/75">
                    Please reconfirm your availability periodically so clients receive current information.
                </p>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ProviderDashboard({ provider, status, completeness, stats, links }: DashboardProps) {
    const statusChip = STATUS_STYLES[status.value] ?? STATUS_STYLES.inactive;

    // All display arrays with fallback
    const areasOfSupport = provider.areas_of_support || [];
    const populationsServed = provider.populations_served || [];
    const languages = provider.languages || [];
    const treatmentApproaches = provider.treatment_approaches || [];
    const specializedTraining = provider.specialized_training || [];
    const certifications = provider.certifications || [];
    const serviceFormats = provider.service_formats || [];
    const practiceSettings = provider.practice_settings || [];
    const paymentMethods = provider.payment_methods || [];
    const accessibility = provider.accessibility || [];
    const telehealthRegions = provider.telehealth_regions || [];
    const licenseStates = provider.license_states || [];
    const professionalTitles = provider.professional_title || [];

    return (
        <>
            <Head title="Provider Dashboard" />

            <div className="min-h-screen bg-[#FAFAF6] font-body text-[#2C2C2C]">
                {/* Top navigation — আলাদা কম্পোনেন্ট */}
                <ProviderMenu />

                {/* Main content */}
                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {/* Welcome header */}
                    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#E8D9B8] bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                {provider.profile_photo ? (
                                    <img
                                        src={provider.profile_photo}
                                        alt={provider.organization_name}
                                        className="h-14 w-14 rounded-xl object-cover"
                                    />
                                ) : (
                                    <img
                                        src="/images/dummy-profile.jpg"
                                        alt={provider.organization_name}
                                        className="h-14 w-14 rounded-xl object-cover"
                                    />
                                )}
                                <div>
                                    <h1 className="font-display text-[24px] font-semibold leading-[1.15] text-[#1E4D4A] md:text-[28px]">
                                        Welcome back, {provider.organization_name}
                                    </h1>
                                    <p className="text-sm text-[#2C2C2C]/75">
                                        {[professionalTitles.join(', '), provider.city, provider.country]
                                            .filter(Boolean)
                                            .join(' · ') || 'Manage your provider profile'}
                                    </p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-sm font-semibold ${statusChip}`}>
                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                                {status.label}
                            </span>
                        </div>

                        <p className="mt-2 rounded-lg bg-[#FAFAF6] px-4 py-3 text-[15px] text-[#2C2C2C]">
                            {status.description}
                        </p>

                        {provider.review_note && (
                            <p className="mt-2 rounded-lg border border-[#E8D9B8] bg-[#E8D9B8]/40 px-4 py-3 text-sm text-[#2C2C2C]">
                                <span className="font-semibold">Reviewer note:</span> {provider.review_note}
                            </p>
                        )}
                    </div>

                    {/* Availability panel */}
                    <AvailabilityPanel provider={provider} />

                    {/* Stats cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div className="rounded-2xl border border-[#E8D9B8] bg-white p-5 shadow-sm">
                            <span className="text-2xl font-semibold text-[#1E4D4A]">{stats.supportAreas}</span>
                            <span className="block text-sm text-[#2C2C2C]/75">Areas of support</span>
                        </div>
                        <div className="rounded-2xl border border-[#E8D9B8] bg-white p-5 shadow-sm">
                            <span className="text-2xl font-semibold text-[#1E4D4A]">{stats.languages}</span>
                            <span className="block text-sm text-[#2C2C2C]/75">Languages spoken</span>
                        </div>
                        <div className="rounded-2xl border border-[#E8D9B8] bg-white p-5 shadow-sm">
                            <span className="text-2xl font-semibold text-[#1E4D4A]">{stats.populations}</span>
                            <span className="block text-sm text-[#2C2C2C]/75">Populations served</span>
                        </div>
                    </div>

                    {/* Detailed sections */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <SectionCard title="About & Bio">
                            <dl className="space-y-3">
                                <InfoRow label="Short Bio" value={provider.short_bio} />
                                <InfoRow label="Years of Experience" value={provider.years_experience} />
                                <InfoRow label="Cultural Approach" value={provider.cultural_approach} />
                                <InfoRow label="Credentials" value={provider.credentials} />
                            </dl>
                        </SectionCard>

                        <SectionCard title="Professional Details">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/75">Professional Titles</h3>
                                    <BadgeList items={professionalTitles} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/75">Treatment Approaches</h3>
                                    <BadgeList items={treatmentApproaches} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/75">Specialized Training</h3>
                                    <BadgeList items={specializedTraining} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/75">Certifications</h3>
                                    <BadgeList items={certifications} />
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Areas of Support & Populations">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/75">Areas of Support</h3>
                                    <BadgeList items={areasOfSupport} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/75">Populations Served</h3>
                                    <BadgeList items={populationsServed} />
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Languages & Cultural Identity">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/75">Languages</h3>
                                    <BadgeList items={languages} />
                                </div>
                                <InfoRow label="Caribbean Identity" value={provider.caribbean_identity} />
                                <InfoRow label="Caribbean Experience" value={provider.caribbean_experience} />
                            </div>
                        </SectionCard>

                        <SectionCard title="Service Information">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/75">Service Formats</h3>
                                    <BadgeList items={serviceFormats} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/75">Practice Settings</h3>
                                    <BadgeList items={practiceSettings} />
                                </div>
                                <InfoRow label="Session Format" value={stats.sessionFormat} />
                            </div>
                        </SectionCard>

                        <SectionCard title="Location & Telehealth">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/75">Address</h3>
                                    {provider.hide_address ? (
                                        <p className="text-sm text-[#2C2C2C]/75">Hidden from public view</p>
                                    ) : (
                                        <p className="text-sm text-[#2C2C2C]">
                                            {[provider.address, provider.city, provider.state_province, provider.country]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                    )}
                                </div>
                                <InfoRow label="Multiple Locations" value={provider.multiple_locations} />
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/75">Telehealth Regions</h3>
                                    <BadgeList items={telehealthRegions} />
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Payment & Insurance">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/75">Payment Methods</h3>
                                    <BadgeList items={paymentMethods} />
                                </div>
                                <InfoRow label="Insurance Plans" value={provider.insurance_plans} />
                            </div>
                        </SectionCard>

                        <SectionCard title="Contact Information">
                            <dl className="space-y-3">
                                <InfoRow label="Email" value={provider.email} />
                                <InfoRow label="Phone" value={provider.phone} />
                                <InfoRow label="Website" value={provider.website} />
                                <InfoRow label="Social Links" value={provider.social_links} />
                            </dl>
                        </SectionCard>

                        <SectionCard title="Accessibility">
                            <BadgeList items={accessibility} />
                        </SectionCard>

                        <SectionCard title="Licensure">
                            <dl className="space-y-3">
                                <InfoRow label="License Number" value={provider.license_number} />
                                <InfoRow label="License Status" value={provider.license_status} />
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2C2C2C]/75">License States/Countries</h3>
                                    <BadgeList items={licenseStates} />
                                </div>
                            </dl>
                        </SectionCard>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
