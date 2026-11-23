import { Link, useForm } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { SearchSelect } from '@/components/connect/SearchSelect';
import { Rich, reader, type ConnectContent } from '@/components/connect/content';
import { CONNECT_URLS as URLS } from '@/components/connect/links';

/**
 * Contact and Report a concern (reference LegalPages.jsx → SupportPage, LEGAL_AND_SUPPORT.md).
 * Sent to App\Http\Controllers\Web\ConnectController@submit: validated and stored on the server,
 * then emailed to staff. Success is shown only after the server accepts the message; on failure
 * the visitor's text stays in the form. Report may be anonymous unless a reply is requested.
 */

/* Topic values are checked on the server (ConnectController::TOPICS); the labels come from the CMS. */
const TOPICS = ['directory', 'account', 'privacy', 'accessibility', 'other'];

/* Concern names are stored with each report and checked on the server (ConnectController::CONCERNS). */
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
    content?: ConnectContent;
}

export default function Support({ report = false, topic: initialTopic = 'directory', profile = '', sent = false, content }: Props) {
    const t = reader(content);
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
        topic: TOPICS.includes(initialTopic) ? initialTopic : 'directory',
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
        <ConnectLayout page={report ? 'report' : 'contact'} title={t('seo.title')} description={t('seo.description')}>
            <section className="page-intro support-intro">
                <div className="wrap">
                    <p className="eyebrow">{t('intro.eyebrow')}</p>
                    <h1>
                        <Rich text={t('intro.title')} />
                    </h1>
                    <p className="lead">
                        <Rich text={t('intro.lead')} />
                    </p>
                </div>
            </section>

            <section className="section wrap support-layout">
                <aside>
                    <h2>
                        <Rich text={t('aside.title')} />
                    </h2>
                    {report ? (
                        <p>
                            <Rich text={t('aside.body')} />
                        </p>
                    ) : (
                        <>
                            <h3>{t('aside.provider_title')}</h3>
                            <p>
                                <Rich text={t('aside.provider_body')} />
                            </p>
                            <h3>{t('aside.privacy_title')}</h3>
                            <p>
                                <Rich text={t('aside.privacy_body')} />
                            </p>
                            <h3>{t('aside.reach_title')}</h3>
                            <p>
                                <Rich text={t('aside.reach_body')} />
                            </p>
                        </>
                    )}
                    <p>
                        <Rich text={t('aside.note')} />
                    </p>
                    <Link href={report ? URLS.contact : URLS.report}>{t('aside.link')}</Link>
                    <div className="support-note">
                        <h3>{t('privacy.title')}</h3>
                        <p>
                            <Rich text={t('privacy.body')} />
                        </p>
                        <Link href={URLS.privacy}>{t('privacy.link')}</Link>
                    </div>
                    <div className="support-note">
                        <h3>{t('urgent.title')}</h3>
                        <p>
                            <Rich text={t('urgent.body')} />
                        </p>
                    </div>
                    {report && (
                        <p className="small">
                            <Rich text={t('aside.small')} />
                        </p>
                    )}
                </aside>

                <form className="auth-card support-form" onSubmit={submit} noValidate>
                    <h2>{t('form.title')}</h2>

                    {sent && (
                        <div className="form-success" role="status">
                            <strong>{t('success.title')}</strong>
                            <p>
                                <Rich text={t('success.body')} />
                            </p>
                        </div>
                    )}

                    {report ? (
                        <>
                            <label htmlFor="concern-category">
                                {t('form.category_label')}
                                <SearchSelect
                                    id="concern-category"
                                    invalid={!!errors.category}
                                    value={data.category}
                                    onChange={(v) => setData('category', v)}
                                    options={CONCERNS}
                                    placeholder={t('form.category_placeholder')}
                                    searchPlaceholder={t('form.category_search')}
                                />
                                {errors.category && <span className="field-error">{errors.category}</span>}
                            </label>
                            <label>
                                {t('form.profile_label')} <span className="muted">{t('form.optional')}</span>
                                <input
                                    name="profile"
                                    value={data.profile}
                                    onChange={(e) => setData('profile', e.target.value)}
                                    placeholder={t('form.profile_placeholder')}
                                    maxLength={500}
                                />
                            </label>
                        </>
                    ) : (
                        <label htmlFor="contact-topic">
                            {t('form.topic_label')}
                            <SearchSelect
                                id="contact-topic"
                                value={data.topic}
                                onChange={(v) => setData('topic', v)}
                                options={TOPICS.map((value) => ({ value, label: t(`topic.${value}`) }))}
                                fallbackToFirst
                                searchPlaceholder={t('form.topic_search')}
                            />
                        </label>
                    )}

                    <label>
                        {t('form.message_label')}
                        <textarea
                            name="message"
                            required
                            minLength={10}
                            maxLength={3000}
                            placeholder={t('form.message_placeholder')}
                            rows={6}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            aria-invalid={errors.message ? true : undefined}
                        />
                        {errors.message && <span className="field-error">{errors.message}</span>}
                    </label>

                    {report && (
                        <label className="check-label">
                            <input type="checkbox" checked={data.wants_reply} onChange={(e) => setData('wants_reply', e.target.checked)} />
                            {t('form.reply_label')}
                        </label>
                    )}

                    <label>
                        {t('form.name_label')} <span className="muted">{t('form.optional')}</span>
                        <input name="name" placeholder={t('form.name_placeholder')} maxLength={100} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    </label>
                    <label>
                        {t('form.email_label')} {!emailRequired && <span className="muted">{t('form.optional')}</span>}
                        <input
                            name="email"
                            type="email"
                            required={emailRequired}
                            placeholder={t('form.email_placeholder')}
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
                        <Rich text={t('form.privacy_note')} /> <Link href={URLS.privacy}>{t('form.privacy_link')}</Link>
                    </p>
                    <button className="button" type="submit" disabled={processing}>
                        {processing ? t('form.sending') : t('form.submit')}
                    </button>

                    {(failed || errors.form) && (
                        <div className="form-error" role="alert">
                            <strong>{t('error.title')}</strong>
                            <p>
                                {errors.form ? `${errors.form} ` : ''}
                                <Rich text={t('error.body')} />
                            </p>
                        </div>
                    )}
                </form>
            </section>
        </ConnectLayout>
    );
}
