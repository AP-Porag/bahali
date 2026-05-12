import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { DATE_PRESETS, formatDateUS } from '@/utils/helpers';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs = [{ title: 'Provider', href: '/providers' }, { title: 'View Provider' }];

export default function Show({ provider }: any) {
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
            <Head title="Provider Details" />

            <div className="grid grid-cols-1 gap-10 p-4 lg:grid-cols-2 lg:gap-4 font-roboto">
                {/* ================= CLIENT INFORMATION ================= */}
                <Card className="rounded-xl">
                    <div className="flex justify-between">
                        <CardHeader>
                            <CardTitle>Provider Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-3 h-20 w-20 overflow-hidden rounded-full border-2 border-gray-100 shadow-sm">
                                {provider?.avatar ? (
                                    <img
                                        src={`/storage/${provider.avatar}`}
                                        alt={provider.name}
                                        className="h-full w-full object-cover"
                                        onError={(e: any) => {
                                            e.target.src = 'https://ui-avatars.com/api/?name=' + provider.name;
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xl font-bold text-gray-500">
                                        {provider?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </div>

                    <CardContent className="space-y-4 -mt-10">
                        <div>
                            <p className="text-sm font-semibold">Name</p>
                            <p className="text-sm text-gray-600">{provider?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Email</p>
                            <p className="text-sm text-gray-600">{provider?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Phone</p>
                            <p className="text-sm text-gray-600">{provider?.phone}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Provider Type</p>
                            <p className="text-sm text-gray-600">{provider?.provider_type?.name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Region</p>
                            <p className="text-sm text-gray-600">{provider?.region}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Service</p>
                            <p className="text-sm text-gray-600">{provider?.service}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Location</p>
                            <p className="text-sm text-gray-600">{provider?.location}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Bio</p>
                            <p className="text-sm text-gray-600">{provider?.bio}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Status</p>
                            <p className="text-sm text-gray-600">{provider?.status}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Provider Verifiction Status</p>
                            <p className="text-sm text-gray-600">{provider?.verification_status}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Created At</p>
                            <p className="text-sm text-gray-600">{formatDateUS(provider.created_at, DATE_PRESETS.SHORT)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
