import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const SERIF = { fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' };
const has = (a) => Array.isArray(a) && a.length > 0;

function initials(name = '') {
    return name.replace(/^Dr\.?\s+/i, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'B';
}
function normHref(url) { return url ? (url.startsWith('http') ? url : `https://${url}`) : null; }

/* ---------------------------------- icons ---------------------------------- */
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
};
function Icon({ d, className = 'h-4 w-4' }) {
    return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{d}</svg>;
}

function Chip({ children }) {
    return <span className="inline-flex items-center rounded-full bg-[#EFEAE0] px-3 py-1 text-sm text-[#5B6B6E]">{children}</span>;
}
function ChipRow({ items }) { return <div className="flex flex-wrap gap-2">{items.map((x) => <Chip key={x}>{x}</Chip>)}</div>; }

/* ------------------------- Availability box (guide §5) ------------------------- */
function AvailabilityBox({ availability, confirmedAt }) {
    if (availability === 'accepting') {
        return (
            <div className="rounded-xl border border-[#0E7C7B]/20 bg-[#0E7C7B]/8 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0E6B6A]">Current availability</p>
                <p className="mt-1.5 flex items-center gap-2 font-semibold text-[#15403F]"><Icon d={Ico.check} className="h-5 w-5 text-[#0E7C7B]" /> Accepting new clients</p>
                {confirmedAt && <p className="mt-0.5 text-sm text-[#5B6B6E]">Last confirmed: {confirmedAt}</p>}
                <p className="mt-1 text-xs italic text-[#8A9795]">This information is provided by the provider.</p>
            </div>
        );
    }
    if (availability === 'not_accepting') {
        return (
            <div className="rounded-xl border border-[#DED7C9] bg-[#FBF8F2] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8A9795]">Current availability</p>
                <p className="mt-1.5 flex items-center gap-2 font-semibold text-[#5B6B6E]"><Icon d={Ico.minus} className="h-5 w-5" /> Not currently accepting new clients</p>
                {confirmedAt && <p className="mt-0.5 text-sm text-[#8A9795]">Last confirmed: {confirmedAt}</p>}
            </div>
        );
    }
    return (
        <div className="rounded-xl border border-[#E8B84B]/40 bg-[#E8B84B]/12 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9A6B12]">Current availability</p>
            <p className="mt-1.5 flex items-center gap-2 font-semibold text-[#9A6B12]"><Icon d={Ico.question} className="h-5 w-5" /> Availability unknown</p>
            <p className="mt-0.5 text-sm text-[#8A6D3B]">Contact the provider directly to confirm current availability.</p>
        </div>
    );
}

/* ----------------- Contact methods (shared by panel + mobile modal) ----------------- */
function contactMethods(provider) {
    const c = provider.contact || {};
    return [
        c.booking && { icon: Ico.calendar, label: 'Book a consultation', sub: "Opens the provider's scheduling site", href: normHref(c.booking), external: true },
        c.email && { icon: Ico.mail, label: 'Email provider', sub: 'Opens your email app', href: `mailto:${c.email}` },
        c.phone && { icon: Ico.phone, label: 'Call provider', sub: c.phone, href: `tel:${String(c.phone).replace(/[^+\d]/g, '')}` },
        c.website && { icon: Ico.globe, label: 'Visit website', sub: 'Opens in a new tab', href: normHref(c.website), external: true },
    ].filter(Boolean);
}

function MethodRow({ m }) {
    return (
        <a href={m.href} {...(m.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="flex items-center gap-3 rounded-xl border border-[#DED7C9] bg-white px-4 py-3 transition hover:border-[#0E7C7B]/40 hover:bg-[#0E7C7B]/5">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#0E7C7B]/10 text-[#0E7C7B]"><Icon d={m.icon} className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#16302F]">{m.label}</span>
                <span className="block truncate text-xs text-[#8A9795]">{m.sub}</span>
            </span>
            {m.external && <span className="text-[#9AA6A4]"><Icon d={Ico.external} className="h-4 w-4" /></span>}
        </a>
    );
}

function CrisisNote() {
    return (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#F1EDE3] p-3 text-xs leading-relaxed text-[#6B7A78]">
            <span className="mt-0.5 text-[#0E7C7B]"><Icon d={Ico.info} className="h-4 w-4" /></span>
            <span><span className="font-semibold text-[#3A4B49]">Please note.</span> If you are in crisis or need immediate support, contact your local emergency services or a crisis helpline. Bahali is not an emergency service.</span>
        </div>
    );
}

/* ----------------- Contact panel (desktop right rail, guide §5 mockup) ----------------- */
function ContactPanel({ provider }) {
    const methods = contactMethods(provider);
    return (
        <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm">
            <h3 className="text-lg text-[#16302F]" style={SERIF}>Contact {provider.name}</h3>
            <p className="mt-1 text-sm text-[#5B6B6E]">Reach the provider directly to ask about services, availability or scheduling. Bahali does not manage appointments or communications between you and the provider.</p>
            <div className="mt-4 space-y-2.5">
                {methods.length === 0
                    ? <p className="text-sm text-[#8A9795]">This provider hasn’t listed a contact method yet.</p>
                    : methods.map((m) => <MethodRow key={m.label} m={m} />)}
            </div>
            <CrisisNote />
        </div>
    );
}

/* ----------------- Mobile contact modal ----------------- */
function ContactModal({ open, onClose, provider }) {
    if (!open) return null;
    const methods = contactMethods(provider);
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={`Contact ${provider.name}`}>
            <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
                <div className="flex items-start justify-between gap-3 border-b border-[#EFEAE0] p-5">
                    <div>
                        <h3 className="text-lg text-[#16302F]" style={SERIF}>Contact {provider.name}</h3>
                        <p className="mt-1 text-sm text-[#5B6B6E]">Reach the provider directly. Bahali does not manage appointments or communications between you and the provider.</p>
                    </div>
                    <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-[#8A9795] hover:bg-[#F1EDE3]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg></button>
                </div>
                <div className="space-y-2.5 p-5">
                    {methods.length === 0 ? <p className="text-sm text-[#8A9795]">This provider hasn’t listed a contact method yet.</p> : methods.map((m) => <MethodRow key={m.label} m={m} />)}
                    <CrisisNote />
                </div>
            </div>
        </div>
    );
}

/* --------------------------------- Page --------------------------------- */
export default function ProviderProfile({ provider }) {
    const p = provider || {};
    const [imgError, setImgError] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);

    const showPhoto = p.photo && !imgError;
    const slidingScale = (p.payment?.methods || []).includes('Sliding Scale');
    const insuranceList = has(p.payment?.insurance) ? p.payment.insurance : [];
    const hasContact = contactMethods(p).length > 0;

    const tabs = useMemo(() => {
        const t = [];
        if (p.bio || p.yearsExperience) t.push('About');
        if (has(p.supportAreas)) t.push('Areas of Support');
        if (has(p.populations)) t.push('Populations');
        if (has(p.treatmentApproaches) || has(p.specializedTraining) || has(p.certifications) || has(p.practiceSettings)) t.push('Services');
        if (p.fee || has(p.payment?.methods) || insuranceList.length) t.push('Fees & Insurance');
        if (p.culturalApproach || p.caribbeanExperience) t.push('Approach');
        if (has(p.accessibility)) t.push('Accessibility');
        return t;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [p]);
    const [tab, setTab] = useState(tabs[0] || 'About');

    const Glance = ({ d, children }) => (
        <p className="flex items-center gap-2.5 border-b border-[#F0EBE0] py-2.5 text-sm text-[#33302a] last:border-0">
            <span className="text-[#0E7C7B]"><Icon d={d} className="h-4 w-4" /></span>{children}
        </p>
    );

    return (
        <div className="min-h-screen bg-[#F7F3EC] pb-24 text-[#1F2A2E] lg:pb-0">
            <Head title={`${p.name} — Bahali`} />
            <Header />
            <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} provider={p} />

            <div className="border-b border-[#E7E0D2] bg-white/60">
                <div className="mx-auto max-w-6xl px-5 py-3">
                    <Link href="/provider" className="inline-flex items-center gap-1.5 text-sm text-[#0E7C7B] hover:underline">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M10.5 19.5 3 12l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Back to directory
                    </Link>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-5 py-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2543B]">Provider profile</p>
                <h1 className="mt-1 mb-6 text-3xl text-[#16302F]" style={SERIF}>The profile provides detail, then connects you directly to the provider.</h1>

                {/* header card */}
                <div className="rounded-2xl border border-[#E7E0D2] bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 lg:flex-row">
                        {showPhoto ? (
                            <img src={p.photo} alt={p.name} onError={() => setImgError(true)} className="h-44 w-full flex-shrink-0 rounded-2xl object-cover ring-1 ring-black/5 lg:h-44 lg:w-40" />
                        ) : (
                            <div aria-hidden className="flex h-44 w-full flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0E4C4B] to-[#0E7C7B] text-4xl font-semibold text-white/90 ring-1 ring-black/5 lg:w-40" style={SERIF}>{initials(p.name)}</div>
                        )}

                        <div className="min-w-0 flex-1">
                            {p.caribbeanExperience && (
                                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#E8B84B]/18 px-3 py-1 text-xs font-semibold text-[#9A6B12] ring-1 ring-inset ring-[#E8B84B]/40">Caribbean-informed care</span>
                            )}
                            <h2 className="text-2xl text-[#16302F]" style={SERIF}>{p.name}{p.credentials ? <span className="text-lg font-normal text-[#5B6B6E]">, {p.credentials}</span> : null}</h2>
                            {p.title && <p className="mt-0.5 text-[#5B6B6E]">{p.title}</p>}
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#3A4B49]">
                                {p.location && <span className="inline-flex items-center gap-1.5"><span className="text-[#0E7C7B]"><Icon d={Ico.pin} /></span>{p.location}</span>}
                                {p.sessionFormat && p.sessionFormat !== 'Not specified' && <span className="inline-flex items-center gap-1.5"><span className="text-[#0E7C7B]"><Icon d={Ico.monitor} /></span>{p.sessionFormat}</span>}
                            </div>
                            {has(p.languages) && <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-[#3A4B49]"><span className="text-[#0E7C7B]"><Icon d={Ico.chat} /></span>{p.languages.join(', ')}</p>}
                        </div>

                        {/* availability box */}
                        <div className="w-full flex-shrink-0 lg:w-72">
                            <AvailabilityBox availability={p.availability} confirmedAt={p.availabilityConfirmedAt} />
                        </div>
                    </div>
                </div>

                {/* body: left = tabs, right = contact panel + at a glance */}
                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
                    {/* LEFT */}
                    <div className="rounded-2xl border border-[#E7E0D2] bg-white shadow-sm">
                        <div className="flex flex-wrap gap-1 border-b border-[#EFEAE0] px-4 pt-3">
                            {tabs.map((t) => (
                                <button key={t} onClick={() => setTab(t)} className={`rounded-t-lg px-3 py-2 text-sm font-medium transition ${tab === t ? 'border-b-2 border-[#0E7C7B] text-[#16302F]' : 'text-[#5B6B6E] hover:text-[#0E7C7B]'}`}>{t}</button>
                            ))}
                        </div>
                        <div className="p-6">
                            {tab === 'About' && (
                                <div className="space-y-4">
                                    {p.yearsExperience && <p className="text-sm text-[#5B6B6E]"><span className="font-semibold text-[#3A4B49]">Experience:</span> {p.yearsExperience}</p>}
                                    {p.bio && <p className="whitespace-pre-line leading-relaxed text-[15px] text-[#33302a]">{p.bio}</p>}
                                </div>
                            )}
                            {tab === 'Areas of Support' && (
                                <div className="space-y-4">
                                    {p.supportAreas.map((g) => (
                                        <div key={g.category}>
                                            <p className="text-sm font-semibold text-[#33302a]">{g.category}</p>
                                            <div className="mt-2"><ChipRow items={g.areas} /></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {tab === 'Populations' && <ChipRow items={p.populations} />}
                            {tab === 'Services' && (
                                <div className="space-y-4">
                                    {has(p.treatmentApproaches) && <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8A9795]">Treatment approaches</p><ChipRow items={p.treatmentApproaches} /></div>}
                                    {has(p.specializedTraining) && <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8A9795]">Specialized training</p><ChipRow items={p.specializedTraining} /></div>}
                                    {has(p.certifications) && <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8A9795]">Certifications</p><ChipRow items={p.certifications} /></div>}
                                    {has(p.practiceSettings) && <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8A9795]">Practice settings</p><ChipRow items={p.practiceSettings} /></div>}
                                </div>
                            )}
                            {tab === 'Fees & Insurance' && (
                                <div className="space-y-3 text-[15px] text-[#33302a]">
                                    {p.fee && <p className="font-semibold text-[#16302F]">{p.fee}</p>}
                                    {slidingScale && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8B84B]/18 px-3 py-1 text-xs font-semibold text-[#9A6B12]"><Icon d={Ico.heart} className="h-3.5 w-3.5" /> Sliding scale available</span>}
                                    {has(p.payment?.methods) && <div><p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#8A9795]">Accepted methods</p><ChipRow items={p.payment.methods} /></div>}
                                    {insuranceList.length > 0 && (
                                        <div>
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#8A9795]">Insurance plans accepted</p>
                                            <p>{insuranceList.join(', ')}</p>
                                            <p className="mt-1.5 text-xs text-[#8A9795]">Coverage varies by plan — confirm directly with the provider.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {tab === 'Approach' && (
                                <div className="space-y-4">
                                    {p.culturalApproach && <p className="leading-relaxed text-[15px] text-[#33302a]">{p.culturalApproach}</p>}
                                    {p.caribbeanIdentity === 'yes' && <p className="text-sm text-[#5B6B6E]">Identifies as part of the Caribbean community.</p>}
                                    {p.caribbeanExperience && <p className="text-sm text-[#5B6B6E]">Experienced working with Caribbean individuals and families.</p>}
                                </div>
                            )}
                            {tab === 'Accessibility' && <ChipRow items={p.accessibility} />}
                        </div>
                    </div>

                    {/* RIGHT: contact panel + at a glance */}
                    <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                        {hasContact
                            ? <ContactPanel provider={p} />
                            : (
                                <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm">
                                    <h3 className="text-lg text-[#16302F]" style={SERIF}>Contact {p.name}</h3>
                                    <p className="mt-1 text-sm text-[#8A9795]">This provider hasn’t listed a contact method yet.</p>
                                    <CrisisNote />
                                </div>
                            )}

                        <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm">
                            <h3 className="mb-2 text-sm text-[#16302F]" style={SERIF}>At a glance</h3>
                            {p.fee && <Glance d={Ico.wallet}>{p.fee}</Glance>}
                            {insuranceList.length > 0 && <Glance d={Ico.shield}>{insuranceList.slice(0, 3).join(', ')}{insuranceList.length > 3 ? ` +${insuranceList.length - 3}` : ''} (insurance)</Glance>}
                            {slidingScale && <Glance d={Ico.heart}>Sliding scale available</Glance>}
                            {p.sessionFormat && p.sessionFormat !== 'Not specified' && <Glance d={Ico.monitor}>{p.sessionFormat}</Glance>}
                            {has(p.languages) && <Glance d={Ico.chat}>{p.languages.join(', ')}</Glance>}
                        </div>

                        <p className="px-1 text-xs leading-relaxed text-[#8A9795]">
                            Approved profiles have had their licensure confirmed by the Bahali team. This is not a guarantee of treatment quality, fit or outcome. Bahali is a directory and discovery resource, not a clinical endorsement.
                        </p>
                    </aside>
                </div>
            </div>

            <Footer />

            {/* sticky mobile contact bar */}
            {hasContact && (
                <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E7E0D2] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
                    <div className="mx-auto flex max-w-6xl items-center gap-3">
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-[#16302F]" style={SERIF}>{p.name}</p>
                            {p.availability === 'accepting' && <p className="text-xs text-[#0E7C7B]">Accepting new clients</p>}
                        </div>
                        <button onClick={() => setContactOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-[#C2543B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b25a3d]">Contact provider</button>
                    </div>
                </div>
            )}
        </div>
    );
}
