//
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

const COLORS = {
    ivory: '#FAFAF6',
    teal: '#1E4D4A',
    coral: '#E99E84',
    sage: '#9CAEA9',
    gold: '#C89B4B',
    text: '#292F30',
    muted: '#5D6265',
    border: '#D9DAD5',
};

const SERIF = {
    fontFamily: 'Fraunces, "Playfair Display", Georgia, serif',
};

const INPUT_CLASS =
    'h-[54px] w-full rounded-lg border border-[#AEB7B3] bg-white px-[18px] text-[17px] text-[#292F30] shadow-none placeholder:text-[#777B7C] focus-visible:border-[#1E4D4A] focus-visible:ring-[3px] focus-visible:ring-[#1E4D4A]/15';

export default function Login({ status, canResetPassword }: LoginProps) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Provider Sign In" />

            <main
                className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-10 sm:px-6 sm:py-12"
                style={{ backgroundColor: COLORS.ivory }}
            >
                <div className="flex w-full max-w-[576px] flex-col items-center">

                    {/* =================================
                        BAHALI BRAND LOGO
                    ================================== */}

                    <Link
                        href="/"
                        aria-label="Bahali Home"
                        className="mb-[38px] flex flex-col items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E4D4A]"
                    >
                        <img
                            src="/images/Bahali%20_p.png"
                            alt="Bahali Logo"
                            className="h-auto w-[220px] max-w-full object-contain"
                        />

                        {/* <span
                            className="mt-[9px] text-[16px] font-medium uppercase leading-none tracking-[0.28em]"
                            style={{ color: COLORS.teal }}
                        >
                            PROVIDER PORTAL
                        </span> */}
                    </Link>

                    {/* =================================
                        LOGIN CARD
                    ================================== */}

                    <section
                        className="w-full rounded-[16px] border bg-white p-6 shadow-[0_5px_18px_rgba(35,45,40,0.07)] sm:p-10"
                        style={{ borderColor: COLORS.border }}
                    >
                        <form onSubmit={submit} noValidate={false}>

                            {/* Heading */}
                            <div className="mb-[28px]">
                                <h1
                                    className="text-[34px] font-semibold leading-[1.2] tracking-[-0.8px] sm:text-[40px]"
                                    style={{
                                        ...SERIF,
                                        color: COLORS.teal,
                                    }}
                                >
                                    Provider sign-in
                                </h1>

                                <p
                                    className="mt-[10px] text-[17px] leading-[1.5] sm:text-[20px]"
                                    style={{ color: COLORS.muted }}
                                >
                                    Sign in to manage your directory profile.
                                </p>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div
                                    role="status"
                                    className="mb-5 rounded-lg border px-4 py-3 text-sm"
                                    style={{
                                        borderColor: `${COLORS.sage}`,
                                        backgroundColor: `${COLORS.sage}20`,
                                        color: COLORS.teal,
                                    }}
                                >
                                    {status}
                                </div>
                            )}

                            {/* Email Address */}
                            <div className="mb-[27px]">
                                <Label
                                    htmlFor="email"
                                    className="mb-[9px] block text-[16px] font-semibold text-[#242829] sm:text-[18px]"
                                >
                                    Email address
                                </Label>

                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoFocus
                                    autoComplete="username"
                                    tabIndex={1}
                                    placeholder="Enter your email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    aria-invalid={!!errors.email}
                                    className={`${INPUT_CLASS} ${errors.email
                                        ? 'border-[#C2543B] focus-visible:ring-[#C2543B]/20'
                                        : ''
                                        }`}
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-1.5 text-sm text-[#C2543B]"
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-[32px]">

                                <div className="mb-[9px] flex items-center justify-between gap-3">
                                    <Label
                                        htmlFor="password"
                                        className="text-[16px] font-semibold text-[#242829] sm:text-[18px]"
                                    >
                                        Password
                                    </Label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            tabIndex={3}
                                            className="text-[14px] font-medium underline underline-offset-2 transition-opacity hover:opacity-70 sm:text-[16px]"
                                            style={{ color: COLORS.teal }}
                                        >
                                            Forgot your password?
                                        </Link>
                                    )}
                                </div>

                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        tabIndex={2}
                                        placeholder="Enter your password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        aria-invalid={!!errors.password}
                                        className={`${INPUT_CLASS} pr-12 ${errors.password
                                            ? 'border-[#C2543B] focus-visible:ring-[#C2543B]/20'
                                            : ''
                                            }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        tabIndex={4}
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                        aria-pressed={showPassword}
                                        className="absolute right-[14px] top-1/2 -translate-y-1/2 rounded p-1 text-[#737A79] transition-colors hover:text-[#1E4D4A] focus-visible:outline-2 focus-visible:outline-[#1E4D4A]"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={21} strokeWidth={1.8} />
                                        ) : (
                                            <Eye size={21} strokeWidth={1.8} />
                                        )}
                                    </button>
                                </div>

                                <InputError
                                    message={errors.password}
                                    className="mt-1.5 text-sm text-[#C2543B]"
                                />
                            </div>

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                tabIndex={5}
                                className="flex h-[56px] w-full items-center justify-center gap-2 rounded-[9px] text-[18px] font-semibold text-white transition-colors hover:bg-[#163F3C] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#1E4D4A]/30 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[20px]"
                                style={{
                                    backgroundColor: COLORS.teal,
                                }}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle
                                            size={21}
                                            className="animate-spin"
                                        />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>

                            {/* Account Support */}
                            <div className="mt-[20px] text-center">
                                <Link
                                    href="/support"
                                    tabIndex={6}
                                    className="text-[16px] font-medium underline underline-offset-2 transition-opacity hover:opacity-70 sm:text-[18px]"
                                    style={{ color: COLORS.teal }}
                                >
                                    Need help signing in?
                                </Link>
                            </div>

                            {/* Divider */}
                            <div
                                className="my-[27px] border-t"
                                style={{ borderColor: COLORS.border }}
                            />

                            {/* Provider Registration */}
                            <div className="text-center">
                                <p
                                    className="text-[16px] sm:text-[18px]"
                                    style={{ color: COLORS.muted }}
                                >
                                    New to the Bahali provider directory?
                                </p>

                                <Link
                                    href="/provider/apply"
                                    tabIndex={7}
                                    className="mt-[8px] inline-block text-[17px] font-semibold underline underline-offset-2 transition-opacity hover:opacity-70 sm:text-[19px]"
                                    style={{ color: COLORS.teal }}
                                >
                                    Apply to join the directory →
                                </Link>
                            </div>

                        </form>
                    </section>

                    {/* =================================
                        PUBLIC DIRECTORY
                        OUTSIDE LOGIN CARD
                    ================================== */}

                    <div className="mt-[30px] text-center">
                        <p
                            className="text-[16px] sm:text-[18px]"
                            style={{ color: COLORS.muted }}
                        >
                            Looking for mental health support?
                        </p>

                        <Link
                            href="/directory"
                            tabIndex={8}
                            className="mt-[5px] inline-block text-[17px] font-semibold underline underline-offset-2 transition-opacity hover:opacity-70 sm:text-[19px]"
                            style={{ color: COLORS.teal }}
                        >
                            Browse the directory
                        </Link>
                    </div>

                </div>
            </main>
        </>
    );
}
