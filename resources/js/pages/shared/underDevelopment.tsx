import { Clock, Wrench, Info, Plus } from "lucide-react";
import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout.js';
import React from 'react';
const breadcrumbs = [
    {
        title: 'Under-development',
        href: '/under-development',
    },
];

/**
 * UnderDevelopment.jsx
 *
 * Global placeholder page for unfinished modules.
 * Module name is derived dynamically from sidebar navigation (via Inertia props).
 * No hardcoding per module.
 */

export default function UnderDevelopment() {
    const { module } = usePage().props;

    const moduleName = module ?? "This module";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs} />
            <div className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-6">
                <div className="w-full max-w-2xl rounded-2xl bg-white p-10 shadow-xl">
                    {/* Header */}
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
                            <Wrench className="h-10 w-10 text-indigo-600" />
                        </div>

                        <h1 className="text-2xl font-semibold text-gray-800">{moduleName} is under development</h1>

                        <p className="mt-3 max-w-md text-gray-600">
                            This section is part of the ongoing system rollout. The core recruitment workflow is already stable, and this module will
                            be enabled once it meets production standards.
                        </p>
                    </div>

                    {/* Info Section */}
                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex items-start gap-3 rounded-xl bg-gray-100 p-4">
                            <Clock className="mt-0.5 h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-800">Current status</p>
                                <p className="text-sm text-gray-600">In active development & internal testing</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl bg-gray-100 p-4">
                            <Info className="mt-0.5 h-5 w-5 text-emerald-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-800">What you can do</p>
                                <p className="text-sm text-gray-600">Continue using Jobs, Candidates, and Pipeline modules</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t pt-6 text-center">
                        <p className="text-xs text-gray-500">
                            If this module is required urgently, please contact an administrator or project owner for prioritization.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
