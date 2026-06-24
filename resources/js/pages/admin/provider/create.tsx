import ProviderIntakeForm from "@/pages/shared/ProviderForm";
import type { Country, ProfessionCategory, Credential, SupportArea } from "@/types/provider";
import AppLayout from '@/layouts/app-layout.js';
import { Button } from '@/components/ui/button';
import { Head, router, usePage } from '@inertiajs/react';
import ProviderRegistration from "@/pages/shared/ProviderRegistration";

const breadcrumbs = [
    {
        title: 'Create Provider',
        href: '/providers/create',
    },
];


type CreateProviderPageProps = {
    countries: Country[];
    professionCategories: ProfessionCategory[];
    credentials: Credential[];
    supoort_areas: SupportArea[];
};

export default function CreateProviderPage({
    countries,
    professionCategories,
    credentials,
    supoort_areas
}: CreateProviderPageProps) {
    return (
        <div>


            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Clients" />
                <div className="p-4">
                    {/* <div className="my-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Providers</h1>
                        <Button onClick={() => router.visit(route('providers.create'))} className="cursor-pointer bg-black text-white hover:bg-gray-800">
                            <Plus className="mr-2" /> Create Provider
                        </Button>
                    </div> */}
                    {/* <ProviderIntakeForm
                        countries={countries}
                        professionCategories={professionCategories}
                        credentials={credentials}
                        support_areas={supoort_areas}
                    /> */}
                    <ProviderRegistration />
                </div>
            </AppLayout>








        </div>
    );
}
