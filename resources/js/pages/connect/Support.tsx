import { Link, useForm } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { SearchSelect } from '@/components/connect/SearchSelect';
import { CONNECT_URLS as URLS, CONTACT_EMAIL, DIRECTORY_EMAIL } from '@/components/connect/links';

/**
 * Contact and Report a concern (reference LegalPages.jsx → SupportPage, LEGAL_AND_SUPPORT.md).
 * Sent to App\Http\Controllers\Web\ConnectController@submit: validated and stored on the server,
 * then emailed to staff. Success is shown only after the server accepts the message; on failure
 * the visitor's text stays in the form. Report may be anonymous unless a reply is requested.
 */

const TOPICS: [string, string][] = [
    ['directory', 'Using the directory'],
    ['account', 'Provider application or account'],
    ['privacy', 'Privacy or data request'],
    ['accessibility', 'Accessibility or technical issue'],
    ['other', 'Other question'],
];

const CONCERNS = [
    'Incorrect or outdated profile information',
    'Credentials or misleading claims',
    'Inappropriate conduct',
    'Privacy or safety concern',
    'Technical or accessibility issue',
    'Other concern',
];

interface Props {
    report?: boolean;
    topic?: string;
    profile?: string;
    sent?: boolean;
}

export default function Support({ report = false, topic: initialTopic = 'directory', profile = '', sent = false }: Props) {
    const form = useForm<{
        kind: string;
        topic: string;
        category: string;
        profile: string;
        message: string;
        wants_reply: boolean;
        name: string;
        email: string;
        website: string;
    }>({
        kind: report ? 'report' : 'contact',
        topic: TOPICS.some(([v]) => v === initialTopic) ? initialTopic : 'directory',
        category: '',
        profile,
        message: '',
        wants_reply: false,
        name: '',
        email: '',
        website: '', // honeypot — real visitors never see or fill this
    });
    const [failed, setFailed] = useState(false);
    const { data, setData, processing } = form;
    // "form" = server-side failure (not tied to one field) — see ConnectController@submit.
    const errors = form.errors as Partial<Record<keyof typeof data | 'form', string>>;

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setFailed(false);
        form.post(report ? URLS.report : URLS.contact, {
            preserveScroll: true,
            onSuccess: () => form.reset('message', 'name', 'email', 'profile', 'category', 'wants_reply'),
            onError: (errs: Record<string, string>) => {
                if (errs.form) setFailed(true);
            },
        });
    };

    const emailRequired = !report || data.wants_reply;

    return (
        <ConnectLayout
            page={report ? 'report' : 'contact'}
            title={report ? 'Report a concern' : 'Contact'}
            description={
                report
                    ? 'Let the Bahali Connect team know if something on a profile seems inaccurate or an interaction has concerned you.'
                    : 'Get in touch about the directory, your provider account, accessibility or privacy.'
            }
        >
            <section className="page-intro support-intro">
                <div className="wrap">
                    <p className="eyebrow">{report ? 'HELP KEEP CONNECT ACCURATE' : 'CONTACT CONNECT'}</p>
                    <h1>{report ? 'Report a concern.' : 'How can we help?'}</h1>
                    <p className="lead">
                        {report
                            ? 'If something on a profile seems inaccurate or an interaction has concerned you, you can let our team know here.'
                            : 'Have a question or need help finding your way around? Get in touch about the directory, your provider account, accessibility or privacy.'}
                    </p>
                </div>
            </section>

            <section className="section wrap support-layout">
                <aside>
                    <h2>{report ? 'What to include' : 'Find the help you need'}</h2>
                    {report ? (
                        <p>Describe the issue and identify the relevant profile or page. Include only information needed to understand the concern.</p>
                    ) : (
                        <>
                            <h3>Provider inquiries</h3>
                            <p>
                                Have a question about joining Bahali Connect or managing your listing? Email{' '}
                                <a href={`mailto:${DIRECTORY_EMAIL}`}>{DIRECTORY_EMAIL}</a> for help with your application, account, profile updates or
                                questions about credential verification.
                            </p>
                            <h3>Privacy and removal requests</h3>
                            <p>
                                To ask about your personal information, withdraw your application or request removal of your profile, email{' '}
                                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                            </p>
                            <h3>Trying to reach a provider?</h3>
                            <p>
                                Use the contact details on the provider’s profile to ask about services, fees or appointments. Your message goes directly to the
                                provider.
                            </p>
                        </>
                    )}
                    <p>
                        {report
                            ? 'You may leave your name and email blank. Without an email address, the team cannot ask follow-up questions or reply.'
                            : 'Use Report a concern for incorrect profile information, misleading credentials, inappropriate conduct or privacy concerns.'}
                    </p>
                    <Link href={report ? URLS.contact : URLS.report}>{report ? 'General question? Contact Connect' : 'Report a concern'}</Link>
                    <div className="support-note">
                        <h3>Your privacy matters</h3>
                        <p>
                            To protect your privacy, share only what we need to understand your question. Please leave out medical records, passwords,
                            identity documents and private details about other people. Please do not send attachments.
                        </p>
                        <Link href={URLS.privacy}>Read the Privacy Policy</Link>
                    </div>
                    <div className="support-note">
                        <h3>Not for urgent help</h3>
                        <p>These forms are not monitored for emergencies. If there is immediate danger, contact emergency services where you are.</p>
                    </div>
                    {report && (
                        <p className="small">
                            A directory report is separate from a complaint to a relevant licensing body or authority. A report does not guarantee a
                            particular outcome.
                        </p>
                    )}
                </aside>

                <form className="auth-card support-form" onSubmit={submit} noValidate>
                    <h2>{report ? 'Tell us about the concern' : 'Send an inquiry'}</h2>

                    {sent && (
                        <div className="form-success" role="status">
                            <strong>{report ? 'Thank you. Your concern has been received.' : 'Thank you. Your message has been received.'}</strong>
                            <p>
                                {report
                                    ? 'Bahali’s administrative team will review it. If you asked for a reply, we will use the email address you gave.'
                                    : 'We will reply to the email address you gave.'}
                            </p>
                        </div>
                    )}

                    {report ? (
                        <>
                            <label htmlFor="concern-category">
                                Type of concern
                                <SearchSelect
                                    id="concern-category"
                                    invalid={!!errors.category}
                                    value={data.category}
                                    onChange={(v) => setData('category', v)}
                                    options={CONCERNS}
                                    placeholder="Select a concern"
                                    searchPlaceholder="Search concerns"
                                />
                                {errors.category && <span className="field-error">{errors.category}</span>}
                            </label>
                            <label>
                                Provider name or page link <span className="muted">(optional)</span>
                                <input
                                    name="profile"
                                    value={data.profile}
                                    onChange={(e) => setData('profile', e.target.value)}
                                    placeholder="Provider name or directory page"
                                    maxLength={500}
                                />
                            </label>
                        </>
                    ) : (
                        <label htmlFor="contact-topic">
                            What is your question about?
                            <SearchSelect
                                id="contact-topic"
                                value={data.topic}
                                onChange={(v) => setData('topic', v)}
                                options={TOPICS.map(([value, label]) => ({ value, label }))}
                                fallbackToFirst
                                searchPlaceholder="Search topics"
                            />
                        </label>
                    )}

                    <label>
                        {report ? 'What happened?' : 'Your message'}
                        <textarea
                            name="message"
                            required
                            minLength={10}
                            maxLength={3000}
                            placeholder="Please include only information needed to understand your message."
                            rows={6}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            aria-invalid={errors.message ? true : undefined}
                        />
                        {errors.message && <span className="field-error">{errors.message}</span>}
                    </label>

                    {report && (
                        <label className="check-label">
                            <input type="checkbox" checked={data.wants_reply} onChange={(e) => setData('wants_reply', e.target.checked)} />I would like a
                            reply about this concern.
                        </label>
                    )}

                    <label>
                        Your name <span className="muted">(optional)</span>
                        <input name="name" placeholder="Your name" maxLength={100} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    </label>
                    <label>
                        Email address {!emailRequired && <span className="muted">(optional)</span>}
                        <input
                            name="email"
                            type="email"
                            required={emailRequired}
                            placeholder="you@example.com"
                            maxLength={254}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            aria-invalid={errors.email ? true : undefined}
                        />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                    </label>

                    {/* Spam protection: hidden from people and screen readers. */}
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                        <label>
                            Website
                            <input tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => setData('website', e.target.value)} />
                        </label>
                    </div>

                    <p className="small">
                        {report
                            ? 'Report details are used to assess and follow up on the concern, as explained in the Privacy Policy.'
                            : 'The contact details you provide are used to respond to your inquiry.'}{' '}
                        <Link href={URLS.privacy}>Privacy Policy</Link>
                    </p>
                    <button className="button" type="submit" disabled={processing}>
                        {processing ? 'Sending…' : report ? 'Submit concern' : 'Send inquiry'}
                    </button>

                    {(failed || errors.form) && (
                        <div className="form-error" role="alert">
                            <strong>Your message could not be sent.</strong>
                            <p>
                                {errors.form ? `${errors.form} ` : ''}Please try again later, or email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                                . Email includes your email address; if you prefer to report anonymously, please try this form again later.
                            </p>
                        </div>
                    )}
                </form>
            </section>
        </ConnectLayout>
    );
}
