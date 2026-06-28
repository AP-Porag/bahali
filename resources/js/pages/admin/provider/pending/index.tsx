import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout.js';
import { capitalize } from '@/utils/helpers';
import { getStatusBadge } from '@/utils/statusBadge';
import { getVerificationBadge } from '@/utils/verificationStatusBadge';
import { Head, router, usePage } from '@inertiajs/react';
import { Eye, EyeIcon, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    {
        title: 'Pending Providers',
        href: '/providers/pending',
    },
];

export default function Pending({ providers, meta, filters: initialFilters }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        status: initialFilters.status || 'pending', // ডিফল্ট pending
        perPage: initialFilters.perPage || 5,
        page: meta.current_page || 1,
    });

    useEffect(() => {
        // Push new filters to URL and reload data
        router.get(route('providers.pending'), filters, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [filters.search, filters.status, filters.perPage, filters.page]);

    const columns = [
        {
            key: 'organization_name',
            label: 'Provider / Organization Name',
            render: (row) => (
                <div className="font-medium">{row.organization_name || 'N/A'}</div>
            )
        },
        {
            key: 'email',
            label: 'Email',
            render: (row) => (
                <div className="text-sm">{row.user?.email || 'N/A'}</div>
            )
        },
        {
            key: 'phone',
            label: 'Phone',
            render: (row) => (
                <div className="text-sm">{row.phone || 'N/A'}</div>
            )
        },
        // {
        //     key: 'status',
        //     label: 'Status',
        //     render: (row) => (
        //         <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusBadge(row.status)}`}>
        //             {capitalize(row.status)}
        //         </span>
        //     ),
        // },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending Providers" />
            <div className="p-4">
                <div className="my-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Pending Providers</h1>
                    {/* <Button onClick={() => router.visit(route('providers.create'))} className="cursor-pointer bg-black text-white hover:bg-gray-800">
                        <Plus className="mr-2" /> Create Provider
                    </Button> */}
                </div>
                <DataTable
                    data={providers}
                    columns={columns}
                    meta={{
                        from: meta.from,
                        to: meta.to,
                        total: meta.total,
                        current_page: meta.current_page,
                        last_page: meta.last_page,
                        searchPlaceholderText: meta.searchPlaceholderText || 'Search by name, email, or phone...',
                    }}
                    actions={{
                        view: false,
                        edit: false,
                        delete: false,
                        change_status: true, // pending status change করার অনুমতি
                        change_verification_status: true,
                        search_filter: true,
                        status_filter: false, // status filter লুকান কারণ শুধু pending দেখাবে
                        per_page_filter: true,
                    }}

                    baseRoute="providers"
                    viewRoute="providers.verification.show"
                    filters={filters}
                    onFilterChange={setFilters}
                />
            </div>
        </AppLayout>
    );
}
