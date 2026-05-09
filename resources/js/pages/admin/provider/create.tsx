import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { RotateCw } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useState } from 'react';

const breadcrumbs = [{ title: 'Create Provider', href: '/providers/create' }];

/* ================= CLEAN CREATE SCHEMA ================= */
const ProviderSchema = z.object({
    name: z.string().min(3, { message: 'Name is Required!' }),

    email: z.email(),

    phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),

    provider_type_id: z.string().nullable().optional(),

    region: z.string().optional(),

    service: z.string().optional(),

    bio: z.string().optional(),

    location: z.string().optional(),

    is_public: z.boolean().optional(),

    avatar: z
        .any()
        .optional()
        .nullable()
        .refine((file) => !file || file instanceof File, {
            message: 'Invalid file',
        })
        .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
            message: 'Image must be less than 5MB',
        })
        .refine((file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
            message: 'Only jpg, png, webp allowed',
        }),
});

export default function Create({ provider_type = [] }: any) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(ProviderSchema),

        defaultValues: {
            name: '',
            email: '',
            phone: '',
            provider_type_id: '',
            region: '',
            service: '',
            bio: '',
            location: '',
            is_public: false,
            avatar: null,
        },
    });

    /* ================= SUBMIT ================= */
    const saveProvider = (data: any) => {
        router.post(
            route('providers.store'),
            {
                ...data,
                provider_type_id: data.provider_type_id ? String(Number(data.provider_type_id)) : '',
                avatar: data.avatar,
            },
            {
                forceFormData: true,

                onSuccess: () => {
                    toast.success('Provider created successfully');
                },

                onError: (errors) => {
                    Object.keys(errors).forEach((key) => {
                        setError(key as any, {
                            message: errors[key],
                        });
                    });

                    toast.error('Please fix the errors in the form.');
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Provider" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">
                    <form onSubmit={handleSubmit(saveProvider)}>
                        {/* ================= PROVIDER INFO ================= */}
                        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold">Provider Information</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                {[
                                    ['name', 'Name'],
                                    ['email', 'Email'],
                                    ['phone', 'Phone'],
                                    ['service', 'Service'],
                                    ['region', 'Region'],
                                    ['location', 'Location'],
                                ].map(([f, l]) => (
                                    <div key={f} className="grid gap-2">
                                        <Label>{l}</Label>

                                        <Input {...register(f as any)} className={cn(errors[f as keyof typeof errors] && 'border-red-500')} />

                                        {errors[f as keyof typeof errors] && (
                                            <span className="text-sm text-red-500">{(errors[f as keyof typeof errors] as any)?.message}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* ================= GRID ================= */}
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {/* PROVIDER TYPE */}
                                <div className="grid gap-2">
                                    <Label>Provider Type</Label>

                                    <Controller
                                        name="provider_type_id"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value || ''} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Provider Type" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {provider_type.map((i: any) => (
                                                        <SelectItem key={i.id} value={String(i.id)}>
                                                            {i.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                {/* PUBLIC VISIBILITY */}
                                <div className="flex items-center gap-3 pt-8">
                                    <input type="checkbox" {...register('is_public')} />
                                    <Label>Publicly Visible</Label>
                                </div>

                                {/* BIO */}
                                <div className="grid gap-2 md:col-span-3">
                                    <Label>Bio</Label>

                                    <textarea
                                        {...register('bio')}
                                        className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-black"
                                        rows={5}
                                        placeholder="Write bio..."
                                    />

                                    {errors.bio && <span className="text-sm text-red-500">{(errors.bio as any)?.message}</span>}
                                </div>

                                {/* AVATAR */}
                                <Controller
                                    name="avatar"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid gap-2">
                                            <Label>Avatar</Label>

                                            {avatarPreview && <img src={avatarPreview} className="h-20 w-20 rounded-full border object-cover" />}

                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;

                                                    field.onChange(file);

                                                    if (file) {
                                                        const reader = new FileReader();

                                                        reader.onload = () => {
                                                            setAvatarPreview(reader.result as string);
                                                        };

                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        setAvatarPreview(null);
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* ================= SUBMIT ================= */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                                {isSubmitting ? (
                                    <>
                                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Save Provider'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
