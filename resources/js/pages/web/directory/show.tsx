import { Head, Link } from '@inertiajs/react';

const SERIF = { fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' };
const has = (a) => Array.isArray(a) && a.length > 0;

function Chip({ children }) {
    return <span className="inline-flex items-center rounded-full bg-[#e7f0ee] px-3 py-1 text-sm text-[#0F5E58]">{children}</span>;
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

export default function ProviderProfile({ provider }) {
    const p = provider || {};

    return (
        <div className="min-h-screen bg-[#f7f2e8] text-[#23201a]">
            <Head title={`${p.name} — Bahali`} />

            <header className="border-b border-[#ece3d3] bg-[#fbf7f0]">
                <div className="mx-auto max-w-4xl px-5 py-4">
                    <Link href="/directory" className="text-sm text-[#0F5E58]">← Back to directory</Link>
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-5 py-8">
                <div className="rounded-2xl border border-[#ece3d3] bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-start gap-5 sm:flex-row">
                        {p.photo ? (
                            <img src={p.photo} alt={p.name} className="h-24 w-24 rounded-2xl object-cover" />
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#0F5E58] text-2xl font-semibold text-white">
                                {(p.name || 'B').split(' ').slice(0, 2).map((w) => w[0]).join('')}
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl text-[#1f2b28]" style={SERIF}>{p.name}</h1>
                            <p className="mt-1 text-[#6b6555]">{[p.title, p.credentials].filter(Boolean).join(' · ')}</p>
                            {p.location && <p className="mt-1 text-sm text-[#8a836f]">{p.location}</p>}
                            <div className="mt-3 flex flex-wrap gap-2">
                                {p.sessionFormat && <Chip>{p.sessionFormat}</Chip>}
                                {p.caribbeanExperience && <Chip>Experienced with Caribbean communities</Chip>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6">
                    {p.bio && (
                        <Section title="About">
                            {p.yearsExperience && <Group title="Years of experience"><p className="text-[15px] text-[#33302a]">{p.yearsExperience}</p></Group>}
                            <p className="text-[15px] leading-relaxed text-[#33302a]">{p.bio}</p>
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
                            {p.culturalApproach && <Group title="Cultural approach"><p className="text-[15px] text-[#33302a]">{p.culturalApproach}</p></Group>}
                        </Section>
                    )}

                    {(p.sessionFormat || has(p.practiceSettings) || has(p.telehealthRegions) || p.servesMultiple) && (
                        <Section title="Service & Availability">
                            {p.sessionFormat && <Group title="Session format"><p className="text-[15px] text-[#33302a]">{p.sessionFormat}</p></Group>}
                            {has(p.practiceSettings) && <Group title="Practice settings"><ChipRow items={p.practiceSettings} /></Group>}
                            {p.servesMultiple && <Group title="Locations"><p className="text-[15px] text-[#33302a]">Serves multiple locations</p></Group>}
                            {has(p.telehealthRegions) && <Group title="Telehealth regions"><ChipRow items={p.telehealthRegions} /></Group>}
                        </Section>
                    )}

                    {has(p.languages) && <Section title="Languages"><ChipRow items={p.languages} /></Section>}
                    {has(p.accessibility) && <Section title="Accessibility"><ChipRow items={p.accessibility} /></Section>}

                    {(has(p.payment?.methods) || has(p.payment?.insurance)) && (
                        <Section title="Insurance & Payment">
                            {has(p.payment.methods) && <Group title="Accepted methods"><ChipRow items={p.payment.methods} /></Group>}
                            {has(p.payment.insurance) && <Group title="Insurance plans accepted"><p className="text-[15px] text-[#33302a]">{p.payment.insurance.join(', ')}</p></Group>}
                        </Section>
                    )}

                    {(p.contact?.phone || p.contact?.website || has(p.contact?.social)) && (
                        <Section title="Contact">
                            {p.contact.phone && <Group title="Phone"><p className="text-[15px] text-[#33302a]">{p.contact.phone}</p></Group>}
                            {p.contact.website && (
                                <Group title="Website">
                                    <a href={p.contact.website.startsWith('http') ? p.contact.website : `https://${p.contact.website}`} target="_blank" rel="noreferrer" className="text-[15px] text-[#0F5E58] underline">
                                        {p.contact.website}
                                    </a>
                                </Group>
                            )}
                            {has(p.contact.social) && <Group title="Social"><p className="text-[15px] text-[#33302a]">{p.contact.social.join(', ')}</p></Group>}
                        </Section>
                    )}
                </div>
            </div>
        </div>
    );
}
