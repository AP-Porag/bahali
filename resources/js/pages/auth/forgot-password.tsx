import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';

/**
 * Provider password reset request — Bahali Connect design (reference: /provider/login/ → "Forgot password?").
 * Same Laravel flow as before: route('password.email') emails the reset link.
 */

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <ConnectLayout
            page="providers"
            title="Reset your password"
            description="Request a link to reset the password for your Bahali Connect provider account."
        >
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
                    <h2>Reset your password</h2>
                    <p>Enter the email address associated with your provider account.</p>

                    <label htmlFor="email">
                        Email address
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
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
                        {processing ? 'Sending…' : 'Send reset link'}
                    </button>

                    {status && (
                        <div className="form-success" role="status">
                            <p>{status}</p>
                        </div>
                    )}

                    <Link as="button" type="button" className="text-button" href={route('login')}>
                        Back to login
                    </Link>
                </form>
            </section>
        </ConnectLayout>
    );
}
