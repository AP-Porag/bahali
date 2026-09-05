import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const SERIF = { fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' };
const has = (a) => Array.isArray(a) && a.length > 0;

function initials(name = '') {
    return name.replace(/^Dr\.?\s+/i, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'B';
}

function Chip({ children, tone = 'teal' }) {
    const tones = {
        teal: 'bg-[#e7f0ee] text-[#0F5E58]',
        amber: 'bg-[#f6ecd0] text-[#8a6d1f]',
        plain: 'bg-[#efeadd] text-[#6b6555]',
    };
    return <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${tones[tone]}`}>{children}</span>;
}

function Group({ title, children }) {
    return (
        <div className="mb-5 last:mb-0">
            <p className="text-xs font-medium uppercase tracking-wide text-[#8a836f]">{title}</p>
            <div className="mt-2">{children}</div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <section className="rounded-2xl border border-[#ece3d3] bg-white p-6 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#c56a4b]">{title}</h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

function ChipRow({ items }) {
    return <div className="flex flex-wrap gap-2">{items.map((x) => <Chip key={x}>{x}</Chip>)}</div>;
}

function VerifiedBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F5E58]/12 px-3 py-1 text-xs font-semibold text-[#0F5E58] ring-1 ring-inset ring-[#0F5E58]/20">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
                <path d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verified by Bahali
        </span>
    );
}

function FactRow({ label, children }) {
    return (
        <div className="flex flex-col gap-0.5 border-b border-[#f0eadd] py-3 last:border-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8a836f]">{label}</p>
            <div className="text-sm text-[#33302a]">{children}</div>
        </div>
    );
}

export default function ProviderProfile({ provider }) {
    const p = provider || {};
    const [imgError, setImgError] = useState(false);

    const firstName = (p.name || '').replace(/^(Dr|Mr|Mrs|Ms|Mx)\.?\s+/i, '').split(' ')[0] || 'this provider';
    const websiteHref = p.contact?.website
        ? (p.contact.website.startsWith('http') ? p.contact.website : `https://${p.contact.website}`)
        : null;
    const telHref = p.contact?.phone ? `tel:${String(p.contact.phone).replace(/[^+\d]/g, '')}` : null;
    const showPhoto = p.photo && !imgError;

    // Primary contact action for the mobile bar.
    const primaryHref = telHref || websiteHref || null;

    return (
        <div className="min-h-screen bg-[#f7f2e8] pb-24 text-[#23201a] lg:pb-0">
            <Head title={`${p.name} — Bahali`} />
            <Header />

            <header className="border-b border-[#ece3d3] bg-[#fbf7f0]">
                <div className="mx-auto max-w-5xl px-5 py-4">
                    <Link
                        href="/provider"
                        className="inline-flex items-center gap-1.5 rounded-lg text-sm text-[#0F5E58] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E58]/40"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M10.5 19.5 3 12l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Back to directory
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-5 py-8">
                {/* ---- Profile header ---- */}
                <div className="rounded-2xl border border-[#ece3d3] bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-start gap-5 sm:flex-row">
                        {showPhoto ? (
                            <img
                                src={p.photo}
                                alt={p.name}
                                onError={() => setImgError(true)}
                                className="h-24 w-24 flex-shrink-0 rounded-2xl object-cover ring-1 ring-black/5"
                            />
                        ) : (
                            <div
                                aria-hidden
                                className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0d4a45] to-[#0F5E58] text-2xl font-semibold text-white/90"
                                style={SERIF}
                            >
                                {initials(p.name)}
                            </div>
                        )}

                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap gap-2">
                                <VerifiedBadge />
                                {p.caribbeanExperience && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8B84B]/18 px-3 py-1 text-xs font-semibold text-[#9A6B12] ring-1 ring-inset ring-[#E8B84B]/40">
                                        Caribbean-informed care
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl text-[#1f2b28]" style={SERIF}>
                                {p.name}
                                {p.credentials && <span className="ml-2 align-middle text-lg font-normal text-[#6b6555]">{p.credentials}</span>}
                            </h1>
                            {p.title && <p className="mt-1 text-[#6b6555]">{p.title}</p>}
                            {p.location && <p className="mt-1 text-sm text-[#8a836f]">{p.location}</p>}

                            <div className="mt-3 flex flex-wrap gap-2">
                                {p.sessionFormat && p.sessionFormat !== 'Not specified' && <Chip>{p.sessionFormat}</Chip>}
                            </div>

                            {p.acceptingNewClients === true && (
                                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0F5E58]/10 px-3.5 py-1.5 text-sm font-semibold text-[#0F5E58]">
                                    <span className="h-2 w-2 rounded-full bg-[#0F5E58]" /> Accepting new clients
                                </p>
                            )}
                            {p.acceptingNewClients === false && (
                                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#efeadd] px-3.5 py-1.5 text-sm text-[#6b6555]">
                                    <span className="h-2 w-2 rounded-full bg-[#c9c3b3]" /> Not currently accepting new clients
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ---- Body: story + rail ---- */}
                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                    {/* LEFT */}
                    <div className="grid grid-cols-1 gap-6">
                        {(p.bio || p.yearsExperience) && (
                            <Section title="About">
                                {p.yearsExperience && (
                                    <Group title="Years of experience">
                                        <p className="text-[15px] text-[#33302a]">{p.yearsExperience}</p>
                                    </Group>
                                )}
                                {p.bio && <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#33302a]">{p.bio}</p>}
                            </Section>
                        )}

                        {has(p.supportAreas) && (
                            <Section title="Areas of Support">
                                <div className="space-y-4">
                                    {p.supportAreas.map((g) => (
                                        <div key={g.category}>
                                            <p className="text-sm font-semibold text-[#33302a]">{g.category}</p>
                                            <div className="mt-2"><ChipRow items={g.areas} /></div>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {has(p.populations) && <Section title="Populations Served"><ChipRow items={p.populations} /></Section>}

                        {(has(p.treatmentApproaches) || has(p.specializedTraining) || has(p.certifications) || p.culturalApproach) && (
                            <Section title="Approach & Expertise">
                                {has(p.treatmentApproaches) && <Group title="Treatment approaches"><ChipRow items={p.treatmentApproaches} /></Group>}
                                {has(p.specializedTraining) && <Group title="Specialized training"><ChipRow items={p.specializedTraining} /></Group>}
                                {has(p.certifications) && <Group title="Certifications"><ChipRow items={p.certifications} /></Group>}
                                {p.culturalApproach && <Group title="Cultural approach"><p className="text-[15px] leading-relaxed text-[#33302a]">{p.culturalApproach}</p></Group>}
                            </Section>
                        )}

                        {(p.sessionFormat || has(p.practiceSettings) || has(p.telehealthRegions) || p.servesMultiple) && (
                            <Section title="Service & Availability">
                                {p.sessionFormat && p.sessionFormat !== 'Not specified' && (
                                    <Group title="Session format"><p className="text-[15px] text-[#33302a]">{p.sessionFormat}</p></Group>
                                )}
                                {p.servesMultiple && <Group title="Locations"><p className="text-[15px] text-[#33302a]">Serves multiple locations</p></Group>}
                                {has(p.telehealthRegions) && <Group title="Available online across"><ChipRow items={p.telehealthRegions} /></Group>}
                                {has(p.practiceSettings) && <Group title="Practice settings"><ChipRow items={p.practiceSettings} /></Group>}
                            </Section>
                        )}

                        {has(p.languages) && <Section title="Languages"><ChipRow items={p.languages} /></Section>}
                        {has(p.accessibility) && <Section title="Accessibility"><ChipRow items={p.accessibility} /></Section>}
                    </div>

                    {/* RIGHT rail */}
                    <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                        {/* Fees & payment */}
                        {(p.fee || p.slidingScale || has(p.payment?.methods) || has(p.payment?.insurance)) && (
                            <div className="rounded-2xl border border-[#ece3d3] bg-white p-5 shadow-sm">
                                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#c56a4b]">Insurance & Payment</h3>
                                <div className="mt-4 space-y-3">
                                    {p.fee && <p className="text-[15px] font-semibold text-[#1f2b28]">{p.fee}</p>}
                                    {p.slidingScale && <Chip tone="amber">Sliding scale available</Chip>}

                                    {has(p.payment?.methods) && (
                                        <div>
                                            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#8a836f]">Accepted methods</p>
                                            <ChipRow items={p.payment.methods} />
                                        </div>
                                    )}

                                    {has(p.payment?.insurance) && (
                                        <div>
                                            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#8a836f]">Insurance plans accepted</p>
                                            <p className="text-[15px] text-[#33302a]">{p.payment.insurance.join(', ')}</p>
                                            <p className="mt-1.5 text-xs text-[#8a836f]">Coverage varies by plan — confirm directly with the provider.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* At a glance */}
                        {(p.location || (p.sessionFormat && p.sessionFormat !== 'Not specified') || has(p.languages) || p.yearsExperience) && (
                            <div className="rounded-2xl border border-[#ece3d3] bg-white p-5 shadow-sm">
                                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#c56a4b]">At a glance</h3>
                                <div className="mt-2">
                                    {p.sessionFormat && p.sessionFormat !== 'Not specified' && <FactRow label="Session format">{p.sessionFormat}</FactRow>}
                                    {has(p.languages) && <FactRow label="Languages">{p.languages.join(', ')}</FactRow>}
                                    {p.yearsExperience && <FactRow label="Experience">{p.yearsExperience}</FactRow>}
                                    {p.location && <FactRow label="Based in">{p.location}</FactRow>}
                                </div>
                            </div>
                        )}

                        {/* Contact — the clear next step (Section 9) */}
                        {(telHref || websiteHref || has(p.contact?.social)) && (
                            <div className="rounded-2xl border border-[#0F5E58]/25 bg-gradient-to-br from-[#0d4a45] to-[#0F5E58] p-5 text-white shadow-md">
                                <h3 className="text-lg" style={SERIF}>Reach out to {firstName}</h3>
                                <p className="mt-1 text-sm text-[#cfe6e2]">Taking the first step is often the hardest part. A short message is enough.</p>

                                <div className="mt-4 space-y-2.5">
                                    {websiteHref && (

                                        <a href={websiteHref}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-3 text-sm font-semibold text-[#0d4a45] transition hover:bg-[#d9a936] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                        >
                                            Visit website & request appointment
                                        </a>
                                    )}
                                    {telHref && (

                                        <a href={telHref}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                        >
                                            Contact provider · {p.contact.phone}
                                        </a>
                                    )}
                                </div>

                                {has(p.contact?.social) && (
                                    <div className="mt-4 border-t border-white/15 pt-3 text-sm text-[#cfe6e2]">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Social</p>
                                        <p className="mt-1">{p.contact.social.join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Directory boundary (Section 9) */}
                        <p className="px-1 text-xs leading-relaxed text-[#8a836f]">
                            “Verified by Bahali” means our team confirmed this provider’s licensure. It is not a guarantee of treatment quality, fit or outcome. Bahali is a directory and discovery resource, not a clinical endorsement.
                        </p>
                    </aside>
                </div >
            </div >

            <Footer />

            {/* ---- Sticky mobile contact bar ---- */}
            {
                primaryHref && (
                    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#ece3d3] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
                        <div className="mx-auto flex max-w-5xl items-center gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-[#1f2b28]" style={SERIF}>{p.name}</p>
                                {p.acceptingNewClients === true && <p className="text-xs text-[#0F5E58]">Accepting new clients</p>}
                            </div>

                            <a href={primaryHref}
                                {...(websiteHref && !telHref ? { target: '_blank', rel: 'noreferrer' } : {})}
                                className="inline-flex items-center gap-2 rounded-full bg-[#c56a4b] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b25a3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c56a4b]/50"
                            >
                                {telHref ? 'Contact' : 'Visit website'}
                            </a>
                        </div>
                    </div >
                )
            }
        </div >
    );
}
