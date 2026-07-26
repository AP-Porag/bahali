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
        <div className="flex justify-center items-center h-[100vh] w-full bg-[url('/images/bahali-background.jpg')] bg-cover bg-center">

            {/* Overlay */}


            {/* Form Container */}
            <div className="flex justify-center w-[100%]">
                <div className="bg-white/90 flex items-center justify-center w-[80%] sm:w-[68%] md:w-[55%] lg:w-[40%] rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.15)]">
                    <form className="flex w-[100%] p-10 flex-col" onSubmit={submit}>

                        {/* <form className="flex flex-col gap-6" onSubmit={submit}> */}
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="mb-1 block text-sm font-bold text-gray-700">Email address</Label>


                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                    <Input
                                        className="pl-[35px] focus-visible:ring-[#3b7890] outline-2 outline-gray-300"
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
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="mb-1 block text-sm font-bold text-gray-700">Password</Label>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                    <Input
                                        className="pl-[35px] pr-[35px] focus-visible:ring-[#3b7890] outline-2 outline-gray-300"
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
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />

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

                            <Button type="submit" className=" transition-all duration-300 ease-in-out hover:scale-105 mt-4 mb-6 w-full rounded-[12px] bg-[#2b777f] hover:bg-[#24636a]" tabIndex={4} disabled={processing}>
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
            </div>
            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            {/* </AuthLayout> */}
        </div>

    );
}
