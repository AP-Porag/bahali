import React from 'react';
import { router } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, EyeIcon } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input.js';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import CustomDeleteModal from '@/components/common/CustomDeleteModal.jsx';
import { toast } from 'sonner';

export default function DataTable({
                                      data,
                                      columns,
                                      meta,
                                      actions = {
                                          view: false,
                                          edit: true,
                                          delete: true,
                                          search_filter:true,
                                          status_filter:true,
                                          per_page_filter:true,
                                      },
                                      baseRoute,
                                      filters,
                                      onFilterChange,
                                      perPageOptions = [5, 10, 25, 50],
                                  })
{
    const [deleteId, setDeleteId] = React.useState(null);

    // const handleDeleteConfirm = () => {
    //     router.delete(route(`${baseRoute}.destroy`, deleteId), {
    //         onSuccess: () => setDeleteId(null),
    // });
    // };

    const globalActions = {
        search_filter: true,
        status_filter: true,
        per_page_filter: true,
        ...(typeof actions === 'object' ? actions : {}),
    };

    // PER ROW (many times)
    const resolveActions = (row) => {
        if (typeof actions === 'function') {
                                              return actions(row);
                                          }
                                          return actions;
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
                                              page, // ✅ update page in filters
                                          });
                                      };

                                      // Handle filter changes (search, status, perPage)
                                      const handleFilterChange = (e) => {
                                          onFilterChange({
                                              ...filters,
                                              [e.target.name]: e.target.value,
                                              page: 1, // reset to first page on filter change
                                          });
                                      };

                                      return (
                                          <div className="space-y-4 rounded-xl bg-white p-4 text-black shadow dark:text-white">
                                              {/* Filters */}
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
                                                      <Select
                                                          name="status"
                                                          value={filters.status}
                                                          // onChange={handleFilterChange}
                                                          onValueChange={(value) => handleFilterChange({ target: { name: 'status', value } })}
                                                          className="px-3 py-2 md:w-1/6"
                                                      >
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
                                                      <Select
                                                          name="perPage"
                                                          value={Number(filters.perPage)}
                                                          onValueChange={(value) => handleFilterChange({ target: { name: 'perPage', value } })}
                                                          className="px-3 py-2 md:w-1/6"
                                                      >
                                                          <SelectTrigger className="w-[180px]">
                                                              <SelectValue placeholder="Select Status" />
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

                                                  {/*<select name="perPage" value={filters.perPage} onChange={handleFilterChange} className="w-full rounded border px-3 py-2 md:w-1/6">*/}
                                                  {/*    {perPageOptions.map((opt) => (*/}
                                                  {/*        <option key={opt} value={opt}>*/}
                                                  {/*            {opt} per page*/}
                                                  {/*        </option>*/}
                                                  {/*    ))}*/}
                                                  {/*</select>*/}
                                              </div>

                                              {/* Table */}
                                              <table className="min-w-full table-auto">
                                                  <thead className="border-b text-left">
                                                      <tr>
                                                          {columns.map((col) => (
                                                              <th key={col.key} className="px-4 py-2">
                                                                  {col.label}
                                                              </th>
                                                              // <th
                                                              //     key={col.key}
                                                              //     className="cursor-pointer px-4 py-2 select-none"
                                                              //     onClick={() => {
                                                              //         if (!col.sortable) return;
                                                              //
                                                              //         const direction =
                                                              //             filters.sort === col.key && filters.direction === 'asc'
                                                              //                 ? 'desc'
                                                              //                 : 'asc';
                                                              //
                                                              //         onFilterChange({
                                                              //             ...filters,
                                                              //             sort: col.key,
                                                              //             direction,
                                                              //             page: 1,
                                                              //         });
                                                              //     }}
                                                              // >
                                                              //     <div className="flex items-center gap-1">
                                                              //         {col.label}
                                                              //
                                                              //         {col.sortable && filters.sort === col.key && (
                                                              //             <span className="text-xs">
                                                              //                 {filters.direction === 'asc' ? '▲' : '▼'}
                                                              //             </span>
                                                              //         )}
                                                              //     </div>
                                                              // </th>
                                                          ))}
                                                          <th className="px-4 py-2 text-right">Actions</th>
                                                      </tr>
                                                  </thead>
                                                  <tbody>
                                                      {data.length === 0 ? (
                                                          <tr>
                                                              <td colSpan={columns.length + 1} className="px-4 py-4 text-center text-gray-500">
                                                                  No data found.
                                                              </td>
                                                          </tr>
                                                      ) : (
                                                          data.map((row) => (
                                                              <tr key={row.id} className="border-b hover:bg-gray-50">
                                                                  {columns.map((col) => (
                                                                      <td key={col.key} className="px-4 py-2">
                                                                          {col.render ? col.render(row) : row[col.key]}
                                                                      </td>
                                                                  ))}
                                                                  <td className="px-4 py-2 text-right">
                                                                      <DropdownMenu>
                                                                          <DropdownMenuTrigger asChild>
                                                                              <Button size="action" className="cursor-pointer text-white">
                                                                                  <MoreVertical className="h-4 w-4" />
                                                                              </Button>
                                                                          </DropdownMenuTrigger>
                                                                          <DropdownMenuContent
                                                                              side="bottom"
                                                                              align="end"
                                                                              className="bg-white text-black"
                                                                          >
                                                                              {(() => {
                                                                                  const rowActions = resolveActions(row);

                                                                                  return (
                                                                                      <>
                                                                                          {/* EDIT */}
                                                                                          {rowActions.edit && (
                                                                                              <DropdownMenuItem
                                                                                                  onClick={() =>
                                                                                                      router.visit(route(`${baseRoute}.edit`, row.id))
                                                                                                  }
                                                                                                  className="cursor-pointer"
                                                                                              >
                                                                                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                                                                              </DropdownMenuItem>
                                                                                          )}

                                                                                          {/* VIEW */}
                                                                                          {rowActions.view && (
                                                                                              <DropdownMenuItem
                                                                                                  onClick={() =>
                                                                                                      router.visit(route(`${baseRoute}.show`, row.id))
                                                                                                  }
                                                                                                  className="cursor-pointer"
                                                                                              >
                                                                                                  <EyeIcon className="mr-2 h-4 w-4" /> View
                                                                                              </DropdownMenuItem>
                                                                                          )}

                                                                                          {/* DELETE */}
                                                                                          {rowActions.delete && (
                                                                                              <DropdownMenuItem
                                                                                                  onClick={() => setDeleteId(row.id)}
                                                                                                  className="cursor-pointer"
                                                                                              >
                                                                                                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />{' '}
                                                                                                  Delete
                                                                                              </DropdownMenuItem>
                                                                                          )}

                                                                                          {/* CUSTOM ACTIONS */}
                                                                                          {Object.entries(rowActions).map(([key, value]) => {
                                                                                              if (
                                                                                                  ['view', 'edit', 'delete'].includes(key) ||
                                                                                                  !value ||
                                                                                                  typeof value !== 'object'
                                                                                              )
                                                                                                  return null;

                                                                                              return (
                                                                                                  <DropdownMenuItem
                                                                                                      key={key}
                                                                                                      onClick={value.action}
                                                                                                      className="cursor-pointer"
                                                                                                  >
                                                                                                      {value.icon && (
                                                                                                          <value.icon className="mr-2 h-4 w-4" />
                                                                                                      )}
                                                                                                      {value.label}
                                                                                                  </DropdownMenuItem>
                                                                                              );
                                                                                          })}
                                                                                      </>
                                                                                  );
                                                                              })()}
                                                                          </DropdownMenuContent>
                                                                      </DropdownMenu>
                                                                  </td>
                                                              </tr>
                                                          ))
                                                      )}
                                                  </tbody>
                                              </table>

                                              {/* Pagination Controls */}
                                              {meta && (
                                                  <div className="mt-4 flex items-center justify-between">
                                                      <div>
                                                          <p className="text-sm text-gray-600">
                                                              Showing <strong>{meta.from}</strong> to <strong>{meta.to}</strong> of{' '}
                                                              <strong>{meta.total}</strong> results
                                                          </p>
                                                      </div>
                                                      <div className="flex items-center gap-1">
                                                          {/* Previous Button */}
                                                          <button
                                                              onClick={() => goToPage(meta.current_page - 1)}
                                                              disabled={meta.current_page <= 1}
                                                              className="cursor-pointer rounded bg-gray-200 p-2 text-black hover:bg-gray-300 disabled:opacity-50"
                                                          >
                                                              <ChevronLeft className="h-4 w-4" />
                                                          </button>

                                                          {/* Page Numbers */}
                                                          {[...Array(meta.last_page).keys()].map((_, i) => {
                                                              const page = i + 1;
                                                              return (
                                                                  <button
                                                                      key={page}
                                                                      onClick={() => goToPage(page)}
                                                                      className={`cursor-pointer rounded px-3 py-1 ${
                                                                          page === meta.current_page
                                                                              ? 'bg-black text-white'
                                                                              : 'bg-gray-200 text-black hover:bg-gray-300'
                                                                      }`}
                                                                  >
                                                                      {page}
                                                                  </button>
                                                              );
                                                          })}

                                                          {/* Next Button */}
                                                          <button
                                                              onClick={() => goToPage(meta.current_page + 1)}
                                                              disabled={meta.current_page >= meta.last_page}
                                                              className="cursor-pointer rounded bg-gray-200 p-2 text-black hover:bg-gray-300 disabled:opacity-50"
                                                          >
                                                              <ChevronRight className="h-4 w-4" />
                                                          </button>
                                                      </div>
                                                  </div>
                                              )}

                                              {/*<CustomDeleteModal*/}
                                              {/*    open={!!deleteId}*/}
                                              {/*    onClose={() => setDeleteId(null)}*/}
                                              {/*    onConfirm={handleDeleteConfirm}*/}
                                              {/*/>*/}
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
