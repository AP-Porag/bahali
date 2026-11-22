/* Shapes sent by App\Http\Controllers\Web\FindSupportController / App\Support\ConnectTaxonomy. */

export interface ConnectTopic {
    name: string;
    description: string;
    /** Approved search aliases — matched by Get Help's topic search. */
    terms: string;
}

export interface ConnectRegion {
    id: number;
    name: string;
    parentId: number | null;
    regionTypeLabel?: string | null;
}

export interface ConnectCountry {
    id: number;
    name: string;
    regions: ConnectRegion[];
}

/** Search preferences — kept in the server session, never in the page address (privacy rule). */
export interface ConnectFilters {
    country: string;
    region: string;
    topic: string;
    virtual: boolean;
    language: string;
    role: string;
}

export const EMPTY_FILTERS: ConnectFilters = { country: '', region: '', topic: '', virtual: false, language: '', role: '' };

/** Parish / state / region options for a country (first level only). */
export function subregionsOf(countries: ConnectCountry[], country: string): ConnectRegion[] {
    return (countries.find((c) => c.name === country)?.regions || []).filter((r) => !r.parentId);
}

/** "Parish" for Jamaica, "State" for the United States… taken from the region type in the database. */
export function subregionLabel(countries: ConnectCountry[], country: string): string {
    const label = subregionsOf(countries, country)[0]?.regionTypeLabel;
    return label ? label.charAt(0).toUpperCase() + label.slice(1) : 'Region or city';
}

/** Set when a profile is opened from the results list, so "Back to results" can step back in history. */
export const FROM_RESULTS_KEY = 'connect-profile-from-results';
