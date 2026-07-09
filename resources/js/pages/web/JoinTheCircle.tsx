import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { PropsWithChildren } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Bahali — Join the Circle (Provider Acquisition Landing Page)
 * ------------------------------------------------------------------
 * Stack: Laravel 12 + Inertia.js + React + TypeScript + Tailwind CSS.
 *
 * Layout follows the Psychology Today "Join" page structure — full-bleed
 * photo hero, "quick & easy" band, member-benefits grid, a referrals
 * showcase, a bold stat band, photo-led testimonials, a 2-column FAQ, and
 * a member photo mosaic with an embedded CTA — but every visual choice is
 * Bahali's: deep teal + coral + amber + warm sand, serif display type, and
 * the concentric "circle" community motif.
 *
 * Primary CTA target: the registration form route.
 * ------------------------------------------------------------------ */

const SIGNUP_ROUTE = '/provider/directory/create';

/* ------------------------------------------------------------------ */
/*  Photography slots                                                  */
/*  Drop real Caribbean / provider photography here. Each falls back   */
/*  to a branded placeholder, so the page looks intentional even empty.*/
/*  Suggested sources are Bahali's own hosted images on bahali.org —   */
/*  self-host them under /public/images/join/ for production.          */
/* ------------------------------------------------------------------ */
const IMAGES = {
    hero: '/images/join/hero.jpg',          // wide portrait of a provider / Caribbean family
    referrals: '/images/join/referrals.jpg',     // image beside "The home of Caribbean referrals" text
    testimonial: '/images/join/testimonial.jpg',   // featured provider portrait (portrait orientation)
    stat: ['/images/join/stat1.jpeg', '/images/join/stat2.jpeg', '/images/join/stat3.jpeg'],// three warm portraits for the stat band
    mosaic: ['/images/join/mosaic10.jpeg', '/images/join/mosaic2.jpeg', '/images/join/mosaic3.jpeg', '/images/join/mosaic4.jpeg', '/images/join/mosaic8.jpeg', '/images/join/mosaic6.jpeg', '/images/join/mosaic7.jpeg', '/images/join/mosaic5.jpeg', '/images/join/mosaic9.jpeg', '/images/join/mosaic1.jpeg'], // community / provider faces
};

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const BENEFITS: { title: string; body: string; icon: JSX.Element }[] = [
    {
        title: 'Found by the diaspora',
        body: 'Families on the islands and abroad search for culturally grounded care. Your listing meets them where they look.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.5-2.4 4-5.7 4-9s-1.5-6.6-4-9c-2.5 2.4-4 5.7-4 9s1.5 6.6 4 9ZM3.6 9h16.8M3.6 15h16.8" />,
    },
    {
        title: 'Culturally matched referrals',
        body: 'Seekers filter by language, identity, and lived experience, so the people best suited to your strengths find you.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.5a7.5 7.5 0 0 1 15 0v.75H4.5v-.75Z" />,
    },
    {
        title: 'A profile that holds your story',
        body: 'Bio, photo, languages, and how culture shapes your care — everything a family needs to feel safe choosing you.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6 9.75-3 3m0 0-3-3m3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />,
    },
    {
        title: 'Language-first search',
        body: 'English, Haitian Creole, Patois, French, Spanish and more — families find you in the language they heal in.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h6M3.75 5.25h6m-3-1.5v1.5m-1.5 0a11.96 11.96 0 0 1-3.598 6.65m0 0A11.99 11.99 0 0 1 5.25 9.6m-2.348 5.15a11.96 11.96 0 0 0 5.448-3.6" />,
    },
    {
        title: 'Telehealth across borders',
        body: 'Mark every region you can serve remotely. Reach clients across islands and time zones, not just your home parish.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75 12 21l9.75-8.25M2.25 7.5 12 15.75 21.75 7.5 12 3 2.25 7.5Z" />,
    },
    {
        title: 'Verified & trusted',
        body: 'Every provider is reviewed. Your license and credentials are confirmed, so families trust the circle they step into.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />,
    },
    {
        title: 'Free to be listed',
        body: 'No fees, no contracts. Bahali is a nonprofit — our aim is access to care, not gatekeeping it behind a paywall.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />,
    },
    {
        title: 'You control your listing',
        body: 'Update your bio, availability, and the regions you serve any time. Your profile grows as your practice does.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />,
    },
    {
        title: 'Community, not competition',
        body: 'Join a network built on care. We connect providers, programs, and faith leaders walking the same path with you.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />,
    },
];

const STEPS: { n: string; title: string; body: string }[] = [
    { n: '01', title: 'Tell your story', body: 'Share who you are, your credentials, the people you serve, and how culture shapes your care.' },
    { n: '02', title: 'We verify your credentials', body: 'Our team confirms your license and details so families can trust every name in the circle.' },
    { n: '03', title: 'Your listing goes live', body: 'Seekers discover you through language, identity, and area-of-support filters.' },
];

const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
    { quote: 'Being listed meant diaspora families searching in two languages could finally find someone who understood both their worlds.', name: 'Kulman Jamm', role: 'Clinical Psychologist' },
    { quote: 'The referrals are people I’m actually equipped to help. The cultural filters do real work before a client reaches my inbox.', name: 'Joanne P.', role: 'Mental Health Counselor, LMHC' },
    { quote: 'I don’t have the time or skill to market myself online. Bahali put me in front of the exact community I trained to serve.', name: 'David R.', role: 'Clinical Social Worker' },
];

const FAQS: { q: string; a: string }[] = [
    { q: 'How much does it cost to be listed?', a: 'Nothing. Bahali is a nonprofit and the directory is free for verified providers — no fees, no contracts. Our mission is widening access to culturally grounded care, not putting it behind a paywall.' },
    { q: 'Who can join the directory?', a: 'Licensed and credentialed providers, support groups, faith-based organizations, and community programs who serve Caribbean individuals and families, on the islands or in the diaspora.' },
    { q: 'Do I need to be Caribbean myself?', a: 'No. We welcome any provider with genuine experience supporting Caribbean communities. The form lets you share your background and cultural approach so seekers can decide what fits them.' },
    { q: 'Can I offer telehealth across islands?', a: 'Yes. Your profile lets you list every region you can serve remotely, so families across borders and time zones can reach you.' },
];

/* ------------------------------------------------------------------ */
/*  Brand photo placeholder + image                                    */
/* ------------------------------------------------------------------ */

const TONES: Record<string, string> = {
    teal: 'from-[#0E4C4B] to-[#0E7C7B]',
    deep: 'from-[#16302F] to-[#0E4C4B]',
    amber: 'from-[#E8B84B] to-[#d6a236]',
    coral: 'from-[#C2543B] to-[#a8472f]',
    sand: 'from-[#E3D9C4] to-[#FBF8F2]',
};

function Photo({
    src,
    alt = '',
    className = '',
    tone = 'teal',
    rounded = '',
}: {
    src?: string;
    alt?: string;
    className?: string;
    tone?: keyof typeof TONES | string;
    rounded?: string;
}) {
    const [failed, setFailed] = useState(!src);
    const toneClass = TONES[tone] ?? TONES.teal;

    return (
        <div className={`relative overflow-hidden bg-gradient-to-br ${toneClass} ${rounded} ${className}`}>
            {/* circle motif watermark */}
            <svg viewBox="0 0 300 300" className="absolute -right-10 -top-10 h-3/4 w-3/4 text-white/10" fill="none" aria-hidden>
                {[120, 92, 64, 36].map((r) => (
                    <circle key={r} cx="150" cy="150" r={r} stroke="currentColor" strokeWidth="2" />
                ))}
            </svg>

            {!failed && src && (
                <img
                    src={src}
                    alt={alt}
                    onError={() => setFailed(true)}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            )}

            {failed && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-1/3 w-1/3 text-white/25" fill="currentColor" aria-hidden>
                        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6Z" />
                    </svg>
                </span>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Small UI helpers                                                   */
/* ------------------------------------------------------------------ */

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${className}`}>{children}</p>;
}

function CoralButton({ children = 'Join the circle', large = false }: { children?: React.ReactNode; large?: boolean }) {
    return (
        <a
            href={SIGNUP_ROUTE}
            target="_blank"
            className={`group inline-flex items-center gap-2 rounded-full bg-[#C2543B] font-semibold text-white shadow-sm transition hover:bg-[#aa482f] focus:outline-none focus:ring-4 focus:ring-[#C2543B]/30 ${large ? 'px-8 py-4 text-base' : 'px-7 py-3.5 text-sm'
                }`}
        >
            {children}
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
        </a>
    );
}

function WaveTop({ color }: { color: string }) {
    return (
        <div className="pointer-events-none -mb-px overflow-hidden leading-none" aria-hidden>
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-[40px] w-full" fill={color}>
                <path d="M0,60 C360,0 1080,0 1440,60 Z" />
            </svg>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

interface PageProps {
    providerCount?: number;
    regionCount?: number;
    languageCount?: number;
}

export default function JoinTheCircle({ regionCount = 28, languageCount = 8 }: PageProps) {
    return (
        <>
            <Header />
            <Head title="Join the Circle — Become a Bahali Wellness Provider">
                <meta
                    name="description"
                    content="Everything you need to be found by Caribbean families seeking culturally grounded care. Join the Bahali Provider Directory — free for verified providers, across the islands and the diaspora."
                />
            </Head>


            <div className="min-h-screen bg-[#F7F3EC] text-[#1F2A2E] antialiased">
                {/* ===================================================== */}
                {/*  HERO — full-bleed photo                              */}
                {/* ===================================================== */}
                <section
                    className="relative isolate overflow-hidden bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${IMAGES.hero})`,
                    }}
                >
                    {/* Background photo */}
                    {/* <img src={IMAGES.hero} className="absolute inset-0 bg-cover bg-center bg-no-repeat" /> */}
                    {/* Left scrim for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F2EAE1] via-[#F2EAE1]/20 to-transparent" />
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-[#F2EAE1]/70 via-transparent to-[#F2EAE1]/30" /> */}




                    {/* Hero copy */}
                    <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-5 pb-20 pt-10 sm:pt-10">
                        <Eyebrow className="text-[#c49833] font-bold">For Caribbean &amp; diaspora-serving providers</Eyebrow>
                        <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.07] text-[#184340] sm:text-5xl lg:text-[3.6rem]">
                            Help Caribbean<br /> Families Find the<br /> Care They Need
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#184340] font-bold">
                            Join a trusted network helping Caribbean<br />
                            individuals and families find culturally <br />grounded emotional wellness support.<br />
                            <span className='pt-3 block'>
                                Grow your professional presence while <br />strengthening access to care across our <br />communities.
                            </span>
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <CoralButton large>
                                Create Your Provider Profile
                            </CoralButton>

                            <button
                                type="button"
                                className="rounded-2xl cursor-pointer border border-[#356F79] bg-transparent px-7 py-3.5 text-base font-medium text-[#356F79] shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition hover:border-[#356F79] hover:shadow-[0_3px_12px_rgba(0,0,0,0.10)] focus:outline-none focus:ring-1 active:translate-y-px"
                            >
                                Learn More
                            </button>
                        </div>

                    </div>

                    {/* Corner caption like the reference */}
                    {/* <p className="absolute bottom-4 right-5 z-10 text-xs text-white/70">
                        Marsha’s focus: Community Healing
                    </p> */}
                </section>

                {/* ===================================================== */}
                {/*  IT'S SIMPLE TO JOIN                                  */}
                {/* ===================================================== */}
                <section className="bg-[#FBF8F2]">
                    <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
                        <div>
                            <h2 className="font-serif text-3xl text-[#16302F] sm:text-4xl">It’s simple to join</h2>
                            <p className="mt-4 max-w-lg text-[#5B6B6E]">
                                Share your story today and step into the circle. You’ll appear before the
                                Caribbean individuals and families who come to Bahali searching for someone
                                who understands where they come from.
                            </p>
                            <div className="mt-7">
                                <CoralButton>Join now</CoralButton>
                            </div>
                        </div>

                        {/* Community illustration built from the circle motif */}
                        <div className="relative mx-auto aspect-square w-full max-w-sm">
                            <svg viewBox="0 0 320 320" className="h-full w-full" fill="none" aria-hidden>
                                {[150, 116, 82, 48].map((r, i) => (
                                    <circle key={r} cx="160" cy="160" r={r} stroke="#0E7C7B" strokeWidth="1.5" strokeOpacity={0.25 + i * 0.12} />
                                ))}
                                {/* figures arranged around the circle */}
                                {[0, 1, 2, 3, 4, 5].map((k) => {
                                    const a = (Math.PI * 2 * k) / 6 - Math.PI / 2;
                                    const cx = 160 + Math.cos(a) * 116;
                                    const cy = 160 + Math.sin(a) * 116;
                                    const fills = ['#0E7C7B', '#E8B84B', '#C2543B', '#0E4C4B', '#0E7C7B', '#E8B84B'];
                                    return (
                                        <g key={k} transform={`translate(${cx},${cy})`}>
                                            <circle cx="0" cy="-8" r="9" fill={fills[k]} />
                                            <path d={`M-13 18 a13 13 0 0 1 26 0 Z`} fill={fills[k]} />
                                        </g>
                                    );
                                })}
                                <circle cx="160" cy="160" r="26" fill="#E8B84B" />
                                <text x="160" y="168" textAnchor="middle" className="font-serif" fontSize="22" fill="#0E4C4B" fontWeight="700">B</text>
                            </svg>
                        </div>
                    </div>
                </section>

                {/* ===================================================== */}
                {/*  BENEFITS                                             */}
                {/* ===================================================== */}
                <section className="bg-white">
                    <div className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="font-serif text-3xl text-[#16302F] sm:text-4xl">Bahali provider benefits</h2>
                            <p className="mt-3 text-[#5B6B6E]">No fees, no contracts. Free for every verified provider.</p>
                        </div>

                        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            {BENEFITS.map((b) => (
                                <div key={b.title} className="flex gap-4">
                                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#0E7C7B]/10">
                                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#0E7C7B]" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden>
                                            {b.icon}
                                        </svg>
                                    </span>
                                    <div>
                                        <h3 className="font-serif text-lg text-[#16302F]">{b.title}</h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-[#5B6B6E]">{b.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-14 text-center">
                            <CoralButton>Join the circle</CoralButton>
                        </div>
                    </div>
                </section>

                {/* ===================================================== */}
                {/*  REFERRALS SHOWCASE (curved)                          */}
                {/* ===================================================== */}
                <WaveTop color="#FBF8F2" />
                <section className="bg-[#FBF8F2]">
                    <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
                        <div>
                            <Eyebrow className="text-[#0E7C7B]">The home of Caribbean referrals</Eyebrow>
                            <h2 className="mt-3 font-serif text-3xl text-[#16302F] sm:text-4xl">
                                The first place families look for care that feels like home
                            </h2>
                            <p className="mt-4 max-w-lg text-[#5B6B6E]">
                                Attract new clients and grow your practice when you join the directory built
                                around Caribbean culture, language, and lived experience.
                            </p>
                            <div className="mt-7">
                                <CoralButton>Join now</CoralButton>
                            </div>
                        </div>

                        {/* Referrals image */}
                        <div className="relative">
                            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-[#E8B84B]/20 via-transparent to-[#0E7C7B]/15 blur-xl" />
                            <img
                                src={IMAGES.referrals}
                                className="w-full shadow-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* ===================================================== */}
                {/*  STAT BAND (amber)                                    */}
                {/* ===================================================== */}
                <section className="bg-[#E8B84B]">
                    <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 md:grid-cols-[1fr_1.1fr] lg:py-14">
                        <div className="text-[#0E4C4B]">
                            <p className="font-serif text-6xl leading-none sm:text-7xl">{regionCount}+</p>
                            <p className="mt-4 max-w-sm text-[15px] font-medium leading-relaxed text-[#0E4C4B]/90">
                                Caribbean regions and territories where families are searching for
                                culturally grounded care — in {languageCount}+ languages.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                            {IMAGES.stat.map((src, i) => (
                                <Photo
                                    key={i}
                                    src={src}
                                    tone={['deep', 'coral', 'teal'][i]}
                                    rounded="rounded-2xl"
                                    className="aspect-[3/4] w-full shadow-md"
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===================================================== */}
                {/*  TESTIMONIALS                                         */}
                {/* ===================================================== */}
                <section className="bg-[#F7F3EC]">
                    <div className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
                        <h2 className="text-center font-serif text-3xl text-[#16302F] sm:text-4xl">
                            Voices from the circle
                        </h2>

                        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                            {/* Featured portrait */}
                            <Photo
                                src={IMAGES.testimonial}
                                tone="deep"
                                rounded="rounded-3xl"
                                className="min-h-[320px] w-full"
                            />

                            {/* Quote cards */}
                            <div className="grid gap-5 sm:grid-cols-2">
                                {TESTIMONIALS.map((t, i) => (
                                    <figure
                                        key={t.name}
                                        className={`flex flex-col rounded-2xl border border-[#E7E0D2] bg-white p-6 shadow-sm ${i === 2 ? 'sm:col-span-2' : ''
                                            }`}
                                    >
                                        <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#E8B84B]" fill="currentColor" aria-hidden>
                                            <path d="M9.5 6C6.5 6 4 8.6 4 12v6h6v-6H7c0-1.7 1.1-3 2.5-3V6Zm10 0c-3 0-5.5 2.6-5.5 6v6h6v-6h-3c0-1.7 1.1-3 2.5-3V6Z" />
                                        </svg>
                                        <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-[#3A4B49]">
                                            “{t.quote}”
                                        </blockquote>
                                        <figcaption className="mt-5 border-t border-[#EFEAE0] pt-4">
                                            <p className="font-serif text-[#16302F]">{t.name}</p>
                                            <p className="text-sm text-[#6B7A78]">{t.role}</p>
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===================================================== */}
                {/*  FAQ (2 columns)                                      */}
                {/* ===================================================== */}
                <section className="bg-white">
                    <div className="mx-auto max-w-5xl px-5 py-16 lg:py-24">
                        <h2 className="text-center font-serif text-3xl text-[#16302F] sm:text-4xl">
                            Frequently asked questions
                        </h2>
                        <div className="mt-12 grid gap-x-12 gap-y-9 sm:grid-cols-2">
                            {FAQS.map((f) => (
                                <div key={f.q}>
                                    <h3 className="font-serif text-lg text-[#16302F]">{f.q}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#5B6B6E]">{f.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===================================================== */}
                {/*  PHOTO MOSAIC + EMBEDDED CTA                          */}
                {/* ===================================================== */}
                <section className="bg-[#F7F3EC]">
                    <div className="mx-auto max-w-6xl px-5 pb-16 lg:pb-24">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {/* first 6 tiles */}
                            {IMAGES.mosaic.slice(0, 6).map((src, i) => (
                                <Photo
                                    key={`a${i}`}
                                    src={src}
                                    tone={['teal', 'amber', 'deep', 'coral', 'sand', 'teal'][i % 6]}
                                    rounded="rounded-2xl"
                                    className="aspect-square w-full"
                                />
                            ))}

                            {/* CTA tile spanning two columns */}
                            <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl bg-[#0E4C4B] p-6 text-center">
                                <p className="font-serif text-2xl text-white sm:text-3xl">Add your name to the circle</p>
                                <p className="mt-2 text-sm text-[#A9C9C7]">Free for verified providers.</p>
                                <a
                                    href={SIGNUP_ROUTE}
                                    target='_blank'
                                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E8B84B] px-6 py-3 text-sm font-semibold text-[#0E4C4B] transition hover:bg-[#dca936]"
                                >
                                    Join us →
                                </a>
                            </div>

                            {/* remaining tiles */}
                            {IMAGES.mosaic.slice(6).map((src, i) => (
                                <Photo
                                    key={`b${i}`}
                                    src={src}
                                    tone={['coral', 'teal', 'amber', 'deep'][i % 4]}
                                    rounded="rounded-2xl"
                                    className="aspect-square w-full"
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===================================================== */}
                {/*  FOOTER                                               */}
                {/* ===================================================== */}
                {/* <footer className="bg-[#0a3a39] text-[#A9C9C7]">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8B84B] font-serif text-sm font-bold text-[#0E4C4B]">B</span>
                            <span className="text-sm text-white/90">Bahali — rooted in culture, centered on emotional wellness.</span>
                        </div>
                        <div className="flex items-center gap-5 text-sm">
                            <a href="https://bahali.org/about/" className="transition hover:text-white">About</a>
                            <a href="https://bahali.org/contact/" className="transition hover:text-white">Contact</a>
                            <a href="https://bahali.org/legal/" className="transition hover:text-white">Privacy</a>
                        </div>
                    </div>
                    <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
                        © {new Date().getFullYear()} Bahali. All rights reserved.
                    </div>
                </footer> */}
                <Footer />
            </div>
        </>
    );
}
