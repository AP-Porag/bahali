import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout.js';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs = [
    {
        title: 'All Providers',
        href: '',
    },
];

export default function Index({ provider_types, meta, filters: initialFilters }) {
    const [filters, setFilters] = useState({
        search: initialFilters?.search || '',
        perPage: initialFilters?.perPage || 5,
        page: provider_types?.current_page || 1,
    });

    // ✅ FIX: debounce search (important)
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route('provider-type.index'), filters, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 400); // debounce delay

        return () => clearTimeout(timeout);
    }, [filters.search, filters.perPage, filters.page]);

    const columns = [
        {
            key: 'name',
            label: 'Provider Name',
            render: (row) => <span className="block truncate font-medium text-gray-800">{row.name}</span>,
        },
    ];
    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this industry?')) return;

        router.delete(route('admin.industries.destroy', id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Industries" />

            <div className="p-4">
                <div className="my-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">All Providers</h1>

                    <Button
                        onClick={() => router.visit(route('provider-type.create'))}
                        className="cursor-pointer bg-black text-white hover:bg-gray-800"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Provider Type
                    </Button>
                </div>

                <DataTable
                    data={provider_types.data}
                    columns={columns}
                    meta={{
                        from: provider_types.from,
                        to: provider_types.to,
                        total: provider_types.total,
                        current_page: provider_types.current_page,
                        last_page: provider_types.last_page,
                        searchPlaceholderText: meta.searchPlaceholderText,
                    }}
                    actions={(row) => ({
                        view: false,
                        edit: false,
                        delete: true,

                        onDelete: () => handleDelete(row.id), // 🔥 THIS IS THE KEY

                        search_filter: true,
                        per_page_filter: true,
                    })}
                    baseRoute="provider-type"
                    filters={filters}
                    onFilterChange={setFilters}
                />
            </div>
        </AppLayout>
    );
}
