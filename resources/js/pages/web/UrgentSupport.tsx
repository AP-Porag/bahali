import { Head, Link, usePage } from '@inertiajs/react';

import LandingLayout, { LANDING_URL } from '@/components/landing/LandingLayout';

/**
 * NEED URGENT SUPPORT? — safety-information page (Version 3.7, from Marsha's urgent-support.html).
 * Linked from the footer of every directory page.
 * Numbers were checked on 5 November 2026 against official and published sources.
 * HOLD: publish only when every number is confirmed. Re-check this list before launch and at least every six months.
 * Bahali does not provide emergency or crisis services; keep that statement at the top of the page.
 */

const NUMBERS: { location: string; emergency: string; crisis: string }[] = [
    { location: 'Antigua and Barbuda', emergency: '911 or 999', crisis: 'Not yet confirmed' },
    { location: 'The Bahamas', emergency: '919 or 911', crisis: 'National Suicide Prevention Hotline: 322-2763 (24 hours)' },
    { location: 'Barbados', emergency: 'Police 211 · Ambulance 511 · Fire 311', crisis: 'Lifeline Barbados: 536-4500 (24 hours)' },
    { location: 'Belize', emergency: '911', crisis: 'Not yet confirmed' },
    { location: 'British Virgin Islands', emergency: '999 or 911', crisis: 'Not yet confirmed' },
    { location: 'Cayman Islands', emergency: '911', crisis: 'CayMind: 1-800-534-6463 (Monday to Friday, 6pm to 11pm)' },
    { location: 'Dominica', emergency: '999', crisis: 'Not yet confirmed' },
    { location: 'Dominican Republic', emergency: '911', crisis: 'Not yet confirmed' },
    { location: 'Grenada', emergency: '911', crisis: '988 Suicide Hotline for Crisis Response (free)' },
    { location: 'Guyana', emergency: 'Police 911 · Fire 912 · Ambulance 913', crisis: 'National Suicide Prevention Helpline: 915 (24 hours, free)' },
    { location: 'Haiti', emergency: 'Police 114 · Ambulance 116 · Fire 115', crisis: 'Not yet confirmed' },
    { location: 'Jamaica', emergency: 'Police 119 · Ambulance and fire 110', crisis: 'Mental Health and Suicide Prevention Helpline: 888-NEW-LIFE (888-639-5433)' },
    { location: 'Puerto Rico and U.S. Virgin Islands', emergency: '911', crisis: '988 Suicide & Crisis Lifeline: call or text 988' },
    { location: 'Saint Kitts and Nevis', emergency: '911 · Fire 333', crisis: 'Not yet confirmed' },
    { location: 'Saint Lucia', emergency: '911 or 999', crisis: 'National Helpline: #203 (24 hours)' },
    { location: 'Saint Vincent and the Grenadines', emergency: '911 or 999', crisis: 'Not yet confirmed' },
    { location: 'Trinidad and Tobago', emergency: 'Police 999 · Ambulance 811 · Fire 990', crisis: 'Lifeline: 800-5588 or 866-5433 (24 hours, free)' },
    { location: 'Turks and Caicos Islands', emergency: '911 or 999', crisis: 'Not yet confirmed' },
    { location: 'United States', emergency: '911', crisis: '988 Suicide & Crisis Lifeline: call or text 988' },
    { location: 'Canada', emergency: '911', crisis: '9-8-8 Suicide Crisis Helpline: call or text 988' },
    { location: 'United Kingdom', emergency: '999 or 112', crisis: 'Samaritans: 116 123 (24 hours, free) · NHS 111 for urgent mental health help' },
];

export default function UrgentSupport() {
    // Header button: Dashboard when signed in (admin → admin dashboard, provider → provider dashboard), Login otherwise.
    const { auth } = usePage<{ auth?: { user?: { role?: string } | null } }>().props;
    const user = auth?.user ?? null;
    const headerButton = user
        ? { label: 'Dashboard', href: user.role === 'admin' ? '/admin/dashboard' : '/provider/dashboard' }
        : { label: 'Login', href: '/login' };

    return (
        <LandingLayout button={headerButton}>
            <Head title="Need urgent support? — Bahali Provider Directory" />

            <main className="section page-aligned">
                <div className="faq">
                    <div className="eyebrow coral">SAFETY INFORMATION</div>
                    <h1 style={{ fontSize: 'clamp(34px,4vw,47px)' }}>Need urgent support?</h1>

                    <div className="safety-callout">
                        <p>
                            <strong>
                                If you or someone else is in immediate danger, call your local emergency number now or go to the nearest hospital
                                emergency department.
                            </strong>
                        </p>
                        <p>
                            The Bahali Provider Directory helps people find ongoing support. It is not an emergency or crisis service, and Bahali
                            cannot respond to emergencies.
                        </p>
                    </div>

                    <p>
                        If you are thinking about harming yourself, or you do not feel safe, please reach out now. You do not have to explain
                        everything to ask for help. If you are concerned that someone may be in immediate danger, contact local emergency services. If
                        it is safe, remain with them until help arrives.
                    </p>

                    <h2 className="safety-heading">Emergency and crisis numbers</h2>
                    <p>
                        Find the place where you are now. Emergency numbers work only in the country or territory listed. If your location is not
                        shown, call your local emergency number or go to the nearest hospital.
                    </p>

                    <div className="table-wrap">
                        <table className="safety-table">
                            <thead>
                                <tr>
                                    <th scope="col">Location</th>
                                    <th scope="col">Emergency</th>
                                    <th scope="col">Crisis and support lines</th>
                                </tr>
                            </thead>
                            <tbody>
                                {NUMBERS.map((row) => (
                                    <tr key={row.location}>
                                        <th scope="row">{row.location}</th>
                                        <td>{row.emergency}</td>
                                        <td>{row.crisis}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="table-note">
                        Where a crisis line is marked "Not yet confirmed", no dedicated mental health crisis hotline has been confirmed for this
                        location. This does not mean that mental health services are unavailable; it means we have not established a reliable,
                        publicly accessible crisis hotline. The emergency number still applies. Numbers were last checked in November 2026. If a number
                        does not connect, contact local police or go to the nearest hospital.
                    </p>

                    <h2 className="safety-heading">Finding ongoing support</h2>
                    <p>
                        Once you are safe, ongoing support can help. When you feel ready, you can use the Bahali Provider Directory to find a provider
                        near you or online.
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
