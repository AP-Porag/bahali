// Components
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/* Same Bahali look as the provider sign-in page (auth/login.tsx). */
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

/* Sizes scale with the screen height (clamp + vh), so the page fits inside 90vh like the sign-in page. */
const INPUT_CLASS =
    'h-[clamp(48px,5.2vh,54px)] w-full rounded-[10px] border border-[#1E4D4A]/65 bg-white px-[18px] text-[16px] text-[#2C2C2C] shadow-none placeholder:text-[#2C2C2C]/70 focus-visible:border-[#1E4D4A] focus-visible:ring-[3px] focus-visible:ring-[#1E4D4A]/15';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot password" />

            <main
                className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-[4vh] font-body text-[#2C2C2C] sm:px-6"
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

                    {/* Card */}
                    <section
                        className="w-full rounded-[16px] border bg-white px-5 py-[clamp(12px,2.8vh,40px)] shadow-[0_5px_18px_rgba(35,45,40,0.07)] sm:px-10"
                        style={{ borderColor: COLORS.border }}
                    >
                        <form onSubmit={submit}>
                            {/* Heading */}
                            <div className="mb-[clamp(8px,2vh,28px)]">
                                <h1
                                    className="text-[clamp(24px,min(4.6vh,7.4vw),48px)] font-semibold leading-[1.1]"
                                    style={{ ...SERIF, color: COLORS.teal }}
                                >
                                    Forgot your password?
                                </h1>

                                <p
                                    className="mt-[clamp(2px,0.7vh,10px)] text-[clamp(15px,1.9vh,18px)] leading-[1.6]"
                                    style={{ color: COLORS.muted }}
                                >
                                    Enter your email and we'll send you a link to reset your password.
                                </p>
                            </div>

                            {/* Status message (link sent) */}
                            {status && (
                                <div
                                    role="status"
                                    className="mb-[clamp(8px,1.6vh,20px)] rounded-lg border px-4 py-[clamp(6px,1.1vh,12px)] text-sm"
                                    style={{
                                        borderColor: COLORS.sage,
                                        backgroundColor: `${COLORS.sage}20`,
                                        color: COLORS.teal,
                                    }}
                                >
                                    {status}
                                </div>
                            )}

                            {/* Email address */}
                            <div className="mb-[clamp(8px,2.2vh,32px)]">
                                <Label
                                    htmlFor="email"
                                    className="mb-[clamp(4px,0.7vh,9px)] block text-[14px] font-semibold text-[#2C2C2C]"
                                >
                                    Email address
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    value={data.email}
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter your email"
                                    aria-invalid={!!errors.email}
                                    className={`${INPUT_CLASS} ${errors.email ? 'border-[#C2543B] focus-visible:ring-[#C2543B]/20' : ''}`}
                                />

                                <InputError message={errors.email} className="mt-1.5 text-sm text-[#A8472F]" />
                            </div>

                            {/* Send link */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex h-[clamp(48px,5.4vh,52px)] w-full items-center justify-center gap-2 rounded-[10px] text-[15px] font-semibold text-white transition-colors hover:!bg-[#163F3C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4D4A] disabled:cursor-not-allowed disabled:opacity-60"
                                style={{ backgroundColor: COLORS.teal }}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle size={21} className="animate-spin" />
                                        Sending link...
                                    </>
                                ) : (
                                    'Email password reset link'
                                )}
                            </button>

                            {/* Divider */}
                            <div className="my-[clamp(6px,1.8vh,27px)] border-t" style={{ borderColor: COLORS.border }} />

                            {/* Back to sign in */}
                            <p className="text-center text-[clamp(14px,1.6vh,16px)]" style={{ color: COLORS.muted }}>
                                Remembered your password?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-semibold underline underline-offset-2 transition-colors hover:!text-[#163F3C] hover:decoration-2"
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
