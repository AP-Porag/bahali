import { Head, Link, usePage } from '@inertiajs/react';

import LandingLayout, { LANDING_URL, URGENT_SUPPORT_URL } from '@/components/landing/LandingLayout';

/**
 * DIRECTORY DISCLAIMER — DRAFT, SUBJECT TO LEGAL REVIEW (Version 3.7, from Marsha's disclaimer.html).
 * Do not publish until legal counsel has approved the final wording.
 * The first two paragraphs are the wording approved by Bahali's chief of staff.
 * The sections below them were added at the chief of staff's request for counsel to consider:
 * provider independence, accuracy of submitted information, and Bahali's responsibility.
 * Note for counsel: when optional credential verification launches, this page must distinguish
 * ordinary directory approval from credentials independently verified by Bahali (verified badge).
 * Remove the draft badge once the final wording is approved.
 */
export default function Disclaimer() {
    // Header button: Dashboard when signed in (admin → admin dashboard, provider → provider dashboard), Login otherwise.
    const { auth } = usePage<{ auth?: { user?: { role?: string } | null } }>().props;
    const user = auth?.user ?? null;
    const headerButton = user
        ? { label: 'Dashboard', href: user.role === 'admin' ? '/admin/dashboard' : '/provider/dashboard' }
        : { label: 'Login', href: '/login' };

    return (
        <LandingLayout button={headerButton}>
            <Head title="Directory Disclaimer — Bahali Provider Directory" />

            <main className="section page-aligned">
                <div className="faq">
                    <div className="draft-badge">Draft — subject to legal review</div>

                    <h1 style={{ fontSize: 'clamp(34px,4vw,47px)' }}>Bahali Provider Directory Disclaimer</h1>

                    <p style={{ marginTop: '24px' }}>
                        Inclusion in the Bahali Provider Directory does not constitute an endorsement, independent verification of credentials, or
                        guarantee of a provider's qualifications, services or outcomes.
                    </p>

                    <p>
                        Individuals are encouraged to confirm professional credentials and suitability directly with providers and relevant licensing
                        authorities, where applicable.
                    </p>

                    <h2 className="safety-heading">Independent providers</h2>
                    <p>
                        Providers listed in the directory are independent. They are not employees, agents or representatives of Bahali, and Bahali does
                        not direct or supervise the services they provide.
                    </p>

                    <h2 className="safety-heading">Information supplied by providers</h2>
                    <p>
                        Profile information, including roles, qualifications, services, languages, locations and availability, is supplied by providers
                        and may change after publication. Bahali reviews applications against its directory eligibility criteria and standards. This
                        review does not constitute independent verification of professional credentials. Bahali cannot guarantee that every detail is
                        accurate, complete or current. If you believe a listing contains inaccurate information, please contact{' '}
                        <a href="mailto:directory@bahali.org">directory@bahali.org</a>.
                    </p>

                    <h2 className="safety-heading">Arrangements with providers</h2>
                    <p>
                        Any arrangement for services, including fees, scheduling and the care provided, is between the individual and the provider.
                        Bahali is not a party to these arrangements and is not responsible for the services delivered by listed providers.
                    </p>

                    <h2 className="safety-heading">Not an emergency service</h2>
                    <p>
                        The Bahali Provider Directory is not an emergency or crisis service. If you or someone else is in immediate danger, call your
                        local emergency number or go to the nearest hospital emergency department. See{' '}
                        <Link href={URGENT_SUPPORT_URL}>Need urgent support?</Link> for emergency and crisis numbers.
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
