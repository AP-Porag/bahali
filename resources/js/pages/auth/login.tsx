import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

/* Bahali heading font — same as the public pages. */
const SERIF = { fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' };

/* Bahali form styles (same as the registration form). */
const INPUT_CLASS =
    'h-auto rounded-lg border-[#DED7C9] bg-white py-2.5 text-[#1F2A2E] shadow-none placeholder:text-[#9AA6A4] transition focus-visible:border-[#0E7C7B] focus-visible:ring-4 focus-visible:ring-[#0E7C7B]/25';
const INPUT_ERROR_CLASS = 'border-[#C2543B] focus-visible:border-[#C2543B] focus-visible:ring-[#C2543B]/30';
const LABEL_CLASS = 'block text-sm font-medium text-[#26403F]';

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

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[url('/images/bahali-background.jpg')] bg-cover bg-center px-4 py-10 text-[#1F2A2E]">
            <Head title="Log in" />

            {/* Form Container */}
            <div className="w-full max-w-md rounded-2xl border border-[#E7E0D2] bg-white/95 shadow-[0_40px_80px_rgba(0,0,0,0.15)] backdrop-blur-sm">
                <form className="flex w-full flex-col p-6 sm:p-10" onSubmit={submit}>
                    <div className="mb-8 text-center">
                        <h1 className="font-serif text-2xl font-semibold text-[#16302F] sm:text-3xl" style={SERIF}>
                            Welcome back
                        </h1>
                        <p className="mt-2 text-sm text-[#5B6B6E]">Log in to manage your Bahali profile.</p>
                    </div>

                    {status && (
                        <div className="mb-6 rounded-lg border border-[#0E7C7B]/25 bg-[#0E7C7B]/5 px-4 py-3 text-center text-sm font-medium text-[#0B6463]">
                            {status}
                        </div>
                    )}

                    {/* <form className="flex flex-col gap-6" onSubmit={submit}> */}
                    <div className="grid gap-6">
                        <div className="grid gap-1.5">
                            <Label htmlFor="email" className={LABEL_CLASS}>Email address</Label>

                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A4]" />

                                <Input
                                    className={`pl-10 ${INPUT_CLASS} ${errors.email ? INPUT_ERROR_CLASS : ''}`}
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <InputError message={errors.email} className="text-[#C2543B]" />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="password" className={LABEL_CLASS}>Password</Label>

                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A4]" />

                                <Input
                                    className={`pl-10 pr-10 ${INPUT_CLASS} ${errors.password ? INPUT_ERROR_CLASS : ''}`}
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    tabIndex={-1}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9AA6A4] transition-colors hover:text-[#0E7C7B]"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <InputError message={errors.password} className="text-[#C2543B]" />

                            {/* <div className="flex items-center justify-end">
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto font-medium no-underline text-sm text-[#3b7890]" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div> */}
                        </div>

                        {/* <div className="flex items-center space-x-3">
                        <Checkbox id="remember" name="remember" tabIndex={3} />
                        <Label htmlFor="remember">Remember me</Label>
                    </div> */}

                        <Button
                            type="submit"
                            className="mt-2 h-auto w-full rounded-lg bg-[#0E7C7B] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B6463] focus-visible:ring-4 focus-visible:ring-[#0E7C7B]/30 disabled:opacity-60"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Log in
                        </Button>
                    </div>

                    {/* <div className="text-muted-foreground text-center text-sm">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} tabIndex={5}>
                        Sign up
                    </TextLink>
                </div> */}
                </form>
            </div>

            {/* </AuthLayout> */}
        </div>
    );
}
