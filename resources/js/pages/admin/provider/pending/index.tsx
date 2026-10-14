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

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type ReviewStatus = '' | 'pending' | 'needs_correction' | 'pending_verification';

interface ProviderRow {
    id: number;
    organization_name?: string | null;
    phone?: string | null;
    status: string;
    user?: { email?: string | null } | null;
}

interface PaginationMeta {
    from: number | null;
    to: number | null;
    total: number;
    current_page: number;
    last_page: number;
    searchPlaceholderText?: string;
}

interface PendingFilters {
    search: string;
    status: ReviewStatus;
    perPage: number;
    page: number;
}

interface PendingProps {
    providers: ProviderRow[];
    meta: PaginationMeta;
    filters: Partial<Omit<PendingFilters, 'page'>>;
}

/* Review stages shown on this page (all still unpublished). '' = all of them. */
const REVIEW_TABS: { value: ReviewStatus; label: string }[] = [
    { value: '', label: 'All in review' },
    { value: 'pending', label: 'Submitted' },
    { value: 'needs_correction', label: 'Needs correction' },
    { value: 'pending_verification', label: 'Pending verification' },
];
const REVIEW_BADGE: Record<string, { label: string; cls: string }> = {
    pending: { label: 'Submitted', cls: 'border-[#E8B84B]/50 bg-[#E8B84B]/15 text-[#9A6B12]' },
    needs_correction: { label: 'Needs correction', cls: 'border-[#D97A2B]/40 bg-[#D97A2B]/10 text-[#9A5418]' },
    pending_verification: { label: 'Pending verification', cls: 'border-[#3B6FA8]/30 bg-[#3B6FA8]/10 text-[#2F5C8F]' },
};

const breadcrumbs = [
    {
        title: 'Pending Providers',
        href: '/providers/pending',
    },
];

export default function Pending({ providers, meta, filters: initialFilters }: PendingProps) {
    const { flash } = usePage<{ flash?: { success?: string } }>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const [filters, setFilters] = useState<PendingFilters>({
        search: initialFilters.search || '',
        status: initialFilters.status || '', // '' = Submitted + Needs correction + Pending verification
        perPage: initialFilters.perPage || 5,
        page: meta.current_page || 1,
    });

    useEffect(() => {
        // Push new filters to URL and reload data
        router.get(route('providers.pending'), { search: filters.search, status: filters.status, perPage: filters.perPage, page: filters.page }, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [filters.search, filters.status, filters.perPage, filters.page]);

    const columns = [
        {
            key: 'organization_name',
            label: 'Provider / Organization Name',
            render: (row: ProviderRow) => (
                <div className="font-medium">{row.organization_name || 'N/A'}</div>
            )
        },
        {
            key: 'email',
            label: 'Email',
            render: (row: ProviderRow) => (
                <div className="text-sm">{row.user?.email || 'N/A'}</div>
            )
        },
        {
            key: 'phone',
            label: 'Phone',
            render: (row: ProviderRow) => (
                <div className="text-sm">{row.phone || 'N/A'}</div>
            )
        },
        {
            key: 'status',
            label: 'Review stage',
            render: (row: ProviderRow) => {
                const badge = REVIEW_BADGE[row.status];
                return badge ? (
                    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${badge.cls}`}>
                        {badge.label}
                    </span>
                ) : (
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusBadge(row.status)}`}>
                        {capitalize(row.status)}
                    </span>
                );
            },
        },
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
                {/* Review stage tabs */}
                <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Review stage">
                    {REVIEW_TABS.map((t) => {
                        const active = filters.status === t.value;
                        return (
                            <button
                                key={t.value || 'all'}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => setFilters((f) => ({ ...f, status: t.value, page: 1 }))}
                                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${active
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                {t.label}
                            </button>
                        );
                    })}
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
