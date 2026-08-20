import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
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
    approved: 'bg-[#0E7C7B]/10 text-[#0B6463]',
    pending: 'bg-[#F5A623]/10 text-[#B7791F]',
    rejected: 'bg-[#C2543B]/10 text-[#A33D29]',
    suspended: 'bg-[#D97706]/10 text-[#92400E]',
    inactive: 'bg-[#F1EDE3] text-[#6B7A78]',
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
        <span className="inline-flex items-center rounded-full bg-[#F1EDE3] px-3 py-1 text-xs text-[#5B6B6E]">
            {text}
        </span>
    );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
            <dt className="text-sm font-medium text-[#5B6B6E]">{label}</dt>
            <dd className="text-sm text-[#16302F] sm:text-right">{value}</dd>
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
        <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-sm font-semibold text-[#16302F]">{title}</h2>
                {action}
            </div>
            {children}
        </div>
    );
}

function BadgeList({ items }: { items?: string[] }) {
    if (!items || items.length === 0) return <p className="text-sm text-[#9AA6A4]">—</p>;
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item, idx) => (
                <Badge key={`${item}-${idx}`} text={item} />
            ))}
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

            <div className="min-h-screen bg-[#F7F3EC] text-[#1F2A2E]">
                {/* Top navigation — আলাদা কম্পোনেন্ট */}
                <ProviderMenu />

                {/* Main content */}
                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {/* Welcome header */}
                    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm sm:p-6">
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
                                    <h1 className="font-serif text-xl font-semibold text-[#16302F]">
                                        Welcome back, {provider.organization_name}
                                    </h1>
                                    <p className="text-sm text-[#5B6B6E]">
                                        {[professionalTitles.join(', '), provider.city, provider.country]
                                            .filter(Boolean)
                                            .join(' · ') || 'Manage your provider profile'}
                                    </p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-medium ${statusChip}`}>
                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                                {status.label}
                            </span>
                        </div>

                        <p className="mt-2 rounded-lg bg-[#FBF8F2] px-4 py-3 text-sm text-[#5B6B6E]">
                            {status.description}
                        </p>

                        {provider.review_note && (
                            <p className="mt-2 rounded-lg border border-[#F5A623]/30 bg-[#F5A623]/10 px-4 py-3 text-sm text-[#B7791F]">
                                <span className="font-medium">Reviewer note:</span> {provider.review_note}
                            </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-3">
                            <Link
                                href={links.editProfile}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#0E7C7B] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c6a69]"
                            >
                                Edit profile
                            </Link>
                            {status.isPublic && links.publicProfile && (
                                <Link
                                    href={links.publicProfile}
                                    className="inline-flex items-center gap-2 rounded-lg border border-[#DED7C9] px-4 py-2 text-sm font-medium text-[#16302F] transition hover:bg-[#F7F3EC]"
                                >
                                    View public profile
                                </Link>
                            )}
                            <Link
                                href={links.directory}
                                className="inline-flex items-center gap-2 rounded-lg border border-[#DED7C9] px-4 py-2 text-sm font-medium text-[#16302F] transition hover:bg-[#F7F3EC]"
                            >
                                Browse directory
                            </Link>
                        </div>
                    </div>

                    {/* Stats cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm">
                            <span className="text-2xl font-semibold text-[#16302F]">{stats.supportAreas}</span>
                            <span className="block text-sm text-[#5B6B6E]">Areas of support</span>
                        </div>
                        <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm">
                            <span className="text-2xl font-semibold text-[#16302F]">{stats.languages}</span>
                            <span className="block text-sm text-[#5B6B6E]">Languages spoken</span>
                        </div>
                        <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm">
                            <span className="text-2xl font-semibold text-[#16302F]">{stats.populations}</span>
                            <span className="block text-sm text-[#5B6B6E]">Populations served</span>
                        </div>
                    </div>

                    {/* Completeness card */}
                    {/* <div className="mb-6 rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="font-serif text-sm font-semibold text-[#16302F]">Profile completeness</h2>
                            <span className="text-sm font-medium text-[#0E7C7B]">{completeness.percent}%</span>
                        </div>
                        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#E2DACB]">
                            <div
                                className="h-full rounded-full bg-[#0E7C7B] transition-all duration-500"
                                style={{ width: `${completeness.percent}%` }}
                            />
                        </div>
                        <p className="mt-2 text-xs text-[#5B6B6E]">
                            {completeness.done} of {completeness.total} sections complete
                        </p>
                        {completeness.missing.length > 0 && (
                            <div className="mt-4">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">
                                    Still to complete
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {completeness.missing.map((item) => (
                                        <span key={item} className="inline-flex items-center rounded-full bg-[#F1EDE3] px-3 py-1 text-xs text-[#5B6B6E]">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                                <Link href={links.editProfile} className="mt-4 inline-block text-sm font-medium text-[#0E7C7B] hover:underline">
                                    Complete your profile →
                                </Link>
                            </div>
                        )}
                    </div> */}

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
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">Professional Titles</h3>
                                    <BadgeList items={professionalTitles} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">Treatment Approaches</h3>
                                    <BadgeList items={treatmentApproaches} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">Specialized Training</h3>
                                    <BadgeList items={specializedTraining} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">Certifications</h3>
                                    <BadgeList items={certifications} />
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Areas of Support & Populations">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">Areas of Support</h3>
                                    <BadgeList items={areasOfSupport} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">Populations Served</h3>
                                    <BadgeList items={populationsServed} />
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Languages & Cultural Identity">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">Languages</h3>
                                    <BadgeList items={languages} />
                                </div>
                                <InfoRow label="Caribbean Identity" value={provider.caribbean_identity} />
                                <InfoRow label="Caribbean Experience" value={provider.caribbean_experience} />
                            </div>
                        </SectionCard>

                        <SectionCard title="Service Information">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">Service Formats</h3>
                                    <BadgeList items={serviceFormats} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">Practice Settings</h3>
                                    <BadgeList items={practiceSettings} />
                                </div>
                                <InfoRow label="Session Format" value={stats.sessionFormat} />
                            </div>
                        </SectionCard>

                        <SectionCard title="Location & Telehealth">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">Address</h3>
                                    {provider.hide_address ? (
                                        <p className="text-sm text-[#5B6B6E]">Hidden from public view</p>
                                    ) : (
                                        <p className="text-sm text-[#16302F]">
                                            {[provider.address, provider.city, provider.state_province, provider.country]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                    )}
                                </div>
                                <InfoRow label="Multiple Locations" value={provider.multiple_locations} />
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">Telehealth Regions</h3>
                                    <BadgeList items={telehealthRegions} />
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Payment & Insurance">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">Payment Methods</h3>
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
                                    <h3 className="text-xs font-medium uppercase tracking-wide text-[#5B6B6E]">License States/Countries</h3>
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
