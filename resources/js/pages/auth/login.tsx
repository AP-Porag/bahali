import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
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
        <ConnectLayout
            page="providers"
            title="Provider login"
            description="Log in to return to your application or manage your published Bahali Connect profile."
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
                    <h2>Provider login</h2>

                    {status && (
                        <div className="form-success" role="status">
                            <p>{status}</p>
                        </div>
                    )}

                    <label htmlFor="email">
                        Email address
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
                        Password
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
                        {processing ? 'Logging in…' : 'Log in to my account'}
                    </button>

                    {canResetPassword && (
                        <Link as="button" type="button" className="text-button" href={route('password.request')}>
                            Forgot password?
                        </Link>
                    )}

                    <p className="auth-switch">
                        New to Bahali Connect?{' '}
                        <Link as="button" type="button" className="text-button" href={URLS.signup}>
                            Apply to join
                        </Link>
                    </p>
                </form>
            </section>
        </ConnectLayout>
    );
}
