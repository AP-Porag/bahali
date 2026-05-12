import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Provider Type',
        href: '',
    },
];

export default function CreateIndustry() {
    const [form, setForm] = useState({
        name: '',
    });

    const [errors, setErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setErrors((prev: any) => ({
            ...prev,
            [e.target.name]: '',
        }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // FRONTEND VALIDATION
        if (!form.name.trim()) {
            setErrors({ name: 'Provider Type name is required' });
            return;
        }

        router.post(route('provider-type.store'), form, {
            preserveScroll: true,

            onError: (err) => {
                toast.error('Failed to create provider type');
                setErrors(err);
            },

            onSuccess: () => {
                setForm({ name: '' });
                toast.success('Provider type created successfully');
                // redirect to index page after success
                router.visit(route('provider-type.index'));
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Industry" />

            <div className="mx-auto mt-6 w-full max-w-7xl p-4 font-roboto">
                <div className="rounded-xl bg-white p-6 shadow">
                    <h1 className="mb-6 text-xl font-roboto font-bold">Create Provider Type</h1>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Provider Type Name</label>

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full rounded border px-3 py-2"
                                placeholder="Enter industry name"
                            />

                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <Button type="submit" className="w-full cursor-pointer bg-black text-white">
                            Save Provider Type
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
