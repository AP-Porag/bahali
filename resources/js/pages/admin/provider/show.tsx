import ContactComponent from '@/components/common/ContactComponent';
import NoteComponent from '@/components/common/NoteComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { DATE_PRESETS, formatDateUS } from '@/utils/helpers';
import { Head } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import { Tooltip } from 'react-tooltip';

const breadcrumbs = [{ title: 'Clients', href: '/clients' }, { title: 'View Client' }];

export default function Show({ client }: any) {
    const [openAgreement, setOpenAgreement] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const formatUSD = (amount: number) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);

    const openPdf = (index: number) => {
        setSelectedIndex(index);
        setOpenAgreement(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client Details" />

            <div className="grid grid-cols-1 gap-10 p-4 lg:grid-cols-2 lg:gap-4">
                {/* ================= CLIENT INFORMATION ================= */}
                <Card className="rounded-xl">
                    <CardHeader>
                        <CardTitle>Client Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold">Client Name</p>
                            <p className="text-sm text-gray-600">{client?.name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Company</p>
                            <p className="text-sm text-gray-600">{client?.company_name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Email</p>
                            <p className="text-sm text-gray-600">{client?.email}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Phone</p>
                            <p className="text-sm text-gray-600">{client?.phone}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Address</p>
                            <p className="text-sm text-gray-600">{client?.address}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Type</p>
                            <p className="text-sm text-gray-600">{client?.client_type}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Fee Value</p>
                            <p className="text-sm text-gray-600">{formatUSD(client?.fee_value ?? '—')}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Departments</p>
                            <div className="mt-1 flex flex-wrap gap-2">
                                {client?.departments?.map((dept) => (
                                    <span key={dept.id} className="inline-flex items-center rounded-sm bg-gray-200 px-2 py-1 text-xs font-medium">
                                        {dept.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Rating</p>
                            <p className="text-sm text-gray-600">{client?.rating?.toUpperCase() ?? '—'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Status</p>
                            <p className="text-sm text-gray-600">{client?.status == 1 ? 'Active' : 'Inactive'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Created At</p>
                            <p className="text-sm text-gray-600">{formatDateUS(client.created_at, DATE_PRESETS.SHORT)}</p>
                        </div>

                        {/* ================= AGREEMENTS LIST ================= */}
                        <div className="pt-2">
                            {client?.agreements?.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold">Agreements</p>

                                    {client.agreements.map((agreement) => (
                                        <div>
                                            <button
                                                key={agreement.id}
                                                onClick={() => {
                                                    setSelectedIndex(client.agreements.findIndex((r) => r.id === agreement.id));
                                                    setOpenAgreement(true);
                                                }}
                                                className="my-anchor-element flex items-center gap-2 rounded-sm bg-gray-100 p-2 text-black shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/10"
                                            >
                                                <span className="rounded-full bg-gray-300 p-2">
                                                    <FileText className="h-4 w-4" />
                                                </span>
                                                {agreement.original_name ?? 'View Agreement'}
                                            </button>

                                            <Tooltip anchorSelect=".my-anchor-element" place="right" className="text-blue-100">
                                                Click to View, Download and Print
                                            </Tooltip>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No Agreement Uploaded</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* ================= NOTES ================= */}
                <NoteComponent noteableType="client" noteableId={client.id} notes={client.notes} />

                {/* ================= Contact ================= */}

                <ContactComponent contactableType="client" contactableId={client.id} contacts={client.contacts} client={client} />
            </div>

            {/* ================= PDF MODAL (MULTIPLE SUPPORT) ================= */}
            {openAgreement && client?.agreements?.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="relative h-[90vh] w-[90vw] rounded-lg bg-white p-2">
                        {/* CLOSE */}
                        <button onClick={() => setOpenAgreement(false)} className="absolute top-2 right-3 rounded bg-gray-200 px-3 py-1 text-sm">
                            Close
                        </button>

                        {/* NAVIGATION */}
                        <div className="absolute top-2 left-3 flex gap-2">
                            <button
                                disabled={selectedIndex === 0}
                                onClick={() => setSelectedIndex((prev) => prev - 1)}
                                className="rounded bg-gray-200 px-2 py-1 text-sm disabled:opacity-40"
                            >
                                Prev
                            </button>

                            <button
                                disabled={selectedIndex === client.agreements.length - 1}
                                onClick={() => setSelectedIndex((prev) => prev + 1)}
                                className="rounded bg-gray-200 px-2 py-1 text-sm disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>

                        {/* FILE NAME */}
                        <div className="text-center text-sm font-semibold">{client.agreements[selectedIndex]?.original_name}</div>

                        {/* PDF VIEW */}
                        <iframe src={`/storage/${client.agreements[selectedIndex]?.file_path}`} className="mt-4 h-[94%] w-full rounded bg-red-800" />
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
