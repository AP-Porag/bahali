import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';

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
        <ConnectLayout page="providers" title="Choose a new password" description="Choose a new password for your Bahali Connect provider account.">
            <section className="auth-layout wrap">
                <div className="auth-intro">
                    <p className="eyebrow">BAHALI CONNECT FOR PROVIDERS</p>
                    <h1>Welcome back.</h1>
                    <p className="lead">Return to your application or manage your published profile.</p>
                    <aside className="provider-appreciation">
                        <h2>Thank you for the work you do.</h2>
                        <p>
                            Your care, time and experience matter. We are grateful you are part of Bahali Connect’s effort to make support easier to
                            find across Caribbean communities and the diaspora.
                        </p>
                    </aside>
                </div>

                <form className="auth-card" onSubmit={submit} noValidate>
                    <h2>Choose a new password</h2>
                    <p>Please enter your new password below.</p>

                    {/* Email comes from the reset link and can't be changed here. */}
                    <label htmlFor="email">
                        Email address
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
                        New password
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            placeholder="Enter a new password"
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
                        Confirm new password
                        <input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            required
                            autoComplete="new-password"
                            placeholder="Re-enter the new password"
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
                        {processing ? 'Saving…' : 'Reset password'}
                    </button>

                    <p className="auth-switch">
                        Remembered your password?{' '}
                        <Link as="button" type="button" className="text-button" href={route('login')}>
                            Back to login
                        </Link>
                    </p>
                </form>
            </section>
        </ConnectLayout>
    );
}
