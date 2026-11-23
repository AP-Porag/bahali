import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { Rich, reader, type ConnectContent } from '@/components/connect/content';

/**
 * Provider password reset request — Bahali Connect design (reference: /provider/login/ → "Forgot password?").
 * Same Laravel flow as before: route('password.email') emails the reset link.
 */

export default function ForgotPassword({ status }: { status?: string }) {
    // Text from Admin → CMS → Website Pages → Login & Password (shared by HandleInertiaRequests).
    const t = reader(usePage<{ connectAuth?: ConnectContent }>().props.connectAuth);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <ConnectLayout page="providers" title={t('forgot.seo_title')} description={t('forgot.seo_description')}>
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
                    <h2>{t('forgot.title')}</h2>
                    <p>
                        <Rich text={t('forgot.intro')} />
                    </p>

                    <label htmlFor="email">
                        {t('forgot.email_label')}
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder={t('forgot.email_placeholder')}
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

                    <button className="button" type="submit" disabled={processing} aria-busy={processing}>
                        {processing ? t('forgot.busy') : t('forgot.button')}
                    </button>

                    {status && (
                        <div className="form-success" role="status">
                            <p>{status}</p>
                        </div>
                    )}

                    <Link as="button" type="button" className="text-button" href={route('login')}>
                        {t('forgot.back')}
                    </Link>
                </form>
            </section>
        </ConnectLayout>
    );
}
