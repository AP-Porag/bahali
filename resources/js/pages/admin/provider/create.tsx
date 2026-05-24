import ProviderIntakeForm from "@/pages/shared/ProviderForm";

type Region = {
    id: number;
    name: string;
};

type RegionType = {
    id: number;
    name: string;
    regions: Region[];
};

type Country = {
    id: number;
    name: string;
    region_types: RegionType[];
};

type CreateProviderPageProps = {
    countries: Country[];
};

export default function CreateProviderPage({
    countries,
}: CreateProviderPageProps) {

    return (
        <div>
            <ProviderIntakeForm countries={countries} />
        </div>
    );
}
