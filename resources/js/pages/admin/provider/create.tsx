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

const breadcrumbs = [{ title: 'Create Client', href: '/clients/create' }];

/* ================= SCHEMA ================= */
const clientSchema = z.object({
    name: z.string().min(3, { message: 'Name is Required!' }),
    company_name: z.string().min(3, { message: 'Company name is required!' }),
    email: z.string().email(),
    phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
    address: z.string().optional(),
    rating: z.string().optional(),

    industry_id: z.string().nullable().optional(),

    client_type: z.enum([CLIENT_TYPE.RETAINER, CLIENT_TYPE.CONTINGENCY]),
    fee_value: z.string().min(1, { message: 'Fee value is required' }),

    status: z.enum([STATUS.ACTIVE.toString(), STATUS.INACTIVE.toString()]),

    agreement_type: z.string().optional(),
    signed_date: z.string().optional(),

    agreements: z.any().optional(),

    departments: z.array(z.string()).optional(),
});

export default function Create({ industries = [], departments = [] }: any) {
    const [files, setFiles] = useState<File[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

    /* ================= OPTIONS ================= */
    const departmentOptions: MultiSelectOption[] =
        departments?.map((item: any) => ({
            label: item.name,
            value: String(item.id),
        })) || [];

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
            name: '',
            company_name: '',
            email: '',
            phone: '',
            address: '',
            rating: '',

            industry_id: '',

            client_type: CLIENT_TYPE.RETAINER,
            status: STATUS.ACTIVE.toString(),

            fee_value: '',

            agreement_type: '',
            signed_date: '',

            departments: [],
            agreements: [],
        },
    });

    const clientType = watch('client_type');

    /* ================= REGISTER EXTRA FIELD ================= */
    useEffect(() => {
        register('agreements');
        register('departments');
    }, [register]);

    /* ================= FILE HANDLING ================= */
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

    /* ================= SUBMIT ================= */
    const saveClient = (data: any) => {
        const payload = {
            ...data,

            fee_type: data.client_type === CLIENT_TYPE.CONTINGENCY ? JOB_FEE_TYPE.PERCENTAGE : JOB_FEE_TYPE.FIXED,

            agreements: files,

            departments: (data.departments || []).map((id: string) => Number(id)),
        };

        router.post(route('clients.store'), payload, {
            forceFormData: true,

            onError: (errs) => {
                Object.keys(errs).forEach((k) => setError(k as any, { message: errs[k] }));
                toast.error('Please fix the errors in the form.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Client" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">
                    <form onSubmit={handleSubmit(saveClient)}>
                        {/* ================= CLIENT INFO ================= */}
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

                                        <Input {...register(f as any)} className={cn(errors[f as keyof typeof errors] && 'border-red-500')} />

                                        {errors[f as keyof typeof errors] && (
                                            <span className="text-sm text-red-500">{(errors[f as keyof typeof errors] as any)?.message}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 grid gap-2">
                                <Label>Address</Label>
                                <Input {...register('address')} />
                            </div>

                            {/* ================= DEPARTMENTS (MULTISELECT + BADGES) ================= */}
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
                                    placeholder="Select Departments"
                                />

                                {/* BADGES */}
                                {selectedDepartments.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedDepartments.map((id) => {
                                            const dept = departmentOptions.find((d) => d.value === id);

                                            return (
                                                <span key={id} className="rounded-full border bg-blue-100 px-3 py-1 text-xs text-blue-700">
                                                    {dept?.label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* ================= GRID ================= */}
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* CLIENT TYPE */}
                                <div className="grid gap-2">
                                    <Label>Client Type</Label>

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

                                {/* INDUSTRY */}
                                <div className="grid gap-2">
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
                                {/* <div className="grid gap-2">
                                    <Label>{clientType === CLIENT_TYPE.CONTINGENCY ? 'Placement Fee (%)' : 'Monthly Retainer ($)'}</Label>

                                    <Input type="number" {...register('fee_value')} className={cn(errors.fee_value && 'border-red-500')} />

                                    {errors.fee_value && <span className="text-sm text-red-500">{errors.fee_value.message}</span>}
                                </div> */}

                                <div className="grid gap-2">
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

                                {/* STATUS */}
                                <div className="grid gap-2">
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

                                {/* Ratings */}
                                <div className="grid gap-2">
                                    <Label>Ratings</Label>

                                    <Controller
                                        name="rating"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Rating" />
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

                        {/* ================= AGREEMENTS ================= */}
                        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold">Client Agreements</h2>

                            <div className="grid gap-4 sm:grid-cols-2">
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
                                        Processing...
                                    </>
                                ) : (
                                    'Save Client'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
