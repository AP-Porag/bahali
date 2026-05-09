import CustomDeleteModal from '@/components/common/CustomDeleteModal.jsx';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Edit, EyeIcon, MoreVertical, Trash2 } from 'lucide-react';
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
        verify: true,
        provisional: true,
        suspend: true,
        expire: true,
        publish: true,
        search_filter: true,
        status_filter: true,
        per_page_filter: true,
    },
    baseRoute,
    filters,
    onFilterChange,
    perPageOptions = [5, 10, 25, 50],
}) {
    const [deleteId, setDeleteId] = React.useState(null);

    const globalActions = {
        search_filter: true,
        status_filter: true,
        per_page_filter: true,
        ...(typeof actions === 'object' ? actions : {}),
    };

    // ✅ FIXED ACTION RESOLVER
    const resolveActions = (row) => {
        if (typeof actions === 'function') {
            return actions(row);
        }

        return {
            view: actions.view,
            edit: actions.edit,
            delete: actions.delete,
            verify: actions.verify,
            provisional: actions.provisional,
            suspend: actions.suspend,
            expire: actions.expire,
            publish: actions.publish,
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

                {globalActions.status_filter && (
                    <Select value={filters.status} onValueChange={(value) => handleFilterChange({ target: { name: 'status', value } })}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="1">Active</SelectItem>
                            <SelectItem value="0">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
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
                                                {/* VIEW */}
                                                {rowActions.view && (
                                                    <DropdownMenuItem onClick={() => router.visit(route(`${baseRoute}.show`, row.id))}>
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

                                                {/* LIFECYCLE ACTIONS */}
                                                {rowActions.verify && (
                                                    <DropdownMenuItem onClick={() => router.post(`/admin/verify/provider/${row.id}`)}>
                                                        Verify
                                                    </DropdownMenuItem>
                                                )}

                                                {rowActions.provisional && (
                                                    <DropdownMenuItem onClick={() => router.post(`/admin/provisional/provider/${row.id}`)}>
                                                        Provisional
                                                    </DropdownMenuItem>
                                                )}

                                                {rowActions.publish && (
                                                    <DropdownMenuItem onClick={() => router.post(`/admin/publish/provider/${row.id}`)}>
                                                        Publish
                                                    </DropdownMenuItem>
                                                )}

                                                {rowActions.suspend && (
                                                    <DropdownMenuItem onClick={() => router.post(`/admin/suspend/provider/${row.id}`)}>
                                                        Suspend
                                                    </DropdownMenuItem>
                                                )}

                                                {rowActions.expire && (
                                                    <DropdownMenuItem onClick={() => router.post(`/admin/expire/provider/${row.id}`)}>
                                                        Expire
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
        </div>
    );
}
