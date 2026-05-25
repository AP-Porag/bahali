import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout.js';
import { capitalize } from '@/utils/helpers';
import { getStatusBadge } from '@/utils/statusBadge';
import { getVerificationBadge } from '@/utils/verificationStatusBadge';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    {
        title: 'Providers',
        href: '/providers/index',
    },
];

export default function Index({ providers, meta, filters: initialFilters }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        status: initialFilters.status || 'all',
        perPage: initialFilters.perPage || 5,
        page: meta.current_page || 1,
    });

    useEffect(() => {
        // Push new filters to URL and reload data
        router.get(route('providers.index'), filters, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [filters.search, filters.status, filters.perPage, filters.page]);

    const columns = [
        { key: 'provider_name', label: 'Name' },
        // {
        //     key: 'type',
        //     label: 'Type',
        //     render: (row) => <span className="block w-30 truncate">{row.provider}</span>,
        // },
        // {
        //     key: 'service',
        //     label: 'Service',
        //     render: (row) => <span className="block w-40">{row.service}</span>,
        // },
        // {
        //     key: 'verification_status',
        //     label: 'Verification Status',
        //     render: (row) => (
        //         <span
        //             className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getVerificationBadge(
        //                 row.verification_status,
        //             )}`}
        //         >
        //             {capitalize(row.verification_status)}
        //         </span>
        //     ),
        // },

        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusBadge(row.status)}`}>
                    {capitalize(row.status)}
                </span>
            ),
        },
        // {
        //     key: 'avatar',
        //     label: 'Avatar',
        //     render: (row) => (
        //         <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 shadow-sm">
        //             <img
        //                 src={row.avatar ? `/storage/${row.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}`}
        //                 alt={row.name}
        //                 className="h-full w-full object-cover"
        //                 onError={(e) => {
        //                     e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}`;
        //                 }}
        //             />
        //         </div>
        //     ),
        // },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />
            <div className="p-4">
                <div className="my-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Providers</h1>
                    <Button onClick={() => router.visit(route('providers.create'))} className="cursor-pointer bg-black text-white hover:bg-gray-800">
                        <Plus className="mr-2" /> Create Provider
                    </Button>
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
                        searchPlaceholderText: meta.searchPlaceholderText,
                    }}
                    actions={{
                        view: true,
                        edit: false,
                        delete: true,
                        change_status: true,
                        change_verification_status: true,
                        search_filter: true,
                        status_filter: true,
                        per_page_filter: true,
                    }}
                    baseRoute="providers"
                    filters={filters}
                    onFilterChange={setFilters}
                />
            </div>
        </AppLayout>
    );
}
