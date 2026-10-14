import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout.js';
import ProviderVerificationShow from '@/components/Verification'; // আপনার Verification কম্পোনেন্টের পাথ

export default function ShowForVerification({ provider, reviewFlags = [], rejectionReasons, indexRoute }) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Pending Provider', href: '/admin/pending/providers' },
            { title: 'Verification', href: '#' },
        ]}>
            <Head title="Provider Verification" />

            <div className="p-4">
                <ProviderVerificationShow
                    provider={provider}
                    reviewFlags={reviewFlags}
                    rejectionReasons={rejectionReasons}
                    indexRoute={indexRoute}
                />
            </div>
        </AppLayout>
    );
}
