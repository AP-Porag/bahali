// resources/js/components/provider/LocationSection.tsx
// Location step shared by the registration form (web/create) and the provider edit form (provider/edit).
//
//  • Country first, then only the cities / parishes / states that belong to that country.
//  • Extra locations ("multiple locations") are picked from the same lists — in the same
//    country or in another country, with the same rules.
//  • In-person care → the address must stay visible. Virtual care only → the address is
//    hidden automatically, but the provider can switch it back on.
import type { ComponentType, ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export interface RegionOption {
    id: number;
    name: string;
    parentId?: number | null;
    regionTypeName?: string;
    regionTypeLabel?: string;
}
export interface CountryOption {
    id: number;
    name: string;
    code?: string;
    regions: RegionOption[];
}
export interface ProviderLocation {
    country: string;
    state_province: string;
    city: string;
}
export type LocationErrors = Partial<Record<'address' | 'country' | 'state_province' | 'city' | 'multiple_locations' | 'additional_locations', string>>;

/* UI building blocks are passed in from the form so the look stays identical to the rest of it. */
export interface LocationUi {
    FieldShell: ComponentType<{ label?: string; required?: boolean; hint?: string; error?: string; children: ReactNode }>;
    TextInput: ComponentType<{ value: string; onChange: (v: string) => void; error?: boolean; placeholder?: string }>;
    SearchableSelect: ComponentType<{ value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; error?: boolean; placeholder?: string; searchPlaceholder?: string }>;
    RadioRow: ComponentType<{ value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; name: string }>;
    ConsentItem: ComponentType<{ checked: boolean; onChange: (v: boolean) => void; error?: string; children: ReactNode }>;
}

export interface LocationValues extends ProviderLocation {
    address: string;
    hide_address: boolean;
    multiple_locations: 'yes' | 'no' | '';
    additional_locations: ProviderLocation[];
    service_formats: string[];
}

/* ------------------------------------------------------------------ */
/*  Rules                                                              */
/* ------------------------------------------------------------------ */
export const IN_PERSON_FORMATS = ['In-Person', 'Hybrid'];
export const VIRTUAL_FORMATS = ['Virtual', 'Telehealth'];
export const MAX_ADDITIONAL_LOCATIONS = 10;

export function serviceFormatFlags(formats: string[] = []) {
    const hasInPerson = formats.some((f) => IN_PERSON_FORMATS.includes(f));
    const hasVirtual = formats.some((f) => VIRTUAL_FORMATS.includes(f));
    const virtualOnly = hasVirtual && formats.every((f) => VIRTUAL_FORMATS.includes(f));
    return { hasInPerson, hasVirtual, virtualOnly };
}

export const emptyLocation = (country = ''): ProviderLocation => ({ country, state_province: '', city: '' });

/*
 * Region levels for one country. Countries with a parent/child hierarchy (e.g. United Kingdom:
 * England → Manchester) get two dropdowns; every other country gets one (parish / state / province).
 */
export function locationLevels(countries: CountryOption[], countryName: string, level1Value: string) {
    const country = countries.find((c) => c.name === countryName);
    const regions = country?.regions ?? [];
    const parents = regions.filter((r) => !r.parentId);
    const hasHierarchy = parents.length > 0 && regions.some((r) => !!r.parentId);
    const level1 = hasHierarchy ? parents : regions;
    const parent = level1.find((r) => r.name === level1Value);
    const level2 = hasHierarchy && parent ? regions.filter((r) => r.parentId === parent.id) : [];
    const isUK = countryName === 'United Kingdom';
    const level1Label = isUK
        ? 'Country / City or Local Area'
        : (level1[0]?.regionTypeLabel || 'City / Parish / State');
    const level2Label = isUK ? 'City / Local Area' : (level2[0]?.regionTypeLabel || 'City / Local Area');
    return { country, regions, hasHierarchy, level1, level2, level1Label, level2Label, hasRegions: regions.length > 0 };
}

/* Returns the problem with one location, or null when it is complete and valid. */
export function locationProblem(countries: CountryOption[], loc: ProviderLocation): { field: keyof ProviderLocation; message: string } | null {
    if (!loc.country) return { field: 'country', message: 'Please select a country.' };
    const lv = locationLevels(countries, loc.country, loc.state_province);
    if (!lv.hasRegions) {
        return loc.city.trim() ? null : { field: 'city', message: 'Please enter the city or town.' };
    }
    if (!loc.state_province || !lv.level1.some((r) => r.name === loc.state_province)) {
        return { field: 'state_province', message: `Please select a ${lv.level1Label.toLowerCase()} from the list.` };
    }
    if (lv.level2.length > 0 && !lv.level2.some((r) => r.name === loc.city)) {
        return { field: 'city', message: `Please select a ${lv.level2Label.toLowerCase()} from the list.` };
    }
    return null;
}

const locationKey = (l: ProviderLocation) => [l.country, l.state_province, l.city].map((s) => s.trim().toLowerCase()).join('|');

/* Validation for the whole Location step (same rules in both forms). */
export function validateLocationStep(countries: CountryOption[], v: LocationValues): LocationErrors {
    const e: LocationErrors = {};
    const main = locationProblem(countries, v);
    if (main) e[main.field] = main.message;
    if (!v.address.trim()) e.address = 'Address is required.';
    if (!v.multiple_locations) e.multiple_locations = 'Please let us know if you serve multiple locations.';
    if (v.multiple_locations === 'yes') {
        if (v.additional_locations.length === 0) {
            e.additional_locations = 'Add at least one other location, or answer "No".';
        } else {
            const seen = new Set<string>([locationKey(v)]);
            for (let i = 0; i < v.additional_locations.length; i++) {
                const loc = v.additional_locations[i];
                const p = locationProblem(countries, loc);
                if (p) { e.additional_locations = `Location ${i + 2}: ${p.message}`; break; }
                const k = locationKey(loc);
                if (seen.has(k)) { e.additional_locations = `Location ${i + 2} is already listed.`; break; }
                seen.add(k);
            }
        }
    }
    return e;
}

/*
 * Values to submit: the free-text city is only kept for countries that have no region list,
 * extra locations only when "multiple locations" is Yes, and an in-person address is never hidden.
 */
export function locationPayload(countries: CountryOption[], v: LocationValues) {
    const clean = (l: ProviderLocation): ProviderLocation => {
        const lv = locationLevels(countries, l.country, l.state_province);
        return {
            country: l.country,
            state_province: lv.hasRegions ? l.state_province : '',
            city: lv.hasRegions && lv.level2.length === 0 ? '' : l.city.trim(),
        };
    };
    const main = clean(v);
    return {
        country: main.country,
        state_province: main.state_province,
        city: main.city,
        hide_address: serviceFormatFlags(v.service_formats).hasInPerson ? false : v.hide_address,
        additional_locations: v.multiple_locations === 'yes' ? v.additional_locations.map(clean) : [],
    };
}

/* ------------------------------------------------------------------ */
/*  One location: country → parish/state → (city)                      */
/* ------------------------------------------------------------------ */
function LocationPicker({
    ui, countries, value, onChange, errors = {}, compact = false,
}: {
    ui: LocationUi;
    countries: CountryOption[];
    value: ProviderLocation;
    onChange: (next: ProviderLocation) => void;
    errors?: Partial<Record<keyof ProviderLocation, string>>;
    compact?: boolean;
}) {
    const { FieldShell, SearchableSelect, TextInput } = ui;
    const lv = locationLevels(countries, value.country, value.state_province);
    const countryOptions = countries.map((c) => ({ value: c.name, label: c.name }));
    const muted = (text: string) => (
        <div className="rounded-lg border border-[#DED7C9] bg-[#FBF8F2] px-3.5 py-2.5 text-sm text-[#9AA6A4]">{text}</div>
    );

    return (
        <div className={compact ? 'grid gap-4 sm:grid-cols-2' : 'space-y-6'}>
            <FieldShell label="Country" required error={errors.country}>
                <SearchableSelect
                    value={value.country}
                    onChange={(v) => onChange({ country: v, state_province: '', city: '' })}
                    options={countryOptions}
                    error={!!errors.country}
                    placeholder="Select country…"
                    searchPlaceholder="Search countries…"
                />
            </FieldShell>

            {!value.country ? (
                <FieldShell label="City / Parish / State" required>
                    {muted('Select a country first to see its locations')}
                </FieldShell>
            ) : lv.hasRegions ? (
                <FieldShell label={lv.level1Label} required error={errors.state_province}>
                    <SearchableSelect
                        value={value.state_province}
                        onChange={(v) => onChange({ ...value, state_province: v, city: '' })}
                        options={lv.level1.map((r) => ({ value: r.name, label: r.name }))}
                        error={!!errors.state_province}
                        placeholder={`Select ${lv.level1Label.toLowerCase()}…`}
                        searchPlaceholder="Search…"
                    />
                </FieldShell>
            ) : (
                <FieldShell label="City / Town" required hint="We don't have a location list for this country yet." error={errors.city}>
                    <TextInput value={value.city} onChange={(v) => onChange({ ...value, city: v })} error={!!errors.city} placeholder="City or town" />
                </FieldShell>
            )}

            {lv.hasHierarchy && value.state_province && (
                <FieldShell label={lv.level2Label} required error={errors.city}>
                    {lv.level2.length > 0 ? (
                        <SearchableSelect
                            value={value.city}
                            onChange={(v) => onChange({ ...value, city: v })}
                            options={lv.level2.map((r) => ({ value: r.name, label: r.name }))}
                            error={!!errors.city}
                            placeholder={`Select ${lv.level2Label.toLowerCase()}…`}
                            searchPlaceholder="Search…"
                        />
                    ) : muted('No locations listed for this area')}
                </FieldShell>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  The whole Location step                                            */
/* ------------------------------------------------------------------ */
export function LocationSection({
    ui, countries, value, onChange, errors,
}: {
    ui: LocationUi;
    countries: CountryOption[];
    value: LocationValues;
    onChange: (patch: Partial<LocationValues>) => void;
    errors: LocationErrors;
}) {
    const { FieldShell, TextInput, RadioRow, ConsentItem } = ui;
    const { hasInPerson, virtualOnly } = serviceFormatFlags(value.service_formats);
    const extra = value.additional_locations;

    const updateExtra = (i: number, next: ProviderLocation) => onChange({ additional_locations: extra.map((l, idx) => (idx === i ? next : l)) });
    const removeExtra = (i: number) => onChange({ additional_locations: extra.filter((_, idx) => idx !== i) });
    const addExtra = () => {
        if (extra.length >= MAX_ADDITIONAL_LOCATIONS) return;
        onChange({ additional_locations: [...extra, emptyLocation(value.country)] });
    };

    return (
        <>
            {/* 1. Country first, then only that country's locations */}
            <LocationPicker
                ui={ui}
                countries={countries}
                value={{ country: value.country, state_province: value.state_province, city: value.city }}
                onChange={(next) => onChange(next)}
                errors={{ country: errors.country, state_province: errors.state_province, city: errors.city }}
            />

            {/* 2. Street address + who can see it */}
            <FieldShell label="Street address" required error={errors.address}>
                <TextInput value={value.address} onChange={(v) => onChange({ address: v })} error={!!errors.address} placeholder="Street address" />
            </FieldShell>

            {hasInPerson ? (
                <div className="flex items-start gap-3 rounded-lg border border-[#0E7C7B]/25 bg-[#0E7C7B]/5 px-4 py-3.5 text-sm text-[#26403F]">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0E7C7B]" fill="none" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" />
                        <circle cx="12" cy="11" r="2" />
                    </svg>
                    <span>
                        <span className="block font-medium">Your address will be shown on your profile.</span>
                        <span className="block text-[#5B6B6E]">You offer in-person care, so clients need your address to find you. It can't be hidden.</span>
                    </span>
                </div>
            ) : (
                <div>
                    <ConsentItem checked={value.hide_address} onChange={(v) => onChange({ hide_address: v })}>
                        Hide the address from public view
                    </ConsentItem>
                    {virtualOnly && (
                        <p className="mt-1.5 text-xs text-[#6B7A78]">
                            Hidden automatically because you offer virtual care only. Untick to show it on your profile.
                        </p>
                    )}
                </div>
            )}

            {/* 3. Other locations — picked from the same lists, any country */}
            <FieldShell label="Do you provide services across multiple locations?" required error={errors.multiple_locations}>
                <RadioRow
                    name="multiple_locations"
                    value={value.multiple_locations}
                    onChange={(v) => {
                        const yes = v === 'yes';
                        onChange({
                            multiple_locations: v as 'yes' | 'no',
                            additional_locations: yes && extra.length === 0 ? [emptyLocation(value.country)] : extra,
                        });
                    }}
                    options={[
                        { value: 'yes', label: 'Yes' },
                        { value: 'no', label: 'No' },
                    ]}
                />
            </FieldShell>

            {value.multiple_locations === 'yes' && (
                <FieldShell
                    label="Other locations you serve"
                    required
                    hint="Choose each location from the list for its country. To cover another country, change the country for that location."
                    error={errors.additional_locations}
                >
                    <div className="space-y-3">
                        {extra.map((loc, i) => (
                            <div key={i} className="rounded-xl border border-[#E7E0D2] bg-[#FBF8F2] p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-[#16302F]">Location {i + 2}</span>
                                    <button type="button" onClick={() => removeExtra(i)} className="text-sm text-[#C2543B] hover:underline">
                                        Remove
                                    </button>
                                </div>
                                <LocationPicker ui={ui} countries={countries} value={loc} onChange={(next) => updateExtra(i, next)} compact />
                            </div>
                        ))}
                        {extra.length < MAX_ADDITIONAL_LOCATIONS && (
                            <button
                                type="button"
                                onClick={addExtra}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#0E7C7B]/40 bg-[#0E7C7B]/5 px-3.5 py-2 text-sm font-medium text-[#0E7C7B] transition hover:bg-[#0E7C7B]/10"
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
                                Add another location
                            </button>
                        )}
                    </div>
                </FieldShell>
            )}
        </>
    );
}
