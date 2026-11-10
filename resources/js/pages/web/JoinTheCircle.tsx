import { Head, Link, usePage } from '@inertiajs/react';

import LandingLayout, { DIRECTORY_URL, SIGNUP_URL } from '@/components/landing/LandingLayout';

/**
 * Bahali Connect — provider recruitment landing page (Version 3.7, approved).
 * Converted from Marsha's index.html; styles come from resources/css/landing.css.
 *
 * Every text and image comes from the admin panel (Admin → Website → Join the Circle) via the
 * `content` prop. Keys and defaults live in App\Services\Web\JoinTheCircleService::schema();
 * DEFAULTS below is the same text, used when a key has not been saved yet.
 *
 * Description and link-preview tags are printed by resources/views/app.blade.php (server side),
 * so WhatsApp, Facebook and LinkedIn can read them.
 */

const DEFAULTS: Record<string, string> = {
    /* Page title & link previews */
    'landing.seo.title': "Join the Bahali Provider Directory | Bahali",
    'landing.seo.description': "Join the Bahali Provider Directory and help individuals and families across Caribbean communities and the diaspora discover the mental health and emotional wellness support you offer.",
    'landing.seo.share_title': "Make meaningful support easier to find.",
    'landing.seo.share_description': "Join a growing directory connecting individuals and families with mental health and emotional wellness providers across the Caribbean and its diaspora.",
    'landing.seo.share_image': "/images/landing/social-share.jpg",
    /* Header menu */
    'landing.header.link_1': "Our purpose",
    'landing.header.link_2': "How People Find Support",
    'landing.header.link_3': "How to join",
    'landing.header.button': "Apply to join →",
    /* Hero */
    'landing.hero.eyebrow': "JOIN THE BAHALI PROVIDER DIRECTORY",
    'landing.hero.title': "Make meaningful support easier to find.",
    'landing.hero.body': "Across the Caribbean and its diaspora, finding emotional wellness support is not always straightforward. Bahali is building a directory that helps individuals and families discover the services you offer, in the locations where you provide support.",
    'landing.hero.emphasis': "We welcome providers from diverse professional and community-based backgrounds with experience providing mental health or emotional wellness support.",
    'landing.hero.button': "Apply to join the directory →",
    'landing.hero.link': "Learn more",
    'landing.hero.image': "/images/landing/hero.jpg",
    'landing.hero.image_alt': "A provider listens attentively to a client during a conversation in a bright room.",
    /* Why Bahali exists */
    'landing.purpose.image': "/images/landing/community.jpg",
    'landing.purpose.image_alt': "Two women laughing together on a park bench, one resting her arm along the bench beside the other.",
    'landing.purpose.eyebrow': "WHY BAHALI EXISTS",
    'landing.purpose.title': "Support should be easier to discover, wherever home may be.",
    'landing.purpose.body': "Across Caribbean communities and the diaspora, finding appropriate mental health and emotional wellness support can be difficult. Distance, limited local options and uncertainty about where to turn can make that search even harder. By bringing information about providers and their services into one place, Bahali helps individuals and families discover available support while making the work of participating providers easier to find.",
    'landing.purpose.quote': "A directory designed around people's needs, locations and preferences—not around one profession.",
    /* How people find support */
    'landing.search.eyebrow': "HOW PEOPLE FIND SUPPORT",
    'landing.search.title': "Help people discover the support you offer.",
    'landing.search.body_1': "People can explore options by location, area of support, language and how services are delivered, including in person and virtually.",
    'landing.search.body_2': "The search experience begins with what someone needs—not with a requirement to know which type of provider to approach.",
    'landing.search.card_title': "Find support",
    'landing.search.field_1_label': "Location",
    'landing.search.field_1_text': "Select your location",
    'landing.search.field_2_label': "Area of support",
    'landing.search.field_2_text': "What would you like help with?",
    'landing.search.field_3_label': "Language spoken",
    'landing.search.field_3_text': "Select a language",
    'landing.search.chips_label': "Example areas of support",
    'landing.search.chip_1': "Anxiety & Worry",
    'landing.search.chip_2': "Grief & Loss",
    'landing.search.chip_3': "Relationships & Family",
    'landing.search.option_1': "In-person support",
    'landing.search.option_2': "Virtual support",
    'landing.search.button': "Explore support →",
    /* One shared purpose */
    'landing.shared.eyebrow': "ONE SHARED PURPOSE",
    'landing.shared.title': "Different forms of support. Equal respect.",
    'landing.shared.body': "Supporting emotional wellness requires different kinds of knowledge, experience and care. Bahali brings together eligible clinical, counselling, pastoral, peer, allied and community-based providers, recognising their distinct contributions while clearly presenting the roles, qualifications and services they describe in their profiles.",
    'landing.shared.item_1.title': "Local relevance",
    'landing.shared.item_1.body': "Discover support available in the locations where people live.",
    'landing.shared.item_2.title': "Informed choice",
    'landing.shared.item_2.body': "Explore provider-reported roles, qualifications and services before reaching out.",
    'landing.shared.item_3.title': "Multiple pathways",
    'landing.shared.item_3.body': "Explore different forms of support based on individual needs and preferences.",
    /* Why join Bahali */
    'landing.why.eyebrow': "WHY JOIN BAHALI",
    'landing.why.title': "Make what you offer easier to discover.",
    'landing.why.item_1.title': "Be found by location",
    'landing.why.item_1.body': "Help people discover your services where you are available.",
    'landing.why.item_2.title': "Explain your services",
    'landing.why.item_2.body': "Give individuals a clearer understanding of the support you provide.",
    'landing.why.item_3.title': "Show service options",
    'landing.why.item_3.body': "Make it easy to identify whether you offer in-person or virtual support.",
    'landing.why.item_4.title': "Present your experience",
    'landing.why.item_4.body': "Share your qualifications, background and relevant experience.",
    'landing.why.item_5.title': "Keep information current",
    'landing.why.item_5.body': "Maintain an accurate representation of your services and availability.",
    'landing.why.item_6.title': "No directory listing fee",
    'landing.why.item_6.body': "Join the directory and maintain an approved profile at no cost.",
    /* How to join */
    'landing.steps.eyebrow': "HOW TO JOIN",
    'landing.steps.title': "A clear application process.",
    'landing.steps.item_1.title': "Share your information",
    'landing.steps.item_1.body': "Tell us about your role, services, experience and locations.",
    'landing.steps.item_2.title': "Application review",
    'landing.steps.item_2.body': "Bahali reviews your application to determine whether your profile meets the directory's eligibility criteria and standards.",
    'landing.steps.item_3.title': "Become discoverable",
    'landing.steps.item_3.body': "Once approved, your profile is published in the directory, making your services discoverable through relevant searches.",
    /* Frequently asked questions */
    'landing.faq.eyebrow': "GOOD TO KNOW",
    'landing.faq.title': "Frequently asked questions.",
    'landing.faq.item_1.question': "Who can apply?",
    'landing.faq.item_1.answer': "Eligible providers across clinical, counselling, pastoral, peer, allied and community-based support may apply. Requirements vary by role and services offered.",
    'landing.faq.item_2.question': "Do I need to be Caribbean to apply?",
    'landing.faq.item_2.answer': "No. Bahali welcomes eligible providers from all backgrounds.",
    'landing.faq.item_3.question': "Do I need experience working with Caribbean communities?",
    'landing.faq.item_3.answer': "No. Experience supporting Caribbean individuals, families or communities is not required. Providers who have this experience can indicate it in their profiles to help people make informed choices.",
    'landing.faq.item_4.question': "Must I offer virtual support?",
    'landing.faq.item_4.answer': "No. Providers may offer in-person services, virtual services or both, depending on their services and applicable requirements.",
    'landing.faq.item_5.question': "How are applications reviewed?",
    'landing.faq.item_5.answer': "Bahali reviews applications to assess whether providers meet the directory's eligibility criteria and standards. This includes reviewing the information submitted about their professional role, experience and services. Approval allows a profile to be published but does not constitute independent credential verification.",
    'landing.faq.item_6.question': "Is there a listing fee?",
    'landing.faq.item_6.answer': "No. Applying to join the directory and maintaining an approved listing are free.",
    /* About Bahali */
    'landing.about.eyebrow': "ABOUT BAHALI",
    'landing.about.body': "Bahali is a nonprofit organisation dedicated to emotional wellness across Caribbean communities and the diaspora. Founded and led by Dr. Marsha Smith, PsyD, LCSW, a clinical psychologist and clinical social worker, Bahali created the Provider Directory to help people find support and help providers be found.",
    'landing.about.link_text': "Learn more about Bahali →",
    'landing.about.link_url': "https://bahali.org/about/",
    /* Final invitation */
    'landing.closing.eyebrow': "AN INVITATION TO PARTICIPATE",
    'landing.closing.title': "Help make support easier to find, wherever people call home.",
    'landing.closing.body': "Join Bahali in making information about emotional wellness support more accessible across Caribbean communities and the diaspora.",
    'landing.closing.button': "Apply to join the directory →",
};

interface PageProps {
    content?: Record<string, string>;
}

export default function JoinTheCircle({ content = {} }: PageProps) {
    const t = (key: string): string => content[key] || DEFAULTS[key] || '';

    // Signed in → the "Apply to join" buttons become "Dashboard" (admin → admin dashboard, provider → provider dashboard).
    const { auth } = usePage<{ auth?: { user?: { role?: string } | null } }>().props;
    const user = auth?.user ?? null;
    const dashboardUrl = user?.role === 'admin' ? '/admin/dashboard' : '/provider/dashboard';

    return (
        <LandingLayout
            withNav
            nav={{
                link1: t('landing.header.link_1'),
                link2: t('landing.header.link_2'),
                link3: t('landing.header.link_3'),
                button: user ? 'Dashboard' : t('landing.header.button'),
                buttonHref: user ? dashboardUrl : SIGNUP_URL,
            }}
        >
            <Head title={t('landing.seo.title')} />

            <main id="top">
                {/* HERO */}
                <section className="hero">
                    <div className="hero-copy">
                        <div className="eyebrow coral">{t('landing.hero.eyebrow')}</div>

                        <h1>{t('landing.hero.title')}</h1>

                        <p>{t('landing.hero.body')}</p>

                        <p className="hero-emphasis">{t('landing.hero.emphasis')}</p>

                        <div className="hero-actions">
                            {/* Provider application form (Dashboard when signed in) */}
                            <Link className="button" href={user ? dashboardUrl : SIGNUP_URL}>
                                {user ? 'Dashboard' : t('landing.hero.button')}
                            </Link>
                            <a className="text-link" href="#purpose">
                                {t('landing.hero.link')}
                            </a>
                        </div>
                    </div>

                    <div className="hero-photo">
                        <img src={t('landing.hero.image')} alt={t('landing.hero.image_alt')} />
                    </div>
                </section>

                {/* OUR PURPOSE */}
                <section className="section white" id="purpose">
                    <div className="inner">
                        <div className="purpose-grid">
                            <img className="purpose-photo" src={t('landing.purpose.image')} alt={t('landing.purpose.image_alt')} />

                            <div>
                                <div className="eyebrow">{t('landing.purpose.eyebrow')}</div>

                                <h2>{t('landing.purpose.title')}</h2>

                                <p>{t('landing.purpose.body')}</p>
                            </div>
                        </div>

                        <div className="editorial-quote">{t('landing.purpose.quote')}</div>
                    </div>
                </section>

                {/* HOW PEOPLE FIND SUPPORT */}
                <section className="section" id="search">
                    <div className="inner preview-grid">
                        <div>
                            <div className="eyebrow">{t('landing.search.eyebrow')}</div>

                            <h2>{t('landing.search.title')}</h2>

                            <p>{t('landing.search.body_1')}</p>

                            <p>{t('landing.search.body_2')}</p>
                        </div>

                        <div className="search-preview">
                            <h3>{t('landing.search.card_title')}</h3>

                            <div className="fields">
                                <div className="field">
                                    <small>{t('landing.search.field_1_label')}</small>
                                    {t('landing.search.field_1_text')}
                                </div>

                                <div className="field">
                                    <small>{t('landing.search.field_2_label')}</small>
                                    {t('landing.search.field_2_text')}
                                </div>

                                {/* Language spoken: single-select search filter, matched against the "Languages spoken"
                                    set list that providers choose from on their profiles. */}
                                <div className="field">
                                    <small>{t('landing.search.field_3_label')}</small>
                                    {t('landing.search.field_3_text')}
                                </div>
                            </div>

                            <div className="preview-label">{t('landing.search.chips_label')}</div>

                            <div className="chips">
                                <span className="chip">{t('landing.search.chip_1')}</span>
                                <span className="chip selected">{t('landing.search.chip_2')}</span>
                                <span className="chip">{t('landing.search.chip_3')}</span>
                            </div>

                            <div className="delivery">
                                <span>
                                    <span className="check" aria-hidden="true">
                                        ✓
                                    </span>{' '}
                                    {t('landing.search.option_1')}
                                </span>
                                <span>
                                    <span className="check" aria-hidden="true">
                                        ✓
                                    </span>{' '}
                                    {t('landing.search.option_2')}
                                </span>
                            </div>

                            <div className="preview-action">
                                {/* Public directory search page */}
                                <Link className="button" href={DIRECTORY_URL}>
                                    {t('landing.search.button')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ONE SHARED PURPOSE */}
                <section className="section sage">
                    <div className="inner">
                        <div className="eyebrow">{t('landing.shared.eyebrow')}</div>

                        <h2>{t('landing.shared.title')}</h2>

                        <p className="intro">{t('landing.shared.body')}</p>

                        <div className="three">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="feature">
                                    <h3>{t(`landing.shared.item_${n}.title`)}</h3>
                                    <p>{t(`landing.shared.item_${n}.body`)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* WHY JOIN BAHALI */}
                <section className="section">
                    <div className="inner">
                        <div className="eyebrow">{t('landing.why.eyebrow')}</div>

                        <h2>{t('landing.why.title')}</h2>

                        <div className="three">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className={n === 6 ? 'feature accent' : 'feature'}>
                                    <h3>{t(`landing.why.item_${n}.title`)}</h3>
                                    <p>{t(`landing.why.item_${n}.body`)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* HOW TO JOIN */}
                <section className="section white" id="steps">
                    <div className="inner">
                        <div className="eyebrow">{t('landing.steps.eyebrow')}</div>

                        <h2>{t('landing.steps.title')}</h2>

                        <div className="steps">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="step">
                                    <div className="number">{`0${n}`}</div>
                                    <h3>{t(`landing.steps.item_${n}.title`)}</h3>
                                    <p>{t(`landing.steps.item_${n}.body`)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FREQUENTLY ASKED QUESTIONS */}
                <section className="section">
                    <div className="faq">
                        <div className="eyebrow">{t('landing.faq.eyebrow')}</div>

                        <h2>{t('landing.faq.title')}</h2>

                        <div className="faq-items">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <details key={n} open={n === 1}>
                                    <summary>{t(`landing.faq.item_${n}.question`)}</summary>
                                    <p>{t(`landing.faq.item_${n}.answer`)}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ABOUT BAHALI (credibility statement, placed directly above the final invitation) */}
                <section className="about" aria-labelledby="about-bahali">
                    <div className="inner">
                        <div className="eyebrow" id="about-bahali">
                            {t('landing.about.eyebrow')}
                        </div>
                        <p className="about-statement">{t('landing.about.body')}</p>
                        <a className="text-link" href={t('landing.about.link_url')}>
                            {t('landing.about.link_text')}
                        </a>
                    </div>
                </section>

                {/* FINAL INVITATION */}
                <section className="closing" id="join">
                    <div className="eyebrow">{t('landing.closing.eyebrow')}</div>

                    <h2>{t('landing.closing.title')}</h2>

                    <p>{t('landing.closing.body')}</p>

                    {/* Provider application form (Dashboard when signed in) */}
                    <Link className="button light-button" href={user ? dashboardUrl : SIGNUP_URL}>
                        {user ? 'Dashboard' : t('landing.closing.button')}
                    </Link>
                </section>
            </main>
        </LandingLayout>
    );
}
