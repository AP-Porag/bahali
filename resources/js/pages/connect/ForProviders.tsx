import { Link } from '@inertiajs/react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { CONNECT_URLS as URLS, DIRECTORY_EMAIL } from '@/components/connect/links';

/**
 * For Providers — recruitment page (reference src.jsx → Providers).
 * "Start your application" opens the existing provider application (account, email code, review).
 * Hero photograph: the approved "providers in community" image, reused from the homepage (4:3).
 */
export default function ForProviders() {
    return (
        <ConnectLayout
            page="providers"
            title="For providers"
            description="Share your services with Caribbean communities and the diaspora. Free to apply. Free to list an approved profile."
        >
            <section className="provider-hero wrap provider-hero-grid">
                <div>
                    <p className="eyebrow">FOR CLINICAL AND COMMUNITY PROVIDERS</p>
                    <h1>
                        Make your support
                        <br />
                        <em>easier to find.</em>
                    </h1>
                    <p className="lead">
                        Share your services with Caribbean communities and the diaspora. Give someone looking for support a clear way to learn about your
                        work and reach you directly.
                    </p>
                    <p>
                        <strong>Free to apply. Free to list an approved profile.</strong>
                    </p>
                    <div className="button-row">
                        <a className="button" href={URLS.signup}>
                            Start your application
                        </a>
                        <a className="text-button" href={URLS.login}>
                            Provider login
                        </a>
                    </div>
                </div>
                <figure className="connect-photo" style={{ ['--photo-ratio' as string]: '4 / 3' }}>
                    <img
                        src="/images/connect/providers-in-community.jpg"
                        alt="Two women talking over coffee in a relaxed seating area."
                        width="1400"
                        height="1050"
                    />
                </figure>
            </section>

            <section className="wrap benefits">
                <div>
                    <h3>Describe your work</h3>
                    <p>Describe who you support, what you offer and what a first meeting with you might be like.</p>
                </div>
                <div>
                    <h3>Show where you are available</h3>
                    <p>List the communities you serve and explain whether you meet in person, virtually or both.</p>
                </div>
                <div>
                    <h3>Connect directly</h3>
                    <p>Share your contact details so those seeking support can reach you with questions.</p>
                </div>
            </section>

            <section className="section wrap provider-details">
                <div>
                    <p className="eyebrow">PROVIDER ELIGIBILITY</p>
                    <h2>Who can apply?</h2>
                    <p>
                        We welcome applications from providers offering clinical care, counseling, pastoral care, peer support, allied health services or
                        community-based emotional support. Eligibility depends on your role and the services you offer.
                    </p>
                    <p>
                        Providers from all backgrounds are welcome to apply. If you have experience supporting Caribbean individuals, families or
                        communities, you can describe that work in your own words.
                    </p>
                    <h3>Do I need credential verification?</h3>
                    <p>
                        No. We are developing an optional credential verification service. Only that service will carry a fee, and you will see the amount
                        before you decide.
                    </p>
                </div>
                <div className="application-steps">
                    <h3>How to join</h3>
                    {[
                        ['1', 'Create your provider account', 'Save your progress and come back when you are ready.'],
                        [
                            '2',
                            'Tell us about your work',
                            'Describe your services, who you support and where you are available. Choose the contact details you would like to share on your profile.',
                        ],
                        [
                            '3',
                            'Submit your application for review',
                            'The Bahali team reviews your application and may ask for more information. Once approved, your profile appears in the directory.',
                        ],
                    ].map(([n, t, b]) => (
                        <div className="step" key={n}>
                            <span className="step-number">{n}</span>
                            <div>
                                <h3>{t}</h3>
                                <p>{b}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="wrap provider-spotlight-summary" aria-labelledby="spotlight-summary-heading">
                <p className="eyebrow">SHARING YOUR WORK</p>
                <h2 id="spotlight-summary-heading">Provider spotlights</h2>
                <p>
                    From time to time, we feature providers to help readers learn about different services and approaches. Selection considers relevance
                    to readers, current profile information and a range of roles and locations. There is no charge or paid preference, and credential
                    verification does not influence selection. Participation is optional and requires permission.
                </p>
                <Link href={URLS.spotlight}>Read the Provider Spotlight Policy</Link>
            </section>

            <section className="closing wrap">
                <h2>Ready to join Bahali Connect?</h2>
                <p>
                    Be part of Bahali’s mission to reduce mental health stigma and improve access to care and support. Let your profile be a starting
                    point for someone seeking support in the communities you serve.
                </p>
                <a className="button" href={URLS.signup}>
                    Start your application
                </a>
                <p>
                    Questions before you apply? Email <a href={`mailto:${DIRECTORY_EMAIL}`}>{DIRECTORY_EMAIL}</a>.
                </p>
            </section>
        </ConnectLayout>
    );
}
