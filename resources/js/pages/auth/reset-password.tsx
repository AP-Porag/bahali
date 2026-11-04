import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

/* Same Bahali look as the provider sign-in page (auth/login.tsx). */
const COLORS = {
    ivory: '#FAFAF6',
    teal: '#1E4D4A',
    text: '#292F30',
    muted: '#5D6265',
    border: '#D9DAD5',
};

const SERIF = {
    fontFamily: 'Fraunces, "Playfair Display", Georgia, serif',
};

/* Sizes scale with the screen height (clamp + vh), so the page fits inside 90vh like the sign-in page. */
const INPUT_CLASS =
    'h-[clamp(36px,4.8vh,54px)] w-full rounded-lg border border-[#AEB7B3] bg-white px-[18px] text-[clamp(14px,1.8vh,17px)] text-[#292F30] shadow-none placeholder:text-[#777B7C] focus-visible:border-[#1E4D4A] focus-visible:ring-[3px] focus-visible:ring-[#1E4D4A]/15';
const ERROR_CLASS = 'border-[#C2543B] focus-visible:ring-[#C2543B]/20';
const LABEL_CLASS = 'mb-[clamp(4px,0.7vh,9px)] block text-[clamp(13px,1.7vh,18px)] font-semibold text-[#242829]';
const EYE_CLASS =
    'absolute right-[14px] top-1/2 -translate-y-1/2 rounded p-1 text-[#737A79] transition-colors hover:text-[#1E4D4A] focus-visible:outline-2 focus-visible:outline-[#1E4D4A]';

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<ResetPasswordForm>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset password" />

            <main
                className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-[4vh] sm:px-6"
                style={{ backgroundColor: COLORS.ivory }}
            >
                <div className="flex w-full max-w-[576px] flex-col items-center">
                    {/* Bahali logo */}
                    <Link
                        href="/"
                        aria-label="Bahali Home"
                        className="mb-[clamp(8px,2vh,32px)] flex flex-col items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E4D4A]"
                    >
                        <img
                            src="/images/Bahali%20_p.png"
                            alt="Bahali Logo"
                            className="h-[clamp(28px,calc(16vh_-_58px),124px)] w-auto max-w-[320px] object-contain"
                        />

                        <span
                            className="mt-[clamp(4px,0.8vh,9px)] text-[clamp(10px,1.4vh,16px)] font-medium uppercase leading-none tracking-[0.28em]"
                            style={{ color: COLORS.teal }}
                        >
                            PROVIDER PORTAL
                        </span>
                    </Link>

                    {/* Card */}
                    <section
                        className="w-full rounded-[16px] border bg-white px-6 py-[clamp(12px,2.8vh,40px)] shadow-[0_5px_18px_rgba(35,45,40,0.07)] sm:px-10"
                        style={{ borderColor: COLORS.border }}
                    >
                        <form onSubmit={submit}>
                            {/* Heading */}
                            <div className="mb-[clamp(10px,2vh,28px)]">
                                <h1
                                    className="text-[clamp(22px,min(3.6vh,9vw),40px)] font-semibold leading-[1.2] tracking-[-0.8px]"
                                    style={{ ...SERIF, color: COLORS.teal }}
                                >
                                    Choose a new password
                                </h1>

                                <p
                                    className="mt-[clamp(2px,0.7vh,10px)] text-[clamp(13px,min(1.8vh,4.4vw),20px)] leading-[1.5]"
                                    style={{ color: COLORS.muted }}
                                >
                                    Please enter your new password below.
                                </p>
                            </div>

                            {/* Email (read-only, comes from the reset link) */}
                            <div className="mb-[clamp(10px,1.8vh,27px)]">
                                <Label htmlFor="email" className={LABEL_CLASS}>
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={data.email}
                                    readOnly
                                    onChange={(e) => setData('email', e.target.value)}
                                    aria-invalid={!!errors.email}
                                    className={`${INPUT_CLASS} cursor-default bg-[#F4F4F0] text-[#5D6265] ${errors.email ? ERROR_CLASS : ''}`}
                                />
                                <InputError message={errors.email} className="mt-1.5 text-sm text-[#C2543B]" />
                            </div>

                            {/* New password */}
                            <div className="mb-[clamp(10px,1.8vh,27px)]">
                                <Label htmlFor="password" className={LABEL_CLASS}>
                                    New password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        autoComplete="new-password"
                                        value={data.password}
                                        autoFocus
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter a new password"
                                        aria-invalid={!!errors.password}
                                        className={`${INPUT_CLASS} pr-12 ${errors.password ? ERROR_CLASS : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        aria-pressed={showPassword}
                                        className={EYE_CLASS}
                                    >
                                        {showPassword ? <EyeOff size={21} strokeWidth={1.8} /> : <Eye size={21} strokeWidth={1.8} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1.5 text-sm text-[#C2543B]" />
                            </div>

                            {/* Confirm password */}
                            <div className="mb-[clamp(12px,2.2vh,32px)]">
                                <Label htmlFor="password_confirmation" className={LABEL_CLASS}>
                                    Confirm new password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirm ? 'text' : 'password'}
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Re-enter the new password"
                                        aria-invalid={!!errors.password_confirmation}
                                        className={`${INPUT_CLASS} pr-12 ${errors.password_confirmation ? ERROR_CLASS : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((prev) => !prev)}
                                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                                        aria-pressed={showConfirm}
                                        className={EYE_CLASS}
                                    >
                                        {showConfirm ? <EyeOff size={21} strokeWidth={1.8} /> : <Eye size={21} strokeWidth={1.8} />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1.5 text-sm text-[#C2543B]" />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex h-[clamp(38px,5vh,56px)] w-full items-center justify-center gap-2 rounded-[9px] text-[clamp(15px,1.9vh,20px)] font-semibold text-white transition-colors hover:bg-[#163F3C] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#1E4D4A]/30 disabled:cursor-not-allowed disabled:opacity-60"
                                style={{ backgroundColor: COLORS.teal }}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle size={21} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Reset password'
                                )}
                            </button>

                            {/* Divider */}
                            <div className="my-[clamp(8px,1.8vh,27px)] border-t" style={{ borderColor: COLORS.border }} />

                            {/* Back to sign in */}
                            <p className="text-center text-[clamp(13px,1.6vh,18px)]" style={{ color: COLORS.muted }}>
                                Remembered your password?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                                    style={{ color: COLORS.teal }}
                                >
                                    Back to sign in
                                </Link>
                            </p>
                        </form>
                    </section>
                </div>
            </main>
        </>
    );
}
