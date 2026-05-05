import DatePicker from '@/components/forms/DatePicker';
import type { MultiSelectOption } from '@/components/forms/MultiSelect';
import MultiSelect from '@/components/forms/MultiSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { FileText, RotateCw, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { CLIENT_TYPE, JOB_FEE_TYPE, RATING, STATUS } from '@/utils/constants';

const breadcrumbs = [{ title: 'Edit Client', href: '/clients/edit' }];

/* ================= SCHEMA (FIXED ONLY TYPO/TYPE ISSUE) ================= */
const clientSchema = z.object({
    name: z.string().min(3),
    company_name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(10),
    address: z.string().optional(),

    industry_id: z.string().nullable().optional(),

    client_type: z.enum([CLIENT_TYPE.RETAINER, CLIENT_TYPE.CONTINGENCY]),
    fee_value: z.string().min(1),

    status: z.enum([STATUS.ACTIVE.toString(), STATUS.INACTIVE.toString()]),

    agreement_type: z.string().optional(),
    rating: z.string().optional(),
    signed_date: z.string().optional(),

    agreements: z.any().optional(),

    // ✅ FIXED TYPO ONLY (was ddepartments)
    departments: z.array(z.string()).optional(),
});

export default function Edit({ client, industries, agreement, departments }: any) {
    const [files, setFiles] = useState<File[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

    const departmentOptions: MultiSelectOption[] = departments.map((item: any) => ({
        label: item.name,
        value: String(item.id),
    }));

    const {
        register,
        control,
        handleSubmit,
        setValue,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: client?.name || '',
            company_name: client?.company_name || '',
            email: client?.email || '',
            phone: client?.phone || '',
            address: client?.address || '',

            industry_id: client?.industry_id ? String(client.industry_id) : '',

            client_type: client?.client_type || CLIENT_TYPE.RETAINER,
            fee_value: client?.fee_value || '',

            status: client?.status?.toString() || STATUS.ACTIVE.toString(),
            rating: client?.rating ? String(client.rating) : '',

            agreement_type: client?.agreement_type || '',
            signed_date: client?.signed_date || '',

            // FIXED SAFE DEFAULT
            // departments: Array.isArray(client?.departments) ? client.departments.map((d: any) => String(d.id ?? d)) : [],
        },
    });

    const clientType = watch('client_type');

    /* ================= INIT SYNC ================= */
    // useEffect(() => {
    //     const initialDepartments = Array.isArray(client?.departments) ? client.departments.map((d: any) => String(d.id ?? d)) : [];

    //     setSelectedDepartments(initialDepartments);
    //     setValue('departments', initialDepartments);
    // }, [register, client, setValue]);
    useEffect(() => {
        const initialDepartments = client?.departments?.map((d: any) => String(d.id)) || [];

        setSelectedDepartments(initialDepartments);
        setValue('departments', initialDepartments);
    }, [client, setValue]);

    /* ================= FILE HANDLING (UNCHANGED) ================= */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selected = [...files, ...Array.from(e.target.files)];
        setFiles(selected);
        setValue('agreements', selected);
    };

    const removeFile = (index: number) => {
        const updated = files.filter((_, i) => i !== index);
        setFiles(updated);
        setValue('agreements', updated);
    };

    /* ================= UPDATE (ONLY FIXED TYPES) ================= */
    // const updateClient = (data: any) => {
    //     const payload = {
    //         ...data,

    //         fee_type: data.client_type === CLIENT_TYPE.CONTINGENCY ? JOB_FEE_TYPE.PERCENTAGE : JOB_FEE_TYPE.FIXED,

    //         agreements: files,

    //         // ✅ FIX ONLY: ensure backend safe numbers
    //         departments: (data.departments || []).map((id: string) => Number(id)),
    //     };

    //     router.put(route('clients.update', client.id), payload, {
    //         onError: (errs) => {
    //             console.log('VALIDATION ERRORS:', errs); // 👈 add this
    //             Object.keys(errs).forEach((k) => setError(k as any, { message: errs[k] }));

    //             toast.error('Please fix validation errors');
    //         },
    //     });
    // };

    const updateClient = (data: any) => {
        const formData = new FormData();

        // 🔹 append all normal fields
        Object.keys(data).forEach((key) => {
            const value = (data as any)[key];

            // skip agreements because handled separately
            if (key === 'agreements') return;

            if (Array.isArray(value)) {
                value.forEach((v) => formData.append(`${key}[]`, v));
            } else {
                formData.append(key, value ?? '');
            }
        });

        // 🔹 fee_type (UNCHANGED LOGIC)
        formData.append('fee_type', data.client_type === CLIENT_TYPE.CONTINGENCY ? JOB_FEE_TYPE.PERCENTAGE : JOB_FEE_TYPE.FIXED);

        // 🔹 departments fix
        (data.departments || []).forEach((id: string) => formData.append('departments[]', String(Number(id))));

        // 🔥 FIX: existing agreements IDs (NOT files)
        (data.existing_agreements || []).forEach((id: number) => {
            formData.append('existing_agreements[]', String(id));
        });

        // 🔹 NEW FILES upload
        files.forEach((file: File) => {
            formData.append('agreements[]', file);
        });

        // 🔹 IMPORTANT: Laravel PUT spoof
        formData.append('_method', 'PUT');

        router.post(route('clients.update', client.id), formData, {
            forceFormData: true,

            onError: (errs) => {
                console.log('VALIDATION ERRORS:', errs);

                Object.keys(errs).forEach((k) =>
                    setError(k as any, {
                        message: Array.isArray(errs[k]) ? errs[k][0] : errs[k],
                    }),
                );

                toast.error('Please fix validation errors');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Client" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">
                    <form onSubmit={handleSubmit(updateClient)}>
                        {/* ================= CLIENT INFO (UNCHANGED UI) ================= */}
                        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold">Client Information</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                {[
                                    ['name', 'Name'],
                                    ['company_name', 'Company Name'],
                                    ['email', 'Email'],
                                    ['phone', 'Phone'],
                                ].map(([f, l]) => (
                                    <div key={f} className="grid gap-2">
                                        <Label>{l}</Label>
                                        <Input {...register(f as any)} />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 grid gap-2">
                                <Label>Address</Label>
                                <Input {...register('address')} />
                            </div>

                            {/* ================= DEPARTMENTS (UNCHANGED UI) ================= */}
                            <div className="mt-4 grid gap-2">
                                <Label>Departments</Label>

                                <MultiSelect
                                    options={departmentOptions}
                                    value={selectedDepartments}
                                    onChange={(val) => {
                                        const normalized = val.map(String);

                                        setSelectedDepartments(normalized);
                                        setValue('departments', normalized);
                                    }}
                                />
                            </div>

                            {/* ================= DROPDOWNS (UNCHANGED) ================= */}
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="mt-2 grid gap-2">
                                    <Label>CLient Type</Label>
                                    <Controller
                                        name="client_type"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={CLIENT_TYPE.RETAINER}>Retainer</SelectItem>
                                                    <SelectItem value={CLIENT_TYPE.CONTINGENCY}>Contingency</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="mt-2 grid gap-2">
                                    <Label>Industry</Label>
                                    <Controller
                                        name="industry_id"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value || ''} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Industry" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {industries.map((i: any) => (
                                                        <SelectItem key={i.id} value={String(i.id)}>
                                                            {i.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                {/* FEE */}

                                {/* <div className="mt-2 grid gap-2">
                                    <Label>{clientType === CLIENT_TYPE.CONTINGENCY ? 'Placement Fee (%)' : 'Monthly Retainer ($)'}</Label>

                                    <Input type="number" {...register('fee_value')} className={cn(errors.fee_value && 'border-red-500')} />

                                    {errors.fee_value && <span className="text-sm text-red-500">{errors.fee_value.message}</span>}
                                </div> */}

                                <div className="mt-2 grid gap-2">
                                    <Label>{clientType === CLIENT_TYPE.CONTINGENCY ? 'Placement Fee (%)' : 'Monthly Retainer ($)'}</Label>

                                    <div className="relative">
                                        {clientType !== CLIENT_TYPE.CONTINGENCY && (
                                            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">$</span>
                                        )}

                                        {clientType === CLIENT_TYPE.CONTINGENCY && (
                                            <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">%</span>
                                        )}

                                        <Input
                                            type="number"
                                            {...register('fee_value')}
                                            className={cn(
                                                errors.fee_value && 'border-red-500',
                                                clientType !== CLIENT_TYPE.CONTINGENCY ? 'pl-7' : '',
                                                clientType === CLIENT_TYPE.CONTINGENCY ? 'pr-7' : '',
                                            )}
                                        />
                                    </div>

                                    {errors.fee_value && <span className="text-sm text-red-500">{errors.fee_value.message}</span>}
                                </div>

                                {/* Status */}
                                <div className="mt-2 grid gap-2">
                                    <Label>Status</Label>
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={STATUS.ACTIVE.toString()}>Active</SelectItem>
                                                    <SelectItem value={STATUS.INACTIVE.toString()}>Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                {/* Rating */}
                                <div className="mt-2 grid gap-2">
                                    <Label>Rating</Label>
                                    <Controller
                                        name="rating"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value || ''} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={RATING.RATING_A.toString()}>A</SelectItem>
                                                    <SelectItem value={RATING.RATING_B.toString()}>B</SelectItem>
                                                    <SelectItem value={RATING.RATING_C.toString()}>C</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ================= AGREEMENTS (UNCHANGED UI) ================= */}
                        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold">Client Agreements</h2>

                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Agreement Type</Label>
                                    <Input {...register('agreement_type')} />
                                </div>
                                <div className="-mt-1">
                                <Controller
                                    name="signed_date"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Signed Date"
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={errors.signed_date?.message}
                                        />
                                    )}
                                />
                                </div>
                            </div>

                            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center">
                                <Upload className="mb-2 h-6 w-6" />
                                <span className="text-sm">Upload agreements</span>
                                <input type="file" multiple hidden onChange={handleFileChange} />
                            </label>

                            <div className="mt-4 space-y-2">
                                {files.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between rounded border p-2">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            <span className="truncate text-sm">{file.name}</span>
                                        </div>

                                        <button type="button" onClick={() => removeFile(i)}>
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ================= SUBMIT ================= */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Client'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
