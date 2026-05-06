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

import { STATUS } from '@/utils/constants';

const breadcrumbs = [{ title: 'Create Provider', href: '/providers/create' }];

/* ================= SCHEMA ================= */
const ProviderSchema = z.object({
    name: z.string().min(3, { message: 'Name is Required!' }),
    region: z.string().optional(),
    service: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    avartar: z.string().optional(),

    provider_type_id: z.string().nullable().optional(),

    status: z
        .string()
        .refine((val) => !val || ['Draft', 'Pending', 'Verified', 'Provisional', 'Suspended', 'Expired'].includes(val), {
            message: 'Invalid status',
        })
        .optional(),
});

export default function Create({ provider_type = [] }: any) {
    const {
        register,
        control,
        handleSubmit,
        setValue,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(ProviderSchema),
        defaultValues: {
            name: '',
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
        const payload = {
            name: data.name,
            provider_type_id: data.provider_type_id ? Number(data.provider_type_id) : null,
            region: data.region || null,
            service: data.service || null,
            bio: data.bio || null,
            location: data.location || null,
            status: data.status || null,
        };

        router.post(route('providers.store'), payload, {
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
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Provider" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">
                    <form onSubmit={handleSubmit(saveProvider)}>
                        {/* ================= CLIENT INFO ================= */}
                        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold">Provider Information</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                {[
                                    ['name', 'Name'],
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
                                {/* INDUSTRY */}
                                <div className="grid gap-2">
                                    <Label>Provider Type</Label>

                                    <Controller
                                        name="provider_type_id"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value || ''} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Industry" />
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
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={STATUS.DRAFT.toString()}>Draft</SelectItem>
                                                    <SelectItem value={STATUS.PENDING.toString()}>Pending</SelectItem>
                                                    <SelectItem value={STATUS.VERIFIED.toString()}>Verified</SelectItem>
                                                    <SelectItem value={STATUS.PROVISIONAL.toString()}>Provisional</SelectItem>
                                                    <SelectItem value={STATUS.SUSPENDED.toString()}>Suspended</SelectItem>
                                                    <SelectItem value={STATUS.EXPIRED.toString()}>Expired</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
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
                            </div>
                        </div>

                        {/* ================= SUBMIT ================= */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
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
