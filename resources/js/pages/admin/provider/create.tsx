import ProviderIntakeForm from "@/pages/shared/ProviderForm";
import type { Country, ProfessionCategory, Credential, SupportArea } from "@/types/provider";


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
            <ProviderIntakeForm
                countries={countries}
                professionCategories={professionCategories}
                credentials={credentials}
                support_areas={supoort_areas}
            />
        </div>
    );
}
