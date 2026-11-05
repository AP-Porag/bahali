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
    sage: '#9CAEA9',
    text: '#2C2C2C',
    muted: 'rgba(44, 44, 44, 0.75)',
    border: '#E8D9B8',
};

const SERIF = {
    fontFamily: '"Cormorant Garamond", Georgia, serif',
};

/*
 * Sizes scale with the screen height (clamp + vh), so the whole page — logo, card and the
 * directory link — fits inside 90vh on laptops and phones without scrolling.
 */
const INPUT_CLASS =
    'h-[clamp(48px,5.2vh,54px)] w-full rounded-[10px] border border-[#1E4D4A]/65 bg-white px-[18px] text-[16px] text-[#2C2C2C] shadow-none placeholder:text-[#2C2C2C]/70 focus-visible:border-[#1E4D4A] focus-visible:ring-[3px] focus-visible:ring-[#1E4D4A]/15';

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
                className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-[4vh] font-body text-[#2C2C2C] sm:px-6"
                style={{ backgroundColor: COLORS.ivory }}
            >
                <div className="flex w-full max-w-[576px] flex-col items-center">

                    {/* =================================
                        BAHALI BRAND LOGO
                    ================================== */}

                    <Link
                        href="/"
                        aria-label="Bahali Home"
                        className="mb-[clamp(8px,2vh,32px)] flex flex-col items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E4D4A]"
                    >
                        <img
                            src="/images/Bahali_p.png"
                            alt="Bahali Logo"
                            className="h-[clamp(28px,calc(16vh_-_58px),124px)] w-auto max-w-[320px] object-contain"
                        />

                        <span
                            className="mt-[clamp(4px,0.8vh,9px)] text-[13px] font-semibold uppercase leading-none tracking-[0.24em]"
                            style={{ color: COLORS.teal }}
                        >
                            PROVIDER PORTAL
                        </span>
                    </Link>

                    {/* =================================
                        LOGIN CARD
                    ================================== */}

                    <section
                        className="w-full rounded-[16px] border bg-white px-5 py-[clamp(12px,2.8vh,40px)] shadow-[0_5px_18px_rgba(35,45,40,0.07)] sm:px-10"
                        style={{ borderColor: COLORS.border }}
                    >
                        <form onSubmit={submit} noValidate={false}>

                            {/* Heading */}
                            <div className="mb-[clamp(8px,2vh,28px)]">
                                <h1
                                    className="text-[clamp(24px,min(4.6vh,7.4vw),48px)] font-semibold leading-[1.1]"
                                    style={{
                                        ...SERIF,
                                        color: COLORS.teal,
                                    }}
                                >
                                    Provider sign-in
                                </h1>

                                <p
                                    className="mt-[clamp(2px,0.7vh,10px)] text-[clamp(15px,1.9vh,18px)] leading-[1.6]"
                                    style={{ color: COLORS.muted }}
                                >
                                    Sign in to manage your directory profile.
                                </p>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div
                                    role="status"
                                    className="mb-[clamp(8px,1.6vh,20px)] rounded-lg border px-4 py-[clamp(6px,1.1vh,12px)] text-sm"
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
                            <div className="mb-[clamp(6px,1.8vh,27px)]">
                                <Label
                                    htmlFor="email"
                                    className="mb-[clamp(4px,0.7vh,9px)] block text-[14px] font-semibold text-[#2C2C2C]"
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
                                    className="mt-1.5 text-sm text-[#A8472F]"
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-[clamp(8px,2.2vh,32px)]">

                                <div className="mb-[clamp(4px,0.7vh,9px)] flex items-center justify-between gap-3">
                                    <Label
                                        htmlFor="password"
                                        className="text-[14px] font-semibold text-[#2C2C2C]"
                                    >
                                        Password
                                    </Label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            tabIndex={3}
                                            className="whitespace-nowrap text-[14px] font-medium underline underline-offset-2 transition-colors hover:!text-[#163F3C] hover:decoration-2"
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
                                        className="absolute right-[14px] top-1/2 -translate-y-1/2 rounded p-1 text-[#2C2C2C]/70 transition-colors hover:text-[#1E4D4A] focus-visible:outline-2 focus-visible:outline-[#1E4D4A]"
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
                                    className="mt-1.5 text-sm text-[#A8472F]"
                                />
                            </div>

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                tabIndex={5}
                                className="flex h-[clamp(48px,5.4vh,52px)] w-full items-center justify-center gap-2 rounded-[10px] text-[15px] font-semibold text-white transition-colors hover:!bg-[#163F3C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4D4A] disabled:cursor-not-allowed disabled:opacity-60"
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
                            {/* <div className="mt-[clamp(8px,1.4vh,20px)] text-center">
                                <Link
                                    href={route('password.request')}
                                    tabIndex={6}
                                    className="text-[clamp(14px,1.6vh,16px)] font-medium underline underline-offset-2 transition-colors hover:!text-[#163F3C] hover:decoration-2"
                                    style={{ color: COLORS.teal }}
                                >
                                    Need help signing in?
                                </Link>
                            </div> */}

                            {/* Divider */}
                            <div
                                className="my-[clamp(6px,1.8vh,27px)] border-t"
                                style={{ borderColor: COLORS.border }}
                            />

                            {/* Provider Registration */}
                            <div className="text-center">
                                <p
                                    className="text-[clamp(14px,1.6vh,16px)]"
                                    style={{ color: COLORS.muted }}
                                >
                                    New to the Bahali provider directory?
                                </p>

                                <Link
                                    href={route('providers.create')}
                                    tabIndex={7}
                                    className="mt-[clamp(2px,0.4vh,8px)] inline-block text-[clamp(15px,1.7vh,16px)] font-semibold underline underline-offset-2 transition-colors hover:!text-[#163F3C] hover:decoration-2"
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

                    <div className="mt-[clamp(8px,2vh,30px)] text-center">
                        <p
                            className="text-[clamp(14px,1.6vh,16px)]"
                            style={{ color: COLORS.muted }}
                        >
                            Looking for mental health support?
                        </p>

                        <Link
                            href="/provider"
                            tabIndex={8}
                            className="mt-[clamp(2px,0.4vh,5px)] inline-block text-[clamp(15px,1.7vh,16px)] font-semibold underline underline-offset-2 transition-colors hover:!text-[#163F3C] hover:decoration-2"
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
