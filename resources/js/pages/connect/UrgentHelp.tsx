import { Link } from '@inertiajs/react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { CONNECT_URLS as URLS, HELPLINE_URL } from '@/components/connect/links';

/**
 * Urgent Help (reference UrgentHelpPage.jsx). Points to the independent Find A Helpline service,
 * not a Bahali-maintained phone list. Update "Page last checked" only after a real review
 * (quarterly: main link + Jamaica/Haiti listings) — LEGAL_AND_SUPPORT.md.
 */
export default function UrgentHelp() {
    return (
        <ConnectLayout
            page="urgent"
            title="Urgent Help"
            description="If you or someone else is in immediate danger, contact local emergency services now or go to the nearest hospital emergency department."
        >
            <section className="page-intro">
                <div className="wrap">
                    <p className="eyebrow">SUPPORT WHEN YOU NEED IT</p>
                    <h1>Urgent Help</h1>
                    <p className="lead">
                        <strong>
                            If you or someone else is in immediate danger, contact local emergency services now or go to the nearest hospital emergency
                            department.
                        </strong>
                    </p>
                </div>
            </section>
            <article className="wrap urgent-content section">
                <section>
                    <h2>Find support now</h2>
                    <p>
                        You deserve support during difficult moments. Helplines can offer a place to talk, receive emotional support and consider your next
                        steps.
                    </p>
                    <p>
                        <a className="button" href={HELPLINE_URL}>
                            Find a helpline
                        </a>
                    </p>
                    <p>
                        Choose the country where the person needing help is <strong>physically located right now</strong>. This may be different from their
                        home country or where you live.
                    </p>
                    <p>Check each service’s listing for its hours, available languages and ways to get in touch.</p>
                    <p>
                        If no suitable helpline is listed, contact a local health service for guidance.{' '}
                        <strong>If there is immediate danger, contact local emergency services or go to the nearest emergency department.</strong>
                    </p>
                </section>
                <section>
                    <h2>About Bahali Connect</h2>
                    <p>
                        Bahali Connect helps you find providers for ongoing care and support. <strong>We do not provide emergency care.</strong> Our email
                        and contact forms are not monitored for urgent assistance. Please use the options above if you need help now.
                    </p>
                </section>
                <section>
                    <h2>Finding ongoing support</h2>
                    <p>
                        When you are ready to explore ongoing support, Bahali Connect can help you find providers offering services in your location and
                        preferred language.
                    </p>
                    <Link href={URLS.help} className="button">
                        Find ongoing support
                    </Link>
                </section>
                <div className="small muted">
                    <p>Bahali Connect is a service of Bahali Inc. Find A Helpline is an independent service that Bahali does not operate.</p>
                    <p>
                        Page last checked: <time dateTime="2026-11-18">November 18, 2026</time>
                    </p>
                </div>
            </article>
        </ConnectLayout>
    );
}
