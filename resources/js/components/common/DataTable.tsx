import CustomDeleteModal from '@/components/common/CustomDeleteModal.jsx';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VERIFICATION_STATUS } from '@/utils/constants';
import { router } from '@inertiajs/react';
import { BadgeCheck, ChevronLeft, ChevronRight, Edit, EyeIcon, MoreVertical, Settings, Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export default function DataTable({
    data,
    columns,
    meta,
    actions = {
        view: false,
        edit: true,
        delete: true,
        search_filter: true,
        status_filter: true,
        per_page_filter: true,
    },
    baseRoute,
    viewRoute, // viewRoute প্রপস যোগ করুন
    filters,
    onFilterChange,
    perPageOptions = [5, 10, 25, 50],
}) {
    const [deleteId, setDeleteId] = React.useState(null);
    const [statusModal, setStatusModal] = React.useState(false);
    const [verificationModal, setVerificationModal] = React.useState(false);

    const [selectedRow, setSelectedRow] = React.useState(null);
    const [selectedStatus, setSelectedStatus] = React.useState('');

    // View রুট নির্ধারণের ফাংশন
    const getViewRoute = (rowId) => {
        if (viewRoute) {
            return route(viewRoute, rowId);
        }
        return route(`${baseRoute}.show`, rowId);
    };

    const globalActions = {
        search_filter: true,
        status_filter: true,
        per_page_filter: true,
        ...(typeof actions === 'object' ? actions : {}),
    };

    // ACTION RESOLVER
    const resolveActions = (row) => {
        if (typeof actions === 'function') {
            return actions(row);
        }

        return {
            view: actions.view,
            edit: actions.edit,
            delete: actions.delete,
            change_status: actions.change_status,
            change_verification_status: actions.change_verification_status,
        };
    };

    const handleDeleteConfirm = () => {
        router.delete(route(`${baseRoute}.destroy`, deleteId), {
            onSuccess: () => {
                setDeleteId(null);
                toast.success('Item deleted successfully!');
            },
            onError: () => {
                toast.error('Failed to delete the item.');
            },
        });
    };

    const goToPage = (page) => {
        onFilterChange({
            ...filters,
            page,
        });
    };

    const handleFilterChange = (e) => {
        onFilterChange({
            ...filters,
            [e.target.name]: e.target.value,
            page: 1,
        });
    };

    return (
        <div className="space-y-4 rounded-xl bg-white p-4 text-black shadow dark:text-white">
            {/* FILTERS */}
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {globalActions.search_filter && (
                    <Input
                        type="text"
                        name="search"
                        placeholder={meta.searchPlaceholderText}
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="px-3 py-2 md:w-1/3"
                    />
                )}

                {globalActions.per_page_filter && (
                    <Select value={Number(filters.perPage)} onValueChange={(value) => handleFilterChange({ target: { name: 'perPage', value } })}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Per Page" />
                        </SelectTrigger>
                        <SelectContent>
                            {perPageOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                    {opt} per page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* TABLE */}
            <table className="min-w-full table-auto">
                <thead className="border-b text-left">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="px-4 py-2">
                                {col.label}
                            </th>
                        ))}
                        <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1} className="py-4 text-center text-gray-500">
                                No data found.
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => {
                            const rowActions = resolveActions(row);

                            return (
                                <tr key={row.id} className="border-b hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-2">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}

                                    {/* ACTIONS */}
                                    <td className="px-4 py-2 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="action" className="cursor-pointer text-white">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" className="bg-white text-black">
                                                {/* VIEW - কাস্টম রুট ব্যবহার */}
                                                {rowActions.view && (
                                                    <DropdownMenuItem onClick={() => router.visit(getViewRoute(row.id))}>
                                                        <EyeIcon className="mr-2 h-4 w-4" /> View
                                                    </DropdownMenuItem>
                                                )}

                                                {/* EDIT */}
                                                {rowActions.edit && (
                                                    <DropdownMenuItem onClick={() => router.visit(route(`${baseRoute}.edit`, row.id))}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                )}

                                                {/* DELETE */}
                                                {rowActions.delete && (
                                                    <DropdownMenuItem onClick={() => setDeleteId(row.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
                                                    </DropdownMenuItem>
                                                )}

                                                {/* CHANGE VERIFICATION STATUS */}
                                                {rowActions.change_verification_status && (
                                                    <DropdownMenuItem
                                                        onClick={() => router.visit(route('providers.verification.show', row.id))}
                                                    >
                                                        <BadgeCheck className="mr-2 h-4 w-4 text-green-600" />
                                                        Change Verification Status
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {/* PAGINATION */}
            {meta && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing <strong>{meta.from}</strong> to <strong>{meta.to}</strong> of <strong>{meta.total}</strong>
                    </p>

                    <div className="flex gap-1">
                        <button onClick={() => goToPage(meta.current_page - 1)} disabled={meta.current_page <= 1}>
                            <ChevronLeft />
                        </button>

                        <button onClick={() => goToPage(meta.current_page + 1)} disabled={meta.current_page >= meta.last_page}>
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            )}

            <CustomDeleteModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
                title="Are you sure you want to delete this item?"
                message="Once deleted, you will not be able to recover this item."
            />

            {/* Verification Status Modal */}
            {verificationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold">Change Verification Status</h2>

                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Verification Status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value={VERIFICATION_STATUS.PENDING}>Pending</SelectItem>
                                <SelectItem value={VERIFICATION_STATUS.APPROVED}>Approved</SelectItem>
                                <SelectItem value={VERIFICATION_STATUS.REJECTED}>Rejected</SelectItem>
                                <SelectItem value={VERIFICATION_STATUS.SUSPENDED}>Suspended</SelectItem>
                                <SelectItem value={VERIFICATION_STATUS.INACTIVE}>Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="mt-6 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setVerificationModal(false)}>
                                Cancel
                            </Button>

                            <Button
                                onClick={() => {
                                    router.post(
                                        `/admin/change/status/provider/${selectedRow.id}`,
                                        {
                                            type: 'status',
                                            status: selectedStatus,
                                        },
                                        {
                                            onSuccess: () => {
                                                toast.success('Verification Status updated');
                                                setVerificationModal(false);
                                            },
                                        },
                                    );
                                }}
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
