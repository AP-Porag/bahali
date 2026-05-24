import React, { useMemo, useState } from "react";

type FormState = {
    providerName: string;
    email: string;
    phone: string;

    country: string;
    regionType: string;
    region: string;
    cityTown: string;
    serviceArea: string;

    serviceFormat: string;

    professions: string[];
    credentials: string[];
    areasOfSupport: string[];

    streetAddress1: string;
    streetAddress2: string;
    postalCode: string;
    latitude: string;
    longitude: string;



    verification_address: string;
    billing_address: string

    addressVisibilityPreference: string;
    locationSensitivityFlag: boolean;
};

type RegionType = {
    id: number;
    name: string;
    label: string; // Add label field if it exists in your data
    // ... other fields
};

type Region = {
    id: number;
    name: string;
    region_type: RegionType; // Note: region_type is an object, not just an ID
    region_type_id: number;
    country_id: number;
    // ... other fields
};

type Country = {
    id: number;
    name: string;
    code: string;
    regions: Region[]; // Direct regions array instead of region_types array
    is_caribbean: boolean;
    is_diaspora: boolean;
    // ... other fields
};

type ProviderIntakeFormProps = {
    countries: Country[];
};

const steps = [
    "Welcome",
    "Location",
    "Professional Role",
    // "Service & Privacy",
];

// =======================
// SEED DATA (DB READY)
// =======================

const PROFESSIONS = [
    "Psychologist",
    "Clinical Psychologist",
    "Psychiatrist",
    "Pastoral Counselor",
    "Community Health Worker",
    "Life Coach",
    "Peer Support Specialist",
];

const CREDENTIALS = ["PhD", "PsyD", "MD", "LCSW", "LMFT", "LPC"];

const SUPPORTS = [
    "Anxiety",
    "Trauma / PTSD",
    "Grief & Loss",
    "Substance Use",
    "Spiritual Care",
    "Community Healing",
];

// =======================
// COUNTRY TAXONOMY
// =======================



// const MAP: Record<string, { type: string; regions: string[] }> = {
//     Jamaica: {
//         type: "Parish",
//         regions: ["Kingston", "St. Andrew", "St. James", "St. Elizabeth"],
//     },
//     USA: {
//         type: "State",
//         regions: ["New York", "Florida", "Texas", "California"],
//     },
//     Canada: {
//         type: "Province",
//         regions: ["Ontario", "Quebec", "Alberta"],
//     },
// };


export default function ProviderIntakePremium({
    countries,
}: ProviderIntakeFormProps) {
    const [step, setStep] = useState(0);

    const [form, setForm] = useState<FormState>({
        providerName: "",
        email: "",
        phone: "",

        country: "",
        regionType: "",
        region: "",
        cityTown: "",
        serviceArea: "",

        serviceFormat: "virtual",

        professions: [],
        credentials: [],
        areasOfSupport: [],

        streetAddress1: "",
        streetAddress2: "",
        postalCode: "",
        latitude: "",
        longitude: "",

        verification_address: "",
        billing_address: "",

        addressVisibilityPreference: "city_region_only",
        locationSensitivityFlag: false,
    });
    console.log(countries)

    const regionMap = useMemo(() => {
        const map: Record<number, { type: string; regions: string[] }> = {};

        countries?.forEach((country) => {
            const grouped: Record<string, string[]> = {};

            country.region_types?.forEach((rt) => {
                const type = rt.name;

                rt.regions?.forEach((r) => {
                    if (!grouped[type]) grouped[type] = [];
                    grouped[type].push(r.name);
                });
            });

            const firstType = Object.keys(grouped)[0];

            map[country.id] = {
                type: firstType || "Region",
                regions: grouped[firstType] || [],
            };
        });

        return map;
    }, [countries]);

    const selectedCountry = useMemo(() => {
        return countries.find((c) => String(c.id) === String(form.country));
    }, [form.country, countries]);


    const regionConfig = useMemo(() => {
        if (!selectedCountry || !selectedCountry.regions) return null;

        // Group regions by their region_type
        const grouped: Record<string, string[]> = {};

        selectedCountry.regions.forEach((region) => {
            // Access the nested region_type from each region
            const typeName = region.region_type?.name || "Region";

            if (!grouped[typeName]) {
                grouped[typeName] = [];
            }
            grouped[typeName].push(region.name);
        });

        // Get the first region type (or you can make it selectable if there are multiple types)
        const types = Object.keys(grouped);
        const selectedType = types.length > 0 ? types[0] : "Region";

        return {
            type: selectedType,
            regions: grouped[selectedType] || [],
        };
    }, [selectedCountry]);
    const update = (key: keyof FormState, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const toggleMulti = (key: keyof FormState, value: string) => {
        setForm((prev: any) => {
            const exists = prev[key].includes(value);
            return {
                ...prev,
                [key]: exists
                    ? prev[key].filter((v: string) => v !== value)
                    : [...prev[key], value],
            };
        });
    };

    const next = () =>
        setStep((s) => Math.min(s + 1, steps.length - 1));

    const back = () =>
        setStep((s) => Math.max(s - 1, 0));

    const submit = () => {
        if (step !== steps.length - 1) {
            next();
            return;
        }

        console.log("FINAL PAYLOAD:", form);
    };

    const inputClass =
        "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2A1458] transition";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#120B2C] via-[#2A1458] to-[#0E7490] p-6">

            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-[#1C0F3A]">
                        Provider Onboarding
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Bahali Trust & Care Network
                    </p>

                    {/* PROGRESS */}
                    <div className="mt-6 flex gap-2">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition ${i <= step
                                    ? "bg-[#2A1458]"
                                    : "bg-gray-200"
                                    }`}
                            />
                        ))}
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                        Step {step + 1} of {steps.length} —{" "}
                        <span className="font-medium">
                            {steps[step]}
                        </span>
                    </p>
                </div>

                {/* FORM */}
                <div className="space-y-6">

                    {/* STEP 1 */}
                    {step === 0 && (
                        <div className="space-y-4">
                            <input
                                className={inputClass}
                                placeholder="Provider / Organization Name"
                                value={form.providerName}
                                onChange={(e) =>
                                    update("providerName", e.target.value)
                                }
                            />

                            <input
                                className={inputClass}
                                placeholder="Email Address"
                                value={form.email}
                                onChange={(e) =>
                                    update("email", e.target.value)
                                }
                            />

                            <input
                                className={inputClass}
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={(e) =>
                                    update("phone", e.target.value)
                                }
                            />
                        </div>
                    )}

                    {/* STEP 2 - LOCATION (FULL BAHALI STRUCTURE) */}
                    {step === 1 && (
                        <div className="space-y-5">

                            {/* COUNTRY */}
                            <div className="bg-gray-50 border rounded-xl p-4 space-y-4">
                                <label className="text-sm font-medium">Country *</label>
                                <select
                                    className={inputClass}
                                    value={form.country}
                                    onChange={(e) => {
                                        const countryId = e.target.value;

                                        const selected = countries.find(
                                            (c) => String(c.id) === countryId
                                        );

                                        update("country", String(e.target.value));
                                        update("region", "");
                                    }}
                                >
                                    <option value="">Select Country</option>

                                    {countries.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>

                                {/* REGION TYPE (READ-ONLY) */}
                                {selectedCountry && (
                                    <div>
                                        <label className="text-sm font-medium">
                                            Region Type
                                        </label>
                                        <input
                                            className={`${inputClass} bg-gray-100`}
                                            value={regionConfig?.type || "Loading..."}
                                            readOnly
                                        />
                                    </div>
                                )}

                                {/* REGION (DEPENDENT DROPDOWN) */}
                                {regionConfig && regionConfig.regions.length > 0 ? (
                                    <div>
                                        <label className="text-sm font-medium">
                                            Select {regionConfig.type} *
                                        </label>
                                        <select
                                            className={inputClass}
                                            value={form.region}
                                            onChange={(e) => {
                                                update("region", e.target.value);
                                                // Find the selected region to get its region_type
                                                const selectedRegion = selectedCountry?.regions?.find(
                                                    r => r.name === e.target.value
                                                );
                                                if (selectedRegion?.region_type?.name) {
                                                    update("regionType", selectedRegion.region_type.name);
                                                }
                                            }}
                                        >
                                            <option value="">
                                                Select {regionConfig.type}
                                            </option>
                                            {regionConfig.regions.map((r) => (
                                                <option key={r} value={r}>
                                                    {r}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : selectedCountry ? (
                                    <div className="text-sm text-gray-500 p-2">
                                        No regions available for this country
                                    </div>
                                ) : null}
                                {/* CITY / COMMUNITY */}
                                <div>
                                    <label className="text-sm font-medium">
                                        City / Town / Community (Public)
                                    </label>
                                    <input
                                        className={inputClass}
                                        placeholder="e.g. Kingston, Montego Bay, Brooklyn"
                                        value={form.cityTown}
                                        onChange={(e) =>
                                            update("cityTown", e.target.value)
                                        }
                                    />
                                </div>

                                {/* SERVICE AREA */}
                                <div>
                                    <label className="text-sm font-medium">
                                        Service Area (Public)
                                    </label>
                                    <input
                                        className={inputClass}
                                        placeholder="e.g. St. James, Virtual Caribbean-wide"
                                        value={form.serviceArea}
                                        onChange={(e) =>
                                            update("serviceArea", e.target.value)
                                        }
                                    />
                                </div>

                                {/* SERVICE FORMAT */}
                                <div>
                                    <label className="text-sm font-medium">
                                        Service Format (Public)
                                    </label>
                                    <select
                                        className={inputClass}
                                        value={form.serviceFormat}
                                        onChange={(e) =>
                                            update("serviceFormat", e.target.value)
                                        }
                                    >
                                        <option value="">Select Format</option>
                                        <option value="virtual">Virtual Only</option>
                                        <option value="in_person">In-Person</option>
                                        <option value="hybrid">Hybrid</option>
                                        <option value="mobile">
                                            Mobile / Community-Based
                                        </option>
                                    </select>
                                </div>
                            </div>



                            {/* STREET ADDRESS - PRIVATE SECTION */}
                            {form.serviceFormat !== "virtual" && (
                                <div className="bg-gray-50 border rounded-xl p-4 space-y-4">

                                    <p className="text-sm font-semibold text-gray-700">
                                        Private Address Information (Admin Only)
                                    </p>

                                    <input
                                        className={inputClass}
                                        placeholder="Street Address Line 1 (Private)"
                                        value={form.streetAddress1}
                                        onChange={(e) =>
                                            update("streetAddress1", e.target.value)
                                        }
                                    />

                                    <input
                                        className={inputClass}
                                        placeholder="Street Address Line 2 (Private)"
                                        value={form.streetAddress2}
                                        onChange={(e) =>
                                            update("streetAddress2", e.target.value)
                                        }
                                    />

                                    <input
                                        className={inputClass}
                                        placeholder="Postal Code (Private)"
                                        value={form.postalCode}
                                        onChange={(e) =>
                                            update("postalCode", e.target.value)
                                        }
                                    />
                                </div>
                            )}

                            {/* GEO DATA (PRIVATE / SYSTEM USE ONLY) */}
                            <div className="grid grid-cols-2 gap-4">

                                <input
                                    className={inputClass}
                                    placeholder="Latitude (Admin/System)"
                                    value={form.latitude}
                                    onChange={(e) =>
                                        update("latitude", e.target.value)
                                    }
                                />

                                <input
                                    className={inputClass}
                                    placeholder="Longitude (Admin/System)"
                                    value={form.longitude}
                                    onChange={(e) =>
                                        update("longitude", e.target.value)
                                    }
                                />
                            </div>

                            {/* ADDRESS VISIBILITY CONTROL */}
                            <div>
                                <label className="text-sm font-medium">
                                    Address Visibility Preference *
                                </label>

                                <select
                                    className={inputClass}
                                    value={form.addressVisibilityPreference}
                                    onChange={(e) =>
                                        update(
                                            "addressVisibilityPreference",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="no_display">
                                        Do not display address
                                    </option>

                                    <option value="city_region_only">
                                        Display city & region only (Default)
                                    </option>

                                    <option value="service_area">
                                        Display service area only
                                    </option>

                                    <option value="full_address">
                                        Display full address (Requires Admin Review)
                                    </option>
                                </select>
                            </div>

                            {/* LOCATION SENSITIVITY FLAG */}
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.locationSensitivityFlag}
                                    onChange={(e) =>
                                        update(
                                            "locationSensitivityFlag",
                                            e.target.checked
                                        )
                                    }
                                />
                                <span className="text-sm text-gray-700">
                                    Sensitive location (home office, trauma service,
                                    crisis support, virtual-only)
                                </span>
                            </label>


                            {/* ADMIN-ONLY ADDITIONAL ADDRESS FIELDS */}
                            <div className="space-y-4 pt-2">

                                <input
                                    className={inputClass}
                                    placeholder="Verification Address (Admin Only)"
                                    value={form.verification_address}
                                    onChange={(e) =>
                                        update("verification_address", e.target.value)
                                    }
                                />

                                <input
                                    className={inputClass}
                                    placeholder="Billing Address (Admin Only)"
                                    value={form.billing_address}
                                    onChange={(e) =>
                                        update("billing_address", e.target.value)
                                    }
                                />

                            </div>

                            {/* ADMIN FIELDS NOTE */}
                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-xs text-yellow-800">
                                Admin-only fields (verification_address, billing_address)
                                are stored securely in backend and never shown in UI.
                            </div>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 2 && (
                        <div className="space-y-6">

                            {/* PROFESSIONS */}
                            <MultiSelect
                                label="Profession / Role"
                                options={PROFESSIONS}
                                value={form.professions}
                                onChange={(val) => update("professions", val)}
                            />

                            {/* CREDENTIALS */}
                            <MultiSelect
                                label="Credentials"
                                options={CREDENTIALS}
                                value={form.credentials}
                                onChange={(val) => update("credentials", val)}
                            />

                            {/* AREAS OF SUPPORT */}
                            <MultiSelect
                                label="Areas of Support"
                                options={SUPPORTS}
                                value={form.areasOfSupport}
                                onChange={(val) => update("areasOfSupport", val)}
                            />

                        </div>
                    )}
                    {/* STEP 4 */}
                    {/* {step === 3 && (
                        <div className="space-y-4">

                            <select
                                className={inputClass}
                                value={form.serviceFormat}
                                onChange={(e) =>
                                    update(
                                        "serviceFormat",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="virtual">
                                    Virtual
                                </option>
                                <option value="in_person">
                                    In-Person
                                </option>
                                <option value="hybrid">
                                    Hybrid
                                </option>
                                <option value="mobile">
                                    Mobile
                                </option>
                            </select>

                            <select
                                className={inputClass}
                                value={
                                    form.addressVisibilityPreference
                                }
                                onChange={(e) =>
                                    update(
                                        "addressVisibilityPreference",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="city_region_only">
                                    City + Region Only
                                </option>
                                <option value="service_area">
                                    Service Area
                                </option>
                                <option value="no_display">
                                    No Address
                                </option>
                            </select>

                            <label className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    checked={
                                        form.locationSensitivityFlag
                                    }
                                    onChange={(e) =>
                                        update(
                                            "locationSensitivityFlag",
                                            e.target.checked
                                        )
                                    }
                                />
                                Sensitive Location (privacy protected)
                            </label>

                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-sm text-yellow-800">
                                Street address is private by default.
                            </div>
                        </div>
                    )} */}

                </div>

                {/* NAVIGATION */}
                <div className="flex justify-between mt-10">
                    <button
                        onClick={back}
                        disabled={step === 0}
                        className="px-5 py-2 rounded-xl border disabled:opacity-40"
                    >
                        Back
                    </button>

                    <button
                        onClick={submit}
                        className="px-6 py-2 rounded-xl bg-[#2A1458] text-white hover:opacity-90"
                    >
                        {step === steps.length - 1
                            ? "Submit Application"
                            : "Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
    function MultiSelect({ label, options, value, onChange }) {
        const [open, setOpen] = useState(false);
        const [search, setSearch] = useState("");

        const toggleItem = (item) => {
            if (value.includes(item)) {
                onChange(value.filter((v) => v !== item));
            } else {
                onChange([...value, item]);
            }
        };

        const filtered = options.filter((o) =>
            o.toLowerCase().includes(search.toLowerCase())
        );

        return (
            <div className="w-full">
                <p className="font-medium mb-2">{label}</p>

                {/* INPUT BOX */}
                <div
                    className="border rounded-xl p-2 min-h-[44px] flex flex-wrap gap-2 cursor-pointer"
                    onClick={() => setOpen(!open)}
                >
                    {value.length === 0 && (
                        <span className="text-gray-400 text-sm">
                            Select {label}
                        </span>
                    )}

                    {value.map((item) => (
                        <span
                            key={item}
                            className="bg-[#2A1458] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleItem(item);
                            }}
                        >
                            {item} ✕
                        </span>
                    ))}
                </div>

                {/* DROPDOWN */}
                {open && (
                    <div className="border rounded-xl mt-2 bg-white shadow-lg max-h-60 overflow-auto">

                        {/* SEARCH */}
                        <input
                            className="w-full p-2 border-b outline-none text-sm"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* OPTIONS */}
                        {filtered.map((item) => {
                            const selected = value.includes(item);

                            return (
                                <div
                                    key={item}
                                    onClick={() => toggleItem(item)}
                                    className={`p-2 text-sm cursor-pointer hover:bg-gray-100 ${selected ? "bg-gray-100 font-medium" : ""
                                        }`}
                                >
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
}
