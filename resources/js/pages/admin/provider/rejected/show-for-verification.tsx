import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout.js';
import ProviderVerificationShow from '@/components/Verification'; // আপনার Verification কম্পোনেন্টের পাথ

export default function ShowForVerification({ provider, indexRoute }) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Pending Provider', href: '/admin/pending/providers' },
            { title: 'Verification', href: '#' },
        ]}>
            <Head title="Provider Verification" />

            <div className="p-4">
                <ProviderVerificationShow
                    provider={provider}
                    indexRoute={indexRoute}
                />
            </div>
        </AppLayout>
    );
}
