import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { Rich, reader, type ConnectContent } from '@/components/connect/content';
import { CONNECT_URLS as URLS } from '@/components/connect/links';

/**
 * Provider login — Bahali Connect design (reference: /provider/login/).
 * Same Laravel login as before (route('login')); "Apply to join" opens the provider application.
 */

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    // Text from Admin → CMS → Website Pages → Login & Password (shared by HandleInertiaRequests).
    const t = reader(usePage<{ connectAuth?: ConnectContent }>().props.connectAuth);
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <ConnectLayout page="providers" title={t('login.seo_title')} description={t('login.seo_description')}>
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
                    <h2>{t('login.title')}</h2>

                    {status && (
                        <div className="form-success" role="status">
                            <p>{status}</p>
                        </div>
                    )}

                    <label htmlFor="email">
                        {t('login.email_label')}
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="username"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                    </label>
                    {errors.email && (
                        <p id="email-error" className="field-error" role="alert">
                            {errors.email}
                        </p>
                    )}

                    <label htmlFor="password">
                        {t('login.password_label')}
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
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

                    <button className="button" type="submit" disabled={processing} aria-busy={processing}>
                        {processing ? t('login.busy') : t('login.button')}
                    </button>

                    {canResetPassword && (
                        <Link as="button" type="button" className="text-button" href={route('password.request')}>
                            {t('login.forgot')}
                        </Link>
                    )}

                    <p className="auth-switch">
                        {t('login.switch')}{' '}
                        <Link as="button" type="button" className="text-button" href={URLS.signup}>
                            {t('login.apply')}
                        </Link>
                    </p>
                </form>
            </section>
        </ConnectLayout>
    );
}
