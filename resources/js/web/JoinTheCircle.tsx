import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/**
 * Bahali — Join the Circle (Provider Acquisition Landing Page)
 * ------------------------------------------------------------------
 * Stack: Laravel 12 + Inertia.js + React + TypeScript + Tailwind CSS.
 *
 * Purpose: Recruit Caribbean & diaspora-serving wellness providers into
 * the Bahali Provider Directory. Structure is inspired by the Psychology
 * Today "Join" page (hero → benefits → tour → proof → FAQ → CTA), but
 * every choice is grounded in Bahali's own brand: warm sand grounds,
 * deep teal, coral + amber accents, serif headlines, the "circle" motif,
 * and a non-transactional, community-first voice.
 *
 * Primary CTA target: the registration form route.
 *   register route name expected: providers.create
 *   Adjust SIGNUP_ROUTE below if yours differs.
 * ------------------------------------------------------------------
 */

const SIGNUP_ROUTE = '/provider/directory/create';

/* ------------------------------------------------------------------ */
/*  Brand tokens (kept inline so the page is drop-in with no config)   */
/* ------------------------------------------------------------------ */
//  teal        #0E7C7B   primary
//  teal-deep   #0E4C4B   header / footer ground
//  teal-ink    #16302F   headline ink
//  coral       #C2543B   action / warm accent
//  amber       #E8B84B   logo mark / highlights
//  sand        #F7F3EC   page ground
//  surface     #FBF8F2   warm card surface
//  border      #E7E0D2 / #DED7C9

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const BENEFITS: { title: string; body: string; icon: JSX.Element }[] = [
    {
        title: 'Reach the diaspora',
        body: 'Families on the islands and abroad search for culturally grounded care. Your listing meets them where they look.',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.5-2.4 4-5.7 4-9s-1.5-6.6-4-9c-2.5 2.4-4 5.7-4 9s1.5 6.6 4 9ZM3.6 9h16.8M3.6 15h16.8" />
        ),
    },
    {
        title: 'Culturally matched referrals',
        body: 'Seekers filter by language, identity, and lived experience — so the people best suited to your strengths find you.',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.5a7.5 7.5 0 0 1 15 0v.75H4.5v-.75Z" />
        ),
    },
    {
        title: 'A profile that holds your story',
        body: 'Bio, photo, languages, areas of support, and how culture shapes your care — everything a family needs to feel safe choosing you.',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        ),
    },
    {
        title: 'Telehealth across borders',
        body: 'Mark every region you can serve remotely. Reach clients across islands and time zones, not just your home parish.',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75 12 21l9.75-8.25M2.25 7.5 12 15.75 21.75 7.5 12 3 2.25 7.5Z" />
        ),
    },
    {
        title: 'Verified & trusted',
        body: 'Every provider is reviewed. Your license and credentials are confirmed, so families trust the circle they step into.',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        ),
    },
    {
        title: 'No cost to be listed',
        body: 'Joining the directory is free. Bahali is a nonprofit — our aim is access to care, not gatekeeping it behind a fee.',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        ),
    },
];

const STEPS: { n: string; title: string; body: string }[] = [
    {
        n: '01',
        title: 'Tell your story',
        body: 'Share who you are, your credentials, the populations you serve, and how culture shapes your care.',
    },
    {
        n: '02',
        title: 'We verify your credentials',
        body: 'Our team confirms your license and details so families can trust every name in the circle.',
    },
    {
        n: '03',
        title: 'Your listing goes live',
        body: 'Seekers across the islands and diaspora discover you through language, identity, and area-of-support filters.',
    },
];

const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
    {
        quote: 'Being listed meant diaspora families who were searching in two languages could finally find someone who understood both their worlds.',
        name: 'Dr. Marsha Smith',
        role: 'Clinical Psychologist',
    },
    {
        quote: 'The referrals are people I’m actually equipped to help. The cultural filters do real work before a client ever reaches my inbox.',
        name: 'Joanne P.',
        role: 'Mental Health Counselor, LMHC',
    },
    {
        quote: 'I don’t have the time or skill to market myself online. Bahali put me in front of the exact community I trained to serve.',
        name: 'David R.',
        role: 'Clinical Social Worker',
    },
];

const FAQS: { q: string; a: string }[] = [
    {
        q: 'How much does it cost to be listed?',
        a: 'Nothing. Bahali is a nonprofit and the directory is free for verified providers. Our mission is widening access to culturally grounded care, not putting it behind a paywall.',
    },
    {
        q: 'Who can join the directory?',
        a: 'Licensed and credentialed providers, support groups, faith-based organizations, and community programs who serve Caribbean individuals and families — on the islands or in the diaspora.',
    },
    {
        q: 'Do I need to be Caribbean myself?',
        a: 'No. We welcome any provider with genuine experience supporting Caribbean communities. The form lets you share your background and cultural approach so seekers can decide what fits them.',
    },
    {
        q: 'How long does the application take?',
        a: 'About 10–15 minutes. You can share as much detail as you like — a fuller profile helps the right clients recognize you. Verification by our team follows after you submit.',
    },
    {
        q: 'Can I offer telehealth across islands?',
        a: 'Yes. Your profile lets you list every region you can serve remotely, so families across borders and time zones can reach you.',
    },
];

/* ------------------------------------------------------------------ */
/*  Small UI helpers                                                   */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0E7C7B]">
            {children}
        </p>
    );
}

function PrimaryCta({
    children = 'Join the circle',
    className = '',
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <Link
            href={SIGNUP_ROUTE}
            className={`group inline-flex items-center gap-2 rounded-full bg-[#C2543B] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#aa482f] focus:outline-none focus:ring-4 focus:ring-[#C2543B]/30 ${className}`}
        >
            {children}
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                →
            </span>
        </Link>
    );
}

function GhostCta({
    children,
    href,
}: {
    children: React.ReactNode;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full border border-[#CFE0DD] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#0E4C4B] transition hover:border-[#0E7C7B] hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#0E7C7B]/20"
        >
            {children}
        </Link>
    );
}

/* The signature element: concentric "circle" rings that echo Bahali's
   community motif, used quietly as ambient atmosphere behind the hero. */
function CircleRings({ className = '' }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 600 600"
            className={className}
            fill="none"
            aria-hidden
        >
            {[280, 230, 180, 130, 80].map((r, i) => (
                <circle
                    key={r}
                    cx="300"
                    cy="300"
                    r={r}
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeOpacity={0.18 + i * 0.06}
                />
            ))}
            <circle cx="300" cy="300" r="34" fill="currentColor" fillOpacity="0.9" />
        </svg>
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

export default function JoinTheCircle({
    providerCount = 0,
    regionCount = 28,
    languageCount = 8,
}: PageProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <>
            <Head title="Join the Circle — Become a Bahali Wellness Provider">
                <meta
                    name="description"
                    content="Join the Bahali Provider Directory. Get found by Caribbean individuals and families seeking culturally grounded mental health and emotional wellness care — across the islands and the diaspora. Free for verified providers."
                />
            </Head>

            <div className="min-h-screen bg-[#F7F3EC] text-[#1F2A2E] antialiased">
                {/* ----------------------------------------------------- */}
                {/*  Nav                                                  */}
                {/* ----------------------------------------------------- */}
                <header className="sticky top-0 z-40 border-b border-[#E7E0D2] bg-[#F7F3EC]/90 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                        <a href="https://bahali.org" className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8B84B] font-serif text-lg font-bold text-[#0E4C4B]">
                                B
                            </span>
                            <span className="leading-none">
                                <span className="block font-serif text-lg text-[#16302F]">Bahali</span>
                                <span className="block text-[11px] tracking-wide text-[#6B7A78]">
                                    Provider Directory
                                </span>
                            </span>
                        </a>

                        <div className="flex items-center gap-3">
                            <a
                                href="/login"
                                className="hidden text-sm font-medium text-[#3A4B49] transition hover:text-[#0E7C7B] sm:inline"
                            >
                                Provider login
                            </a>
                            <Link
                                href={SIGNUP_ROUTE}
                                className="rounded-full bg-[#0E7C7B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c6a69]"
                            >
                                Join the circle
                            </Link>
                        </div>
                    </div>
                </header>

                {/* ----------------------------------------------------- */}
                {/*  Hero                                                 */}
                {/* ----------------------------------------------------- */}
                <section className="relative overflow-hidden">
                    {/* Ambient signature rings */}
                    <CircleRings className="pointer-events-none absolute -right-32 -top-24 h-[520px] w-[520px] text-[#0E7C7B] opacity-70" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#DED7C9] to-transparent" />

                    <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
                        <div>
                            <Eyebrow>For Caribbean &amp; diaspora-serving providers</Eyebrow>
                            <h1 className="mt-4 font-serif text-4xl leading-[1.08] text-[#16302F] sm:text-5xl lg:text-[3.4rem]">
                                The families looking for you
                                <br />
                                are looking for{' '}
                                <span className="relative whitespace-nowrap text-[#0E7C7B]">
                                    home
                                    <svg
                                        className="absolute -bottom-2 left-0 w-full text-[#E8B84B]"
                                        viewBox="0 0 200 12"
                                        fill="none"
                                        aria-hidden
                                    >
                                        <path
                                            d="M2 8c40-6 156-6 196 0"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </span>
                                .
                            </h1>
                            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#5B6B6E]">
                                Join the Bahali Provider Directory and be found by Caribbean
                                individuals and families seeking culturally grounded care — on the
                                islands and across the diaspora. Free for verified providers.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                <PrimaryCta>Join the circle</PrimaryCta>
                                <GhostCta href="#how-it-works">See how it works</GhostCta>
                            </div>

                            <p className="mt-5 flex items-center gap-2 text-sm text-[#6B7A78]">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 text-[#0E7C7B]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    aria-hidden
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                No listing fee · Credentials verified · 10-minute application
                            </p>
                        </div>

                        {/* Hero card: a profile preview that mirrors the directory */}
                        <div className="relative">
                            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-[#E8B84B]/25 via-transparent to-[#0E7C7B]/15 blur-xl" />
                            <div className="rounded-3xl border border-[#E7E0D2] bg-white p-6 shadow-[0_18px_50px_-24px_rgba(14,76,75,0.4)]">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0E4C4B] font-serif text-2xl text-[#E8B84B]">
                                        M
                                    </div>
                                    <div>
                                        <p className="font-serif text-lg text-[#16302F]">Dr. Marsha S.</p>
                                        <p className="text-sm text-[#6B7A78]">Clinical Psychologist · Kingston</p>
                                    </div>
                                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#0E7C7B]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0E7C7B]">
                                        <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden>
                                            <path d="M7.6 13.4 4.2 10l-1.2 1.2 4.6 4.6 9-9L15.4 5.6z" />
                                        </svg>
                                        Verified
                                    </span>
                                </div>

                                <p className="mt-5 text-sm leading-relaxed text-[#5B6B6E]">
                                    “I support families navigating grief, diaspora stress, and recovery
                                    after disaster — with care rooted in our culture and our stories.”
                                </p>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {['English', 'Jamaican Patois', 'Trauma & PTSD', 'Diaspora Stress', 'Telehealth'].map(
                                        (t) => (
                                            <span
                                                key={t}
                                                className="rounded-full border border-[#E7E0D2] bg-[#FBF8F2] px-3 py-1 text-xs font-medium text-[#3A4B49]"
                                            >
                                                {t}
                                            </span>
                                        )
                                    )}
                                </div>

                                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#EFEAE0] pt-5 text-center">
                                    <div>
                                        <p className="font-serif text-xl text-[#0E7C7B]">12+</p>
                                        <p className="text-[11px] text-[#6B7A78]">years</p>
                                    </div>
                                    <div>
                                        <p className="font-serif text-xl text-[#0E7C7B]">5</p>
                                        <p className="text-[11px] text-[#6B7A78]">islands served</p>
                                    </div>
                                    <div>
                                        <p className="font-serif text-xl text-[#0E7C7B]">In-person</p>
                                        <p className="text-[11px] text-[#6B7A78]">&amp; virtual</p>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-3 text-center text-xs text-[#9AA6A4]">
                                A preview of how your listing could appear.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ----------------------------------------------------- */}
                {/*  Quick reassurance band                               */}
                {/* ----------------------------------------------------- */}
                <section className="border-y border-[#E7E0D2] bg-[#FBF8F2]">
                    <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-3">
                        <Stat value={`${regionCount}+`} label="Caribbean regions & territories" />
                        <Stat value={`${languageCount}`} label="Languages families can filter by" />
                        <Stat value="Free" label="To list as a verified provider" />
                    </div>
                </section>

                {/* ----------------------------------------------------- */}
                {/*  Benefits                                             */}
                {/* ----------------------------------------------------- */}
                <section className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
                    <div className="max-w-2xl">
                        <Eyebrow>Why providers join</Eyebrow>
                        <h2 className="mt-3 font-serif text-3xl text-[#16302F] sm:text-4xl">
                            Built for the way our communities seek care
                        </h2>
                        <p className="mt-4 text-[#5B6B6E]">
                            Bahali isn’t a generic directory. It’s a circle built around Caribbean
                            culture, language, and lived experience — so the right families find the
                            right provider.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#E7E0D2] bg-[#E7E0D2] sm:grid-cols-2 lg:grid-cols-3">
                        {BENEFITS.map((b) => (
                            <div key={b.title} className="bg-white p-7 transition hover:bg-[#FBF8F2]">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0E7C7B]/10">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-6 w-6 text-[#0E7C7B]"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.7}
                                        aria-hidden
                                    >
                                        {b.icon}
                                    </svg>
                                </span>
                                <h3 className="mt-5 font-serif text-xl text-[#16302F]">{b.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-[#5B6B6E]">{b.body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ----------------------------------------------------- */}
                {/*  How it works                                         */}
                {/* ----------------------------------------------------- */}
                <section id="how-it-works" className="bg-[#0E4C4B] text-white">
                    <div className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8B84B]">
                                How it works
                            </p>
                            <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
                                Three steps into the circle
                            </h2>
                            <p className="mt-4 text-[#A9C9C7]">
                                Thoughtful, not bureaucratic. We ask what helps families choose well —
                                and nothing that doesn’t.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-8 md:grid-cols-3">
                            {STEPS.map((s, i) => (
                                <div key={s.n} className="relative">
                                    <div className="flex items-baseline gap-3">
                                        <span className="font-serif text-4xl text-[#E8B84B]">{s.n}</span>
                                        {i < STEPS.length - 1 && (
                                            <span className="hidden h-px flex-1 translate-y-[-6px] bg-white/15 md:block" />
                                        )}
                                    </div>
                                    <h3 className="mt-4 font-serif text-xl text-white">{s.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#A9C9C7]">{s.body}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                            <PrimaryCta>Start your application</PrimaryCta>
                        </div>
                    </div>
                </section>

                {/* ----------------------------------------------------- */}
                {/*  Testimonials                                         */}
                {/* ----------------------------------------------------- */}
                <section className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
                    <div className="max-w-2xl">
                        <Eyebrow>Voices from the circle</Eyebrow>
                        <h2 className="mt-3 font-serif text-3xl text-[#16302F] sm:text-4xl">
                            Providers already walking with us
                        </h2>
                    </div>

                    <div className="mt-12 grid gap-6 lg:grid-cols-3">
                        {TESTIMONIALS.map((t) => (
                            <figure
                                key={t.name}
                                className="flex flex-col rounded-2xl border border-[#E7E0D2] bg-white p-7 shadow-sm"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-7 w-7 text-[#E8B84B]"
                                    fill="currentColor"
                                    aria-hidden
                                >
                                    <path d="M9.5 6C6.5 6 4 8.6 4 12v6h6v-6H7c0-1.7 1.1-3 2.5-3V6Zm10 0c-3 0-5.5 2.6-5.5 6v6h6v-6h-3c0-1.7 1.1-3 2.5-3V6Z" />
                                </svg>
                                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-[#3A4B49]">
                                    “{t.quote}”
                                </blockquote>
                                <figcaption className="mt-6 border-t border-[#EFEAE0] pt-4">
                                    <p className="font-serif text-[#16302F]">{t.name}</p>
                                    <p className="text-sm text-[#6B7A78]">{t.role}</p>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </section>

                {/* ----------------------------------------------------- */}
                {/*  FAQ                                                  */}
                {/* ----------------------------------------------------- */}
                <section className="border-t border-[#E7E0D2] bg-[#FBF8F2]">
                    <div className="mx-auto max-w-3xl px-5 py-16 lg:py-24">
                        <div className="text-center">
                            <Eyebrow>Good to know</Eyebrow>
                            <h2 className="mt-3 font-serif text-3xl text-[#16302F] sm:text-4xl">
                                Frequently asked questions
                            </h2>
                        </div>

                        <div className="mt-10 divide-y divide-[#E7E0D2] overflow-hidden rounded-2xl border border-[#E7E0D2] bg-white">
                            {FAQS.map((f, i) => {
                                const open = openFaq === i;
                                return (
                                    <div key={f.q}>
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaq(open ? null : i)}
                                            aria-expanded={open}
                                            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-[#FBF8F2]"
                                        >
                                            <span className="font-medium text-[#16302F]">{f.q}</span>
                                            <span
                                                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[#DED7C9] text-[#0E7C7B] transition ${open ? 'rotate-45 bg-[#0E7C7B]/10' : ''
                                                    }`}
                                                aria-hidden
                                            >
                                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                                                </svg>
                                            </span>
                                        </button>
                                        <div
                                            className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="px-6 pb-6 text-sm leading-relaxed text-[#5B6B6E]">
                                                    {f.a}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ----------------------------------------------------- */}
                {/*  Final CTA                                            */}
                {/* ----------------------------------------------------- */}
                <section className="relative overflow-hidden bg-[#0E4C4B]">
                    <CircleRings className="pointer-events-none absolute -left-24 -bottom-32 h-[480px] w-[480px] text-[#E8B84B] opacity-30" />
                    <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
                        <h2 className="font-serif text-3xl text-white sm:text-4xl lg:text-[2.75rem]">
                            Your seat in the circle is waiting
                        </h2>
                        <p className="mx-auto mt-5 max-w-xl text-[#A9C9C7]">
                            Help Caribbean individuals and families find care that understands where
                            they come from. Add your name to the directory today.
                        </p>
                        <div className="mt-9 flex flex-wrap justify-center gap-3">
                            <PrimaryCta>Join the circle</PrimaryCta>
                            <a
                                href="https://bahali.org/about/"
                                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/60"
                            >
                                Learn about Bahali
                            </a>
                        </div>
                    </div>
                </section>

                {/* ----------------------------------------------------- */}
                {/*  Footer                                               */}
                {/* ----------------------------------------------------- */}
                <footer className="bg-[#0a3a39] text-[#A9C9C7]">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8B84B] font-serif text-sm font-bold text-[#0E4C4B]">
                                B
                            </span>
                            <span className="text-sm text-white/90">
                                Bahali — rooted in culture, centered on emotional wellness.
                            </span>
                        </div>
                        <div className="flex items-center gap-5 text-sm">
                            <a href="https://bahali.org/about/" className="transition hover:text-white">
                                About
                            </a>
                            <a href="https://bahali.org/contact/" className="transition hover:text-white">
                                Contact
                            </a>
                            <a href="https://bahali.org/legal/" className="transition hover:text-white">
                                Privacy
                            </a>
                        </div>
                    </div>
                    <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
                        © {new Date().getFullYear()} Bahali. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  Stat (reassurance band)                                            */
/* ------------------------------------------------------------------ */

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center sm:text-left">
            <p className="font-serif text-3xl text-[#0E7C7B]">{value}</p>
            <p className="mt-1 text-sm text-[#5B6B6E]">{label}</p>
        </div>
    );
}
