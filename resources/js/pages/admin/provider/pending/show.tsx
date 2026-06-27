import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Bahali Emotional Wellness Directory — Provider Profile (front-end show page)
 * ---------------------------------------------------------------------------
 * Stack: Laravel 12 + Inertia.js + React + TypeScript + Tailwind CSS.
 *
 * Goal: feel warm, trustworthy, and culturally grounded — a supportive
 * introduction rather than a sterile healthcare listing. Fully responsive:
 * a two-column layout on desktop (story on the left, an at-a-glance + contact
 * rail on the right) that collapses to a single scannable column on mobile,
 * with a sticky "Reach out" bar pinned to the bottom on small screens.
 *
 * Trust signals:
 *   • "Verified by Bahali"        — licensure manually confirmed.
 *   • "Caribbean-Informed Care"   — demonstrated experience serving Caribbean
 *                                    communities.
 *
 * The component renders standalone with the sample provider below; in the app,
 * pass a real `provider` prop from the controller.
 * --------------------------------------------------------------------------- */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Provider {
    name: string;
    credentials?: string; // e.g. "LMHC, LCSW"
    title?: string; // e.g. "Licensed Mental Health Counselor"
    pronouns?: string;
    photo?: string;
    verifiedByBahali?: boolean;
    verifiedOn?: string; // human date
    caribbeanInformed?: boolean;
    acceptingClients?: boolean;
    tagline?: string;
    bio: string;
    location?: { city?: string; region?: string; country?: string };
    servesRemotely?: boolean;
    regionsServed?: string[];
    languages?: string[];
    sessionFormats?: string[]; // "In-person", "Video", "Phone"
    areasOfSupport?: string[];
    populations?: string[];
    culturalApproach?: string;
    yearsExperience?: string;
    feeRange?: string;
    slidingScale?: boolean;
    insurances?: string[];
    accessibility?: string[];
    email?: string;
    phone?: string;
    website?: string;
}

interface PageProps {
    provider?: Provider;
}

/* ------------------------------------------------------------------ */
/*  Sample data (replace with controller prop)                         */
/* ------------------------------------------------------------------ */

const SAMPLE: Provider = {
    name: 'Dr. Marsha Smith',
    credentials: 'PhD, LMHC',
    title: 'Licensed Mental Health Counselor',
    pronouns: 'she/her',
    photo: '', // /images/providers/marsha.jpg
    verifiedByBahali: true,
    verifiedOn: 'May 2026',
    caribbeanInformed: true,
    acceptingClients: true,
    tagline: 'Helping Caribbean families carry what they’ve held in silence.',
    bio: `I’m a Kingston-born counselor who has spent the last fifteen years walking alongside Caribbean individuals and families — both at home and across the diaspora — as they make sense of grief, migration, anxiety, and the quiet weight of expectation.

So much of our healing lives in the things we don’t say out loud. My work is to make room for those things gently, in a way that honors where you come from rather than asking you to leave it at the door. Whether you’re navigating life between two countries, carrying family history that still echoes, or simply tired of holding it all together, you’re welcome here.

Sessions move at your pace. There’s no rush, no judgment — just a steady, culturally grounded space to breathe and begin.`,
    location: { city: 'Kingston', region: 'Kingston Parish', country: 'Jamaica' },
    servesRemotely: true,
    regionsServed: ['Jamaica', 'Trinidad & Tobago', 'United States (diaspora)', 'United Kingdom (diaspora)'],
    languages: ['English', 'Jamaican Patois'],
    sessionFormats: ['In-person', 'Video', 'Phone'],
    areasOfSupport: [
        'Anxiety & stress',
        'Grief & loss',
        'Trauma & PTSD',
        'Migration & diaspora stress',
        'Family & relationships',
        'Identity & belonging',
        'Depression',
    ],
    populations: ['Adults', 'Teens (14+)', 'Couples', 'Families', 'Faith communities'],
    culturalApproach: `Culture isn’t a footnote in my practice — it’s the ground we stand on. I weave an understanding of Caribbean family structures, faith, folk wisdom, and the realities of migration into the care I offer, so you never have to translate yourself to be understood.`,
    yearsExperience: '15+ years',
    feeRange: 'US $80–$120 / session',
    slidingScale: true,
    insurances: ['Self-pay', 'Sliding scale available', 'Some regional plans'],
    accessibility: ['Wheelchair-accessible office', 'Evening appointments', 'Telehealth across time zones'],
    email: 'hello@example.com',
    phone: '+1 (876) 555-0142',
    website: 'https://example.com',
};

/* ------------------------------------------------------------------ */
/*  Icons (inline, brand-consistent)                                   */
/* ------------------------------------------------------------------ */

const I = {
    pin: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.96 11.96 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />,
    globe: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.5-2.4 4-5.7 4-9s-1.5-6.6-4-9c-2.5 2.4-4 5.7-4 9s1.5 6.6 4 9ZM3.6 9h16.8M3.6 15h16.8" />,
    chat: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />,
    video: <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h7.5a2.25 2.25 0 0 0 2.25-2.25V7.5a2.25 2.25 0 0 0-2.25-2.25h-7.5A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />,
    clock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    language: <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h6M3.75 5.25h6m-3-1.5v1.5m-1.5 0a11.96 11.96 0 0 1-3.598 6.65m0 0A11.99 11.99 0 0 1 5.25 9.6m-2.348 5.15a11.96 11.96 0 0 0 5.448-3.6" />,
    wallet: <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />,
    access: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />,
    heart: <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />,
    web: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-8.716-6.747h17.432M3.284 9.747h17.432M12 3a13.5 13.5 0 0 0 0 18 13.5 13.5 0 0 0 0-18Z" />,
    back: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />,
};

function Icon({ d, className = 'h-5 w-5' }: { d: JSX.Element; className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden>
            {d}
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Avatar with branded placeholder                                    */
/* ------------------------------------------------------------------ */

function Avatar({ src, name, className = '' }: { src?: string; name: string; className?: string }) {
    const [failed, setFailed] = useState(!src);
    const initials = name.replace(/^Dr\.?\s+/i, '').split(' ').map((p) => p[0]).slice(0, 2).join('');
    return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#0E4C4B] to-[#0E7C7B] ${className}`}>
            <svg viewBox="0 0 200 200" className="absolute -right-6 -top-6 h-3/4 w-3/4 text-white/10" fill="none" aria-hidden>
                {[80, 58, 36].map((r) => <circle key={r} cx="100" cy="100" r={r} stroke="currentColor" strokeWidth="2" />)}
            </svg>
            {!failed && src ? (
                <img src={src} alt={name} onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
                <span className="absolute inset-0 flex items-center justify-center font-serif text-white/90">
                    <span className="text-[2.5rem] sm:text-5xl">{initials}</span>
                </span>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Badges                                                             */
/* ------------------------------------------------------------------ */

function VerifiedBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0E7C7B]/12 px-3 py-1 text-xs font-semibold text-[#0E6B6A] ring-1 ring-inset ring-[#0E7C7B]/20">
            <Icon d={I.shield} className="h-3.5 w-3.5" />
            Verified by Bahali
        </span>
    );
}

function CaribbeanBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8B84B]/18 px-3 py-1 text-xs font-semibold text-[#9A6B12] ring-1 ring-inset ring-[#E8B84B]/40">
            <Icon d={I.globe} className="h-3.5 w-3.5" />
            Caribbean-Informed Care
        </span>
    );
}

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="border-t border-[#EAE3D5] pt-7">
            <h2 className="font-serif text-xl text-[#16302F] sm:text-2xl">{title}</h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

function Pills({ items, tone = 'teal' }: { items: string[]; tone?: 'teal' | 'sand' }) {
    const cls =
        tone === 'teal'
            ? 'border-[#0E7C7B]/20 bg-[#0E7C7B]/8 text-[#155E5D]'
            : 'border-[#E7E0D2] bg-[#FBF8F2] text-[#3A4B49]';
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((it) => (
                <span key={it} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${cls}`}>
                    {it}
                </span>
            ))}
        </div>
    );
}

function FactRow({ icon, label, children }: { icon: JSX.Element; label: string; children: React.ReactNode }) {
    return (
        <div className="flex gap-3 py-3.5">
            <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#0E7C7B]/10 text-[#0E7C7B]">
                <Icon d={icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8A9795]">{label}</p>
                <div className="mt-0.5 text-sm text-[#2C3B39]">{children}</div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProviderShow({ provider = SAMPLE }: PageProps) {
    const p = provider;
    const firstName = p.name.replace(/^(Dr|Mr|Mrs|Ms|Mx)\.?\s+/i, '').split(' ')[0];
    const locationLine = [p.location?.city, p.location?.region, p.location?.country].filter(Boolean).join(', ');
    const formatIcon = (f: string) =>
        /person|office/i.test(f) ? I.pin : /video/i.test(f) ? I.video : I.phone;

    return (
        <>
            <Head title={`${p.name}${p.credentials ? ', ' + p.credentials : ''} — Bahali Wellness Directory`}>
                <meta name="description" content={p.tagline || `${p.name} — a culturally grounded wellness provider on the Bahali directory.`} />
            </Head>

            <div className="min-h-screen bg-[#F7F3EC] pb-24 text-[#1F2A2E] antialiased lg:pb-0">
                {/* ---- Top nav ---- */}
                <nav className="bg-[#0a3a39] text-white">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
                        <a href="https://bahali.org" className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8B84B] font-serif text-base font-bold text-[#0E4C4B]">B</span>
                            <span className="font-serif text-lg">Bahali</span>
                        </a>
                        <Link href="/directory" className="inline-flex items-center gap-2 text-sm font-medium text-white/85 transition hover:text-white">
                            <Icon d={I.back} className="h-4 w-4" />
                            <span className="hidden sm:inline">Back to directory</span>
                            <span className="sm:hidden">Directory</span>
                        </Link>
                    </div>
                </nav>

                {/* ---- Profile header ---- */}
                <header className="relative overflow-hidden bg-[#FBF8F2]">
                    {/* ambient circle motif */}
                    <svg viewBox="0 0 400 400" className="pointer-events-none absolute -right-20 -top-24 h-[420px] w-[420px] text-[#0E7C7B]/[0.06]" fill="none" aria-hidden>
                        {[180, 142, 104, 66].map((r) => <circle key={r} cx="200" cy="200" r={r} stroke="currentColor" strokeWidth="2" />)}
                    </svg>

                    <div className="relative mx-auto max-w-5xl px-5 py-8 sm:py-10">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                            <Avatar src={p.photo} name={p.name} className="h-28 w-28 flex-shrink-0 rounded-2xl shadow-md ring-4 ring-white sm:h-36 sm:w-36" />

                            <div className="min-w-0 flex-1">
                                {/* badges */}
                                <div className="mb-3 flex flex-wrap gap-2">
                                    {p.verifiedByBahali && <VerifiedBadge />}
                                    {p.caribbeanInformed && <CaribbeanBadge />}
                                </div>

                                <h1 className="font-serif text-3xl leading-tight text-[#16302F] sm:text-4xl">
                                    {p.name}
                                    {p.credentials && <span className="ml-2 align-middle text-lg font-normal text-[#5B6B6E] sm:text-xl">{p.credentials}</span>}
                                </h1>

                                <p className="mt-1 text-[#5B6B6E]">
                                    {p.title}
                                    {p.pronouns && <span className="text-[#9AA7A5]"> · {p.pronouns}</span>}
                                </p>

                                {locationLine && (
                                    <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#5B6B6E]">
                                        <Icon d={I.pin} className="h-4 w-4 text-[#0E7C7B]" />
                                        {locationLine}
                                        {p.servesRemotely && <span className="text-[#9AA7A5]"> · also available online</span>}
                                    </p>
                                )}

                                {p.acceptingClients && (
                                    <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0E7C7B]/10 px-3.5 py-1.5 text-sm font-semibold text-[#0E6B6A]">
                                        <span className="h-2 w-2 rounded-full bg-[#0E7C7B]" />
                                        Accepting new clients
                                    </p>
                                )}
                            </div>
                        </div>

                        {p.tagline && (
                            <p className="mt-7 max-w-2xl font-serif text-lg italic text-[#2C4746] sm:text-xl">“{p.tagline}”</p>
                        )}
                    </div>
                </header>

                {/* ---- Body ---- */}
                <main className="mx-auto max-w-5xl px-5 py-10">
                    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
                        {/* ===== Left: the story ===== */}
                        <div className="space-y-8">
                            {/* About */}
                            <section>
                                <h2 className="font-serif text-xl text-[#16302F] sm:text-2xl">A little about me</h2>
                                <div className="mt-4 space-y-4 leading-relaxed text-[#3A4B49]">
                                    {p.bio.split('\n\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            </section>

                            {p.areasOfSupport?.length ? (
                                <Section title="How I can support you">
                                    <Pills items={p.areasOfSupport} tone="teal" />
                                </Section>
                            ) : null}

                            {p.populations?.length ? (
                                <Section title="Who I work with">
                                    <Pills items={p.populations} tone="sand" />
                                </Section>
                            ) : null}

                            {(p.culturalApproach || p.languages?.length) && (
                                <Section title="Culture & language in my care">
                                    {p.culturalApproach && <p className="leading-relaxed text-[#3A4B49]">{p.culturalApproach}</p>}
                                    {p.languages?.length ? (
                                        <div className="mt-4">
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8A9795]">Languages spoken</p>
                                            <Pills items={p.languages} tone="teal" />
                                        </div>
                                    ) : null}
                                </Section>
                            )}

                            {(p.sessionFormats?.length || p.regionsServed?.length) && (
                                <Section title="How we’ll work together">
                                    {p.sessionFormats?.length ? (
                                        <div className="flex flex-wrap gap-3">
                                            {p.sessionFormats.map((f) => (
                                                <span key={f} className="inline-flex items-center gap-2 rounded-xl border border-[#E7E0D2] bg-white px-4 py-2.5 text-sm font-medium text-[#2C3B39] shadow-sm">
                                                    <span className="text-[#0E7C7B]"><Icon d={formatIcon(f)} className="h-4 w-4" /></span>
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                    {p.servesRemotely && p.regionsServed?.length ? (
                                        <p className="mt-4 text-sm text-[#5B6B6E]">
                                            <span className="font-semibold text-[#3A4B49]">Available online across: </span>
                                            {p.regionsServed.join(' · ')}
                                        </p>
                                    ) : null}
                                </Section>
                            )}
                        </div>

                        {/* ===== Right: at-a-glance + contact ===== */}
                        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
                            {/* At a glance */}
                            <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm">
                                <h3 className="font-serif text-lg text-[#16302F]">At a glance</h3>
                                <div className="mt-1 divide-y divide-[#F0EBE0]">
                                    {p.sessionFormats?.length ? (
                                        <FactRow icon={I.chat} label="Session format">{p.sessionFormats.join(' · ')}</FactRow>
                                    ) : null}
                                    {p.languages?.length ? (
                                        <FactRow icon={I.language} label="Languages">{p.languages.join(', ')}</FactRow>
                                    ) : null}
                                    {p.yearsExperience ? (
                                        <FactRow icon={I.clock} label="Experience">{p.yearsExperience}</FactRow>
                                    ) : null}
                                    {locationLine ? (
                                        <FactRow icon={I.pin} label="Based in">{locationLine}</FactRow>
                                    ) : null}
                                </div>
                            </div>

                            {/* Fees & payment */}
                            {(p.feeRange || p.insurances?.length || p.slidingScale) && (
                                <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm">
                                    <h3 className="font-serif text-lg text-[#16302F]">Fees & payment</h3>
                                    <div className="mt-3 space-y-3 text-sm text-[#2C3B39]">
                                        {p.feeRange && (
                                            <p className="flex items-center gap-2">
                                                <span className="text-[#0E7C7B]"><Icon d={I.wallet} className="h-5 w-5" /></span>
                                                <span className="font-semibold">{p.feeRange}</span>
                                            </p>
                                        )}
                                        {p.slidingScale && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8B84B]/18 px-3 py-1 text-xs font-semibold text-[#9A6B12]">
                                                <Icon d={I.heart} className="h-3.5 w-3.5" /> Sliding scale available
                                            </span>
                                        )}
                                        {p.insurances?.length ? (
                                            <ul className="mt-1 space-y-1 text-[#5B6B6E]">
                                                {p.insurances.map((ins) => (
                                                    <li key={ins} className="flex items-start gap-2">
                                                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0E7C7B]/50" />
                                                        {ins}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : null}
                                    </div>
                                </div>
                            )}

                            {/* Accessibility */}
                            {p.accessibility?.length ? (
                                <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm">
                                    <h3 className="flex items-center gap-2 font-serif text-lg text-[#16302F]">
                                        <span className="text-[#0E7C7B]"><Icon d={I.access} className="h-5 w-5" /></span>
                                        Accessibility
                                    </h3>
                                    <ul className="mt-3 space-y-2 text-sm text-[#5B6B6E]">
                                        {p.accessibility.map((a) => (
                                            <li key={a} className="flex items-start gap-2">
                                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0E7C7B]/50" />
                                                {a}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            {/* Contact card (desktop) */}
                            <div className="hidden rounded-2xl border border-[#0E7C7B]/20 bg-gradient-to-br from-[#0E4C4B] to-[#0E7C7B] p-5 text-white shadow-md lg:block">
                                <h3 className="font-serif text-lg">Reach out to {firstName}</h3>
                                <p className="mt-1 text-sm text-[#CDE6E4]">Taking the first step is the hardest part. A short message is enough.</p>
                                <a
                                    href={p.email ? `mailto:${p.email}` : '#'}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#E8B84B] px-5 py-3 text-sm font-semibold text-[#0E4C4B] transition hover:bg-[#dca936]"
                                >
                                    <Icon d={I.chat} className="h-4 w-4" /> Send a message
                                </a>
                                <div className="mt-4 space-y-2 border-t border-white/15 pt-4 text-sm">
                                    {p.phone && (
                                        <a href={`tel:${p.phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-2 text-[#CDE6E4] transition hover:text-white">
                                            <Icon d={I.phone} className="h-4 w-4" /> {p.phone}
                                        </a>
                                    )}
                                    {p.website && (
                                        <a href={p.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#CDE6E4] transition hover:text-white">
                                            <Icon d={I.web} className="h-4 w-4" /> Visit website
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Verified note */}
                            {p.verifiedByBahali && (
                                <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-[#8A9795]">
                                    <span className="mt-0.5 text-[#0E7C7B]"><Icon d={I.shield} className="h-4 w-4" /></span>
                                    Licensure manually confirmed by the Bahali team{p.verifiedOn ? ` in ${p.verifiedOn}` : ''}. Profiles are reviewed before going live and renewed annually.
                                </p>
                            )}
                        </aside>
                    </div>
                </main>

                {/* ---- Footer ---- */}
                <footer className="border-t border-[#EAE3D5] bg-[#FBF8F2]">
                    <div className="mx-auto max-w-5xl px-5 py-6 text-center text-xs text-[#8A9795]">
                        Listings on the Bahali directory are informational and not a clinical endorsement. In an emergency, contact your local crisis line.
                    </div>
                </footer>

                {/* ---- Sticky mobile contact bar ---- */}
                <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E7E0D2] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
                    <div className="mx-auto flex max-w-5xl items-center gap-3">
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-serif text-sm text-[#16302F]">{p.name}</p>
                            {p.acceptingClients && <p className="text-xs text-[#0E7C7B]">Accepting new clients</p>}
                        </div>
                        <a
                            href={p.email ? `mailto:${p.email}` : '#'}
                            className="inline-flex items-center gap-2 rounded-full bg-[#C2543B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#aa482f]"
                        >
                            <Icon d={I.chat} className="h-4 w-4" /> Reach out
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
