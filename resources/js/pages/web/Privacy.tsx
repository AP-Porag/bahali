import { Head, Link } from '@inertiajs/react';

import LandingLayout, { LANDING_URL } from '@/components/landing/LandingLayout';

/**
 * PRIVACY POLICY — DRAFT, pending technical confirmation and legal review (Version 3.7, from Marsha's privacy.html).
 * Effective date: add the date the policy is formally adopted (draft prepared 5 November 2026).
 * Before publishing: confirm each statement matches how the site actually works
 * (fields collected, technical data and cookies, private-detail option in the application,
 * hosting and encrypted connections, 12-month retention, 30-day response).
 * Remove the draft badge once legal review has signed off.
 * Must be live before the provider application collects any information.
 */
export default function Privacy() {
    return (
        <LandingLayout>
            <Head title="Privacy Policy — Bahali Provider Directory" />

            <main className="section">
                <div className="faq policy">
                    <div className="draft-badge">Draft — subject to legal review</div>

                    <h1 style={{ fontSize: 'clamp(34px,4vw,47px)' }}>Privacy Policy</h1>
                    <p className="policy-meta">
                        Bahali Provider Directory · Effective date: <mark>[to be added when the policy is adopted]</mark> · Draft prepared 5 November
                        2026
                    </p>

                    <p>
                        This policy explains how Bahali collects, uses, stores and shares information through the Bahali Provider Directory. It applies
                        to providers who apply to join the directory and to people who use the directory to find support.
                    </p>

                    <h2 className="safety-heading">1. Who we are</h2>
                    <p>
                        The Bahali Provider Directory is operated by Bahali Inc., a nonprofit organisation registered in the State of Florida, United
                        States. For any question about this policy or your information, contact{' '}
                        <a href="mailto:directory@bahali.org">directory@bahali.org</a>.
                    </p>

                    <h2 className="safety-heading">2. Information we collect from providers</h2>
                    <p>When you apply to join the directory or maintain a profile, we collect:</p>
                    <ul>
                        <li>
                            <strong>Contact details:</strong> your name, email address, telephone number and practice or service address.
                        </li>
                        <li>
                            <strong>Professional information:</strong> your role, qualifications, professional registration or licence details,
                            experience, and the name of your practice or organisation.
                        </li>
                        <li>
                            <strong>Service information:</strong> areas of support, services offered, languages spoken, locations served, and whether
                            you offer in-person or virtual support.
                        </li>
                        <li>
                            <strong>Supporting documents:</strong> any documents you provide to support your application, such as evidence of
                            qualifications or professional registration.
                        </li>
                        <li>
                            <strong>Account information:</strong> if you create an account to manage your profile, your login details.
                        </li>
                        <li>
                            <strong>Communications:</strong> messages you send us about your application or profile.
                        </li>
                    </ul>

                    <h2 className="safety-heading">3. Information we collect from people using the directory</h2>
                    <p>You do not need to create an account or give us your name to search the directory.</p>
                    <p>
                        Like most websites, our systems automatically record standard technical information when you visit, such as your IP address and
                        approximate location, browser and device type, the pages you view, the search filters you use, and the date and time of your
                        visit. We use this information to keep the directory secure, fix problems and understand, in general terms, how the directory is
                        used so we can improve it. We use this information only for these purposes.
                    </p>
                    <p>
                        We use Google Analytics, a service provided by Google, to understand how visitors use the directory, such as which pages are
                        visited and how people find them. Google Analytics uses cookies to collect this information and processes it on our behalf. When
                        you visit the directory, a cookie banner lets you choose whether to allow analytics cookies. You can also control or delete
                        cookies through your browser settings, and you can opt out of Google Analytics by installing the Google Analytics Opt-out
                        Browser Add-on (<a href="https://tools.google.com/dlpage/gaoptout">tools.google.com/dlpage/gaoptout</a>).
                    </p>

                    <h2 className="safety-heading">4. How we use information</h2>
                    <ul>
                        <li>To review applications against the directory's eligibility criteria and standards.</li>
                        <li>To publish approved provider profiles and make them searchable.</li>
                        <li>To contact providers about their application, profile or the directory.</li>
                        <li>To keep the directory accurate, secure and working well.</li>
                        <li>To meet legal obligations.</li>
                    </ul>
                    <p>We do not sell personal information.</p>

                    <h2 className="safety-heading">5. What appears publicly</h2>
                    <p>We hold provider information in two categories.</p>
                    <ul>
                        <li>
                            <strong>Public profile information:</strong> the information you agree to display on your profile, such as your professional
                            name, role, qualifications, areas of support, services, languages spoken, locations served, delivery options and the contact
                            details you approve for display. When your profile is approved, this information can be seen by anyone using the directory.
                        </li>
                        <li>
                            <strong>Private administrative information:</strong> information we collect to review and manage your application, such as
                            personal contact details, supporting documents, professional registration or licence documents, and Bahali's internal review
                            notes. This information is not published.
                        </li>
                    </ul>
                    <p>
                        During the application process, you choose which contact details appear on your public profile. For example, if you offer only
                        virtual support, you may choose not to display your address, and you may choose not to display your telephone number.
                    </p>

                    <h2 className="safety-heading">6. Sharing information</h2>
                    <p>We share information only:</p>
                    <ul>
                        <li>
                            With service providers that help us operate the directory, such as website hosting and analytics services. They may use the
                            information only to provide those services to Bahali.
                        </li>
                        <li>When required by law, or to protect the safety of any person.</li>
                        <li>With your permission.</li>
                    </ul>

                    <h2 className="safety-heading">7. Storage and security</h2>
                    <p>
                        Information is stored on secure servers provided by our hosting provider. We use reasonable safeguards to protect it, including
                        encrypted (HTTPS) connections on every page and access limited to authorised Bahali team members. No system is completely
                        secure, but we take reasonable steps to protect your information.
                    </p>
                    <p>
                        Because providers and users are located in many countries, your information may be stored or processed in the United States or
                        in a country other than your own.
                    </p>

                    <h2 className="safety-heading">8. How long we keep information</h2>
                    <ul>
                        <li>Approved profiles: for as long as the profile is listed in the directory.</li>
                        <li>Applications that are not approved: up to 12 months after the decision.</li>
                        <li>
                            Removed profiles: taken out of the public directory and search results when removed, and deleted from our systems, including
                            caches and backups, within 12 months, unless we must keep information longer by law.
                        </li>
                    </ul>

                    <h2 className="safety-heading">9. Your choices and rights</h2>
                    <p>
                        Providers can ask to see, correct or update their information, change which details are public, or ask us to remove their
                        profile, by contacting <a href="mailto:directory@bahali.org">directory@bahali.org</a>. Depending on where you live, you may have
                        additional rights under local data protection laws. We will respond to requests within 30 days.
                    </p>

                    <h2 className="safety-heading">10. Age</h2>
                    <p>Provider applications are intended for adults aged 18 and over.</p>

                    <h2 className="safety-heading">11. Changes to this policy</h2>
                    <p>We may update this policy from time to time. We will post the updated version on this page and change the effective date above.</p>

                    <h2 className="safety-heading">12. Contact</h2>
                    <p>
                        Questions about this policy can be sent to <a href="mailto:directory@bahali.org">directory@bahali.org</a>.
                    </p>

                    <div className="back-link">
                        <Link className="text-link" href={LANDING_URL}>
                            ← Back to the Provider Directory
                        </Link>
                    </div>
                </div>
            </main>
        </LandingLayout>
    );
}
