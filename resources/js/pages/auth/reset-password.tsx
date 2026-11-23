import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { Rich, reader, type ConnectContent } from '@/components/connect/content';

/**
 * Provider "choose a new password" page (opened from the reset email) — Bahali Connect design,
 * same layout as the login and "Reset your password" pages. Same Laravel flow: route('password.store').
 */

interface ResetPasswordProps {
    token: string;
    email: string;
}

interface ResetPasswordForm {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    // Text from Admin → CMS → Website Pages → Login & Password (shared by HandleInertiaRequests).
    const t = reader(usePage<{ connectAuth?: ConnectContent }>().props.connectAuth);
    const { data, setData, post, processing, errors, reset } = useForm<ResetPasswordForm>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <ConnectLayout page="providers" title={t('reset.seo_title')} description={t('reset.seo_description')}>
            <section className="auth-layout wrap">
                <div className="auth-intro">
                    <p className="eyebrow">{t('intro.eyebrow')}</p>
                    <h1>
                        <Rich text={t('intro.title')} />
                    </h1>
                    <p className="lead">
                        <Rich text={t('intro.lead')} />
                    </p>
                    <aside className="provider-appreciation">
                        <h2>
                            <Rich text={t('thanks.title')} />
                        </h2>
                        <p>
                            <Rich text={t('thanks.body')} />
                        </p>
                    </aside>
                </div>

                <form className="auth-card" onSubmit={submit} noValidate>
                    <h2>{t('reset.title')}</h2>
                    <p>
                        <Rich text={t('reset.intro')} />
                    </p>

                    {/* Email comes from the reset link and can't be changed here. */}
                    <label htmlFor="email">
                        {t('reset.email_label')}
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={data.email}
                            readOnly
                            onChange={(e) => setData('email', e.target.value)}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            style={{ background: 'var(--ivory)', cursor: 'default' }}
                        />
                    </label>
                    {errors.email && (
                        <p id="email-error" className="field-error" role="alert">
                            {errors.email}
                        </p>
                    )}

                    <label htmlFor="password">
                        {t('reset.password_label')}
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            placeholder={t('reset.password_placeholder')}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                        />
                    </label>
                    {errors.password && (
                        <p id="password-error" className="field-error" role="alert">
                            {errors.password}
                        </p>
                    )}

                    <label htmlFor="password_confirmation">
                        {t('reset.confirm_label')}
                        <input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            required
                            autoComplete="new-password"
                            placeholder={t('reset.confirm_placeholder')}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            aria-invalid={!!errors.password_confirmation}
                            aria-describedby={errors.password_confirmation ? 'password-confirmation-error' : undefined}
                        />
                    </label>
                    {errors.password_confirmation && (
                        <p id="password-confirmation-error" className="field-error" role="alert">
                            {errors.password_confirmation}
                        </p>
                    )}

                    <button className="button" type="submit" disabled={processing} aria-busy={processing}>
                        {processing ? t('reset.busy') : t('reset.button')}
                    </button>

                    <p className="auth-switch">
                        {t('reset.switch')}{' '}
                        <Link as="button" type="button" className="text-button" href={route('login')}>
                            {t('reset.back')}
                        </Link>
                    </p>
                </form>
            </section>
        </ConnectLayout>
    );
}
