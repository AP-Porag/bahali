import { Head, Link } from '@inertiajs/react';

import LandingLayout, { DIRECTORY_URL, SIGNUP_URL } from '@/components/landing/LandingLayout';

/**
 * Bahali Connect — provider recruitment landing page (Version 3.7, approved).
 * Converted from Marsha's index.html; styles come from resources/css/landing.css.
 *
 * Description, Open Graph and Twitter/X tags are printed by resources/views/app.blade.php
 * (server side), so link previews on WhatsApp, Facebook and LinkedIn can read them.
 */
export default function JoinTheCircle() {
    return (
        <LandingLayout withNav>
            <Head title="Join the Bahali Provider Directory | Bahali" />

            <main id="top">
                {/* HERO */}
                <section className="hero">
                    <div className="hero-copy">
                        <div className="eyebrow coral">JOIN THE BAHALI PROVIDER DIRECTORY</div>

                        <h1>Make meaningful support easier to find.</h1>

                        <p>
                            Across the Caribbean and its diaspora, finding emotional wellness support is not always straightforward. Bahali is
                            building a directory that helps individuals and families discover the services you offer, in the locations where you
                            provide support.
                        </p>

                        <p className="hero-emphasis">
                            We welcome providers from diverse professional and community-based backgrounds with experience providing mental health
                            or emotional wellness support.
                        </p>

                        <div className="hero-actions">
                            {/* Provider application form */}
                            <Link className="button" href={SIGNUP_URL}>
                                Apply to join the directory →
                            </Link>
                            <a className="text-link" href="#purpose">
                                Learn more
                            </a>
                        </div>
                    </div>

                    <div className="hero-photo">
                        <img src="/images/landing/hero.jpg" alt="A provider listens attentively to a client during a conversation in a bright room." />
                    </div>
                </section>

                {/* OUR PURPOSE */}
                <section className="section white" id="purpose">
                    <div className="inner">
                        <div className="purpose-grid">
                            <img
                                className="purpose-photo"
                                src="/images/landing/community.jpg"
                                alt="Two women laughing together on a park bench, one resting her arm along the bench beside the other."
                            />

                            <div>
                                <div className="eyebrow">WHY BAHALI EXISTS</div>

                                <h2>Support should be easier to discover, wherever home may be.</h2>

                                <p>
                                    Across Caribbean communities and the diaspora, finding appropriate mental health and emotional wellness support can
                                    be difficult. Distance, limited local options and uncertainty about where to turn can make that search even harder.
                                    By bringing information about providers and their services into one place, Bahali helps individuals and families
                                    discover available support while making the work of participating providers easier to find.
                                </p>
                            </div>
                        </div>

                        <div className="editorial-quote">A directory designed around people's needs, locations and preferences—not around one profession.</div>
                    </div>
                </section>

                {/* HOW PEOPLE FIND SUPPORT */}
                <section className="section" id="search">
                    <div className="inner preview-grid">
                        <div>
                            <div className="eyebrow">HOW PEOPLE FIND SUPPORT</div>

                            <h2>Help people discover the support you offer.</h2>

                            <p>
                                People can explore options by location, area of support, language and how services are delivered, including in
                                person and virtually.
                            </p>

                            <p>
                                The search experience begins with what someone needs—not with a requirement to know which type of provider to
                                approach.
                            </p>
                        </div>

                        <div className="search-preview">
                            <h3>Find support</h3>

                            <div className="fields">
                                <div className="field">
                                    <small>Location</small>
                                    Select your location
                                </div>

                                <div className="field">
                                    <small>Area of support</small>
                                    What would you like help with?
                                </div>

                                {/* Language spoken: single-select search filter, matched against the "Languages spoken"
                                    set list that providers choose from on their profiles. */}
                                <div className="field">
                                    <small>Language spoken</small>
                                    Select a language
                                </div>
                            </div>

                            <div className="preview-label">Example areas of support</div>

                            <div className="chips">
                                <span className="chip">Anxiety &amp; Worry</span>
                                <span className="chip selected">Grief &amp; Loss</span>
                                <span className="chip">Relationships &amp; Family</span>
                            </div>

                            <div className="delivery">
                                <span>
                                    <span className="check" aria-hidden="true">
                                        ✓
                                    </span>{' '}
                                    In-person support
                                </span>
                                <span>
                                    <span className="check" aria-hidden="true">
                                        ✓
                                    </span>{' '}
                                    Virtual support
                                </span>
                            </div>

                            <div className="preview-action">
                                {/* Public directory search page */}
                                <Link className="button" href={DIRECTORY_URL}>
                                    Explore support →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ONE SHARED PURPOSE */}
                <section className="section sage">
                    <div className="inner">
                        <div className="eyebrow">ONE SHARED PURPOSE</div>

                        <h2>Different forms of support. Equal respect.</h2>

                        <p className="intro">
                            Supporting emotional wellness requires different kinds of knowledge, experience and care. Bahali brings together eligible
                            clinical, counselling, pastoral, peer, allied and community-based providers, recognising their distinct contributions
                            while clearly presenting the roles, qualifications and services they describe in their profiles.
                        </p>

                        <div className="three">
                            <div className="feature">
                                <h3>Local relevance</h3>
                                <p>Discover support available in the locations where people live.</p>
                            </div>

                            <div className="feature">
                                <h3>Informed choice</h3>
                                <p>Explore provider-reported roles, qualifications and services before reaching out.</p>
                            </div>

                            <div className="feature">
                                <h3>Multiple pathways</h3>
                                <p>Explore different forms of support based on individual needs and preferences.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* WHY JOIN BAHALI */}
                <section className="section">
                    <div className="inner">
                        <div className="eyebrow">WHY JOIN BAHALI</div>

                        <h2>Make what you offer easier to discover.</h2>

                        <div className="three">
                            <div className="feature">
                                <h3>Be found by location</h3>
                                <p>Help people discover your services where you are available.</p>
                            </div>

                            <div className="feature">
                                <h3>Explain your services</h3>
                                <p>Give individuals a clearer understanding of the support you provide.</p>
                            </div>

                            <div className="feature">
                                <h3>Show service options</h3>
                                <p>Make it easy to identify whether you offer in-person or virtual support.</p>
                            </div>

                            <div className="feature">
                                <h3>Present your experience</h3>
                                <p>Share your qualifications, background and relevant experience.</p>
                            </div>

                            <div className="feature">
                                <h3>Keep information current</h3>
                                <p>Maintain an accurate representation of your services and availability.</p>
                            </div>

                            <div className="feature accent">
                                <h3>No directory listing fee</h3>
                                <p>Join the directory and maintain an approved profile at no cost.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HOW TO JOIN */}
                <section className="section white" id="steps">
                    <div className="inner">
                        <div className="eyebrow">HOW TO JOIN</div>

                        <h2>A clear application process.</h2>

                        <div className="steps">
                            <div className="step">
                                <div className="number">01</div>
                                <h3>Share your information</h3>
                                <p>Tell us about your role, services, experience and locations.</p>
                            </div>

                            <div className="step">
                                <div className="number">02</div>
                                <h3>Application review</h3>
                                <p>Bahali reviews your application to determine whether your profile meets the directory's eligibility criteria and standards.</p>
                            </div>

                            <div className="step">
                                <div className="number">03</div>
                                <h3>Become discoverable</h3>
                                <p>Once approved, your profile is published in the directory, making your services discoverable through relevant searches.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FREQUENTLY ASKED QUESTIONS */}
                <section className="section">
                    <div className="faq">
                        <div className="eyebrow">GOOD TO KNOW</div>

                        <h2>Frequently asked questions.</h2>

                        <div className="faq-items">
                            <details open>
                                <summary>Who can apply?</summary>
                                <p>
                                    Eligible providers across clinical, counselling, pastoral, peer, allied and community-based support may apply.
                                    Requirements vary by role and services offered.
                                </p>
                            </details>

                            <details>
                                <summary>Do I need to be Caribbean to apply?</summary>
                                <p>No. Bahali welcomes eligible providers from all backgrounds.</p>
                            </details>

                            <details>
                                <summary>Do I need experience working with Caribbean communities?</summary>
                                <p>
                                    No. Experience supporting Caribbean individuals, families or communities is not required. Providers who have this
                                    experience can indicate it in their profiles to help people make informed choices.
                                </p>
                            </details>

                            <details>
                                <summary>Must I offer virtual support?</summary>
                                <p>
                                    No. Providers may offer in-person services, virtual services or both, depending on their services and applicable
                                    requirements.
                                </p>
                            </details>

                            <details>
                                <summary>How are applications reviewed?</summary>
                                <p>
                                    Bahali reviews applications to assess whether providers meet the directory's eligibility criteria and standards.
                                    This includes reviewing the information submitted about their professional role, experience and services. Approval
                                    allows a profile to be published but does not constitute independent credential verification.
                                </p>
                            </details>

                            <details>
                                <summary>Is there a listing fee?</summary>
                                <p>No. Applying to join the directory and maintaining an approved listing are free.</p>
                            </details>
                        </div>
                    </div>
                </section>

                {/* ABOUT BAHALI (credibility statement, placed directly above the final invitation) */}
                <section className="about" aria-labelledby="about-bahali">
                    <div className="inner">
                        <div className="eyebrow" id="about-bahali">
                            ABOUT BAHALI
                        </div>
                        <p className="about-statement">
                            Bahali is a nonprofit organisation dedicated to emotional wellness across Caribbean communities and the diaspora. Founded
                            and led by Dr. Marsha Smith, PsyD, LCSW, a clinical psychologist and clinical social worker, Bahali created the Provider
                            Directory to help people find support and help providers be found.
                        </p>
                        {/* Confirm the bahali.org About page address */}
                        <a className="text-link" href="https://bahali.org/about/">
                            Learn more about Bahali →
                        </a>
                    </div>
                </section>

                {/* FINAL INVITATION */}
                <section className="closing" id="join">
                    <div className="eyebrow">AN INVITATION TO PARTICIPATE</div>

                    <h2>Help make support easier to find, wherever people call home.</h2>

                    <p>Join Bahali in making information about emotional wellness support more accessible across Caribbean communities and the diaspora.</p>

                    {/* Provider application form */}
                    <Link className="button light-button" href={SIGNUP_URL}>
                        Apply to join the directory →
                    </Link>
                </section>
            </main>
        </LandingLayout>
    );
}
