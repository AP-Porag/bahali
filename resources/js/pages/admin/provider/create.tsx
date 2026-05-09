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

import { STATUS, VERIFICATION_STATUS } from '@/utils/constants';
import { useState } from 'react';

const breadcrumbs = [{ title: 'Create Provider', href: '/providers/create' }];

/* ================= SCHEMA ================= */
const ProviderSchema = z.object({
    name: z.string().min(3, { message: 'Name is Required!' }),
    region: z.string().optional(),
    service: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    verification_status: z
        .enum([VERIFICATION_STATUS.APPROVED, VERIFICATION_STATUS.REJECTED, VERIFICATION_STATUS.PROVISIONAL], {
            message: 'Invalid status',
        })
        .optional(),
    email: z.email(),
    phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),

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

    provider_type_id: z.string().nullable().optional(),

    status: z
        .enum([STATUS.DRAFT, STATUS.PENDING, STATUS.VERIFIED, STATUS.SUSPENDED, STATUS.EXPIRED], {
            message: 'Invalid status',
        })
        .optional(),
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
            verification_status: '',
            provider_type_id: '',
            region: '',
            service: '',
            status: '',
            bio: '',
            location: '',
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
                onProgress: (progress) => {
                    console.log(`Upload progress: ${progress?.percentage}%`);
                },
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

                                {/* STATUS */}
                                <div className="grid gap-2">
                                    <Label>Status</Label>

                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value || ''} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={STATUS.DRAFT.toString()}>Draft</SelectItem>
                                                    <SelectItem value={STATUS.PENDING.toString()}>Pending</SelectItem>
                                                    <SelectItem value={STATUS.VERIFIED.toString()}>Verified</SelectItem>

                                                    <SelectItem value={STATUS.SUSPENDED.toString()}>Suspended</SelectItem>
                                                    <SelectItem value={STATUS.EXPIRED.toString()}>Expired</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                {/* VERIFICATION STATUS */}
                                <div className="grid gap-2">
                                    <Label>Verification Status</Label>

                                    <Controller
                                        name="verification_status"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value || ''} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Verification Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={VERIFICATION_STATUS.APPROVED.toString()}>Approved</SelectItem>
                                                    <SelectItem value={VERIFICATION_STATUS.REJECTED.toString()}>Rejected</SelectItem>
                                                    <SelectItem value={VERIFICATION_STATUS.PROVISIONAL.toString()}>Provisional</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                {/* BIO */}
                                <div className="grid gap-2 md:col-span-3">
                                    <Label>Bio</Label>

                                    <textarea
                                        {...register('bio')}
                                        className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-black"
                                        rows={5}
                                        placeholder="Write note..."
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
