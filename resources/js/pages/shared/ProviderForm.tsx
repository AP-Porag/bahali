import React, { useMemo, useState } from "react";
import type { Country, ProfessionCategory, Credential, SupportArea } from "@/types/provider";

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
    support_areas: string[];

    streetAddress1: string;
    streetAddress2: string;
    postalCode: string;
    latitude: string;
    longitude: string;

    verification_address: string;
    billing_address: string;

    addressVisibilityPreference: string;
    locationSensitivityFlag: boolean;
};

type ProviderIntakeFormProps = {
    countries: Country[];
    professionCategories: ProfessionCategory[];
    credentials: Credential[];
    support_areas: SupportArea[];
};

const steps = [
    "Welcome",
    "Location",
    "Professional Role",
];

// Credentials and Areas of Support remain as seed data

const SUPPORTS = [
    "Anxiety", "Depression", "Trauma / PTSD", "Grief & Loss",
    "Substance Use", "Spiritual Care", "Community Healing",
    "Parenting Support", "Youth & Adolescent", "Relationship Issues",
    "Family Conflict", "Domestic Violence", "Disaster Recovery",
    "Racial Trauma", "Immigration Stress", "Life Transitions",
    "Chronic Illness", "Disability Support", "Elder Care",
    "Perinatal Mental Health", "Postpartum Support"
];

export default function ProviderIntakePremium({
    countries,
    professionCategories,
    credentials,
    support_areas
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
        support_areas: [],

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

    const selectedCountry = useMemo(() => {
        return countries.find((c) => String(c.id) === String(form.country));
    }, [form.country, countries]);

    const regionConfig = useMemo(() => {
        if (!selectedCountry || !selectedCountry.regions) return null;

        const grouped: Record<string, string[]> = {};

        selectedCountry.regions.forEach((region) => {
            const typeName = region.region_type?.name || "Region";

            if (!grouped[typeName]) {
                grouped[typeName] = [];
            }
            grouped[typeName].push(region.name);
        });

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
                                className={`h-1.5 flex-1 rounded-full transition ${i <= step ? "bg-[#2A1458]" : "bg-gray-200"
                                    }`}
                            />
                        ))}
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                        Step {step + 1} of {steps.length} —{" "}
                        <span className="font-medium">{steps[step]}</span>
                    </p>
                </div>

                {/* FORM */}
                <div className="space-y-6">
                    {/* STEP 1 - Welcome */}
                    {step === 0 && (
                        <div className="space-y-4">
                            <input
                                className={inputClass}
                                placeholder="Provider / Organization Name"
                                value={form.providerName}
                                onChange={(e) => update("providerName", e.target.value)}
                            />
                            <input
                                className={inputClass}
                                placeholder="Email Address"
                                value={form.email}
                                onChange={(e) => update("email", e.target.value)}
                            />
                            <input
                                className={inputClass}
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={(e) => update("phone", e.target.value)}
                            />
                        </div>
                    )}

                    {/* STEP 2 - Location */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div className="bg-gray-50 border rounded-xl p-4 space-y-4">
                                <label className="text-sm font-medium">Country *</label>
                                <select
                                    className={inputClass}
                                    value={form.country}
                                    onChange={(e) => {
                                        update("country", String(e.target.value));
                                        update("region", "");
                                        update("regionType", "");
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
                                                const selectedRegion = selectedCountry?.regions?.find(
                                                    (r) => r.name === e.target.value
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

                                <div>
                                    <label className="text-sm font-medium">
                                        City / Town / Community (Public)
                                    </label>
                                    <input
                                        className={inputClass}
                                        placeholder="e.g. Kingston, Montego Bay, Brooklyn"
                                        value={form.cityTown}
                                        onChange={(e) => update("cityTown", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">
                                        Service Area (Public)
                                    </label>
                                    <input
                                        className={inputClass}
                                        placeholder="e.g. St. James, Virtual Caribbean-wide"
                                        value={form.serviceArea}
                                        onChange={(e) => update("serviceArea", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">
                                        Service Format (Public)
                                    </label>
                                    <select
                                        className={inputClass}
                                        value={form.serviceFormat}
                                        onChange={(e) => update("serviceFormat", e.target.value)}
                                    >
                                        <option value="">Select Format</option>
                                        <option value="virtual">Virtual Only</option>
                                        <option value="in_person">In-Person</option>
                                        <option value="hybrid">Hybrid</option>
                                        <option value="mobile">Mobile / Community-Based</option>
                                    </select>
                                </div>
                            </div>

                            {/* Rest of location fields... */}
                            {form.serviceFormat !== "virtual" && (
                                <div className="bg-gray-50 border rounded-xl p-4 space-y-4">
                                    <p className="text-sm font-semibold text-gray-700">
                                        Private Address Information (Admin Only)
                                    </p>
                                    <input
                                        className={inputClass}
                                        placeholder="Street Address Line 1 (Private)"
                                        value={form.streetAddress1}
                                        onChange={(e) => update("streetAddress1", e.target.value)}
                                    />
                                    <input
                                        className={inputClass}
                                        placeholder="Street Address Line 2 (Private)"
                                        value={form.streetAddress2}
                                        onChange={(e) => update("streetAddress2", e.target.value)}
                                    />
                                    <input
                                        className={inputClass}
                                        placeholder="Postal Code (Private)"
                                        value={form.postalCode}
                                        onChange={(e) => update("postalCode", e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    className={inputClass}
                                    placeholder="Latitude (Admin/System)"
                                    value={form.latitude}
                                    onChange={(e) => update("latitude", e.target.value)}
                                />
                                <input
                                    className={inputClass}
                                    placeholder="Longitude (Admin/System)"
                                    value={form.longitude}
                                    onChange={(e) => update("longitude", e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Address Visibility Preference *
                                </label>
                                <select
                                    className={inputClass}
                                    value={form.addressVisibilityPreference}
                                    onChange={(e) =>
                                        update("addressVisibilityPreference", e.target.value)
                                    }
                                >
                                    <option value="no_display">Do not display address</option>
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

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.locationSensitivityFlag}
                                    onChange={(e) =>
                                        update("locationSensitivityFlag", e.target.checked)
                                    }
                                />
                                <span className="text-sm text-gray-700">
                                    Sensitive location (home office, trauma service,
                                    crisis support, virtual-only)
                                </span>
                            </label>

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

                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-xs text-yellow-800">
                                Admin-only fields (verification_address, billing_address)
                                are stored securely in backend and never shown in UI.
                            </div>
                        </div>
                    )}

                    {/* STEP 3 - Professional Role */}
                    {/* STEP 3 - Professional Role */}
                    {step === 2 && (
                        <div className="space-y-6">
                            {/* PROFESSIONS - GROUPED BY CATEGORY */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Provider Profession / Role *
                                </label>
                                <GroupedMultiSelect
                                    categories={professionCategories || []}
                                    value={form.professions}
                                    onChange={(val) => update("professions", val)}
                                />
                            </div>

                            {/* CREDENTIALS */}
                            <MultiSelect
                                label="Credentials / Licensure"
                                options={credentials?.map((c) => c.name) || []}
                                value={form.credentials}
                                onChange={(val) => update("credentials", val)}
                            />

                            {/* AREAS OF SUPPORT */}
                            <MultiSelect
                                label="Areas of Support"
                                options={support_areas?.map((s) => s.name) || []}
                                value={form.support_areas}
                                onChange={(val) => update("support_areas", val)}
                            />
                        </div>
                    )}
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
}

// Grouped Multi-Select Component for Professions
// Grouped Multi-Select Component for Professions
function GroupedMultiSelect({ categories, value, onChange }: {
    categories: ProfessionCategory[];
    value: string[];
    onChange: (val: string[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
                setSearch(""); // Reset search when closing
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const toggleItem = (item: string) => {
        if (value.includes(item)) {
            onChange(value.filter((v) => v !== item));
        } else {
            onChange([...value, item]);
        }
    };

    // Initialize all categories as expanded
    React.useEffect(() => {
        if (categories.length > 0) {
            const expanded: Record<number, boolean> = {};
            categories.forEach(cat => {
                expanded[cat.id] = true;
            });
            setExpandedCategories(expanded);
        }
    }, [categories]);

    const toggleCategory = (categoryId: number) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    // Count selected professions in a category
    const getSelectedCount = (category: ProfessionCategory) => {
        return category.professions.filter(prof => value.includes(prof.name)).length;
    };

    // Filter categories and professions based on search
    const filteredCategories = categories.map(category => ({
        ...category,
        professions: category.professions.filter(prof =>
            prof.name.toLowerCase().includes(search.toLowerCase())
        )
    })).filter(category => category.professions.length > 0);

    // Auto-expand categories with matching results when searching
    React.useEffect(() => {
        if (search && filteredCategories.length > 0) {
            const expanded: Record<number, boolean> = {};
            filteredCategories.forEach(cat => {
                expanded[cat.id] = true;
            });
            setExpandedCategories(prev => ({ ...prev, ...expanded }));
        }
    }, [search]);

    return (
        <div className="w-full" ref={dropdownRef}>
            {/* INPUT BOX */}
            <div
                className="border rounded-xl p-2 min-h-[44px] flex flex-wrap gap-2 cursor-pointer hover:border-[#2A1458] transition-colors"
                onClick={() => setOpen(!open)}
            >
                {value.length === 0 && (
                    <span className="text-gray-400 text-sm p-1">
                        Select your profession(s)...
                    </span>
                )}

                {value.map((item) => (
                    <span
                        key={item}
                        className="bg-[#2A1458] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 hover:bg-[#1C0F3A] transition-colors"
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
                <div className="border rounded-xl mt-2 bg-white shadow-lg max-h-96 overflow-auto">
                    {/* SEARCH HEADER */}
                    <div className="sticky top-0 bg-white p-3 border-b z-10">
                        <input
                            className="w-full p-2 border rounded-lg outline-none text-sm focus:border-[#2A1458] focus:ring-1 focus:ring-[#2A1458]"
                            placeholder="Search professions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            // Prevent click outside from closing when clicking on search input
                            onClick={(e) => e.stopPropagation()}
                        />
                        {value.length > 0 && (
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    {value.length} profession(s) selected
                                </span>
                                <button
                                    onClick={() => onChange([])}
                                    className="text-xs text-red-500 hover:text-red-700"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>

                    {/* GROUPED OPTIONS */}
                    <div className="p-2">
                        {filteredCategories.length === 0 ? (
                            <div className="text-center text-gray-500 py-4">
                                No professions found
                            </div>
                        ) : (
                            filteredCategories.map((category) => (
                                <div key={category.id} className="mb-2">
                                    {/* Category Header - BOLD */}
                                    <div
                                        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                                        onClick={() => toggleCategory(category.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="transform transition-transform text-xs">
                                                {expandedCategories[category.id] ? '▼' : '▶'}
                                            </span>
                                            <span className="font-bold text-sm text-gray-800">
                                                {category.label}
                                            </span>
                                        </div>
                                        {getSelectedCount(category) > 0 && (
                                            <span className="text-xs bg-[#2A1458] text-white px-2 py-0.5 rounded-full">
                                                {getSelectedCount(category)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Professions under category */}
                                    {expandedCategories[category.id] && (
                                        <div className="ml-4 border-l-2 border-gray-100 pl-2">
                                            {category.professions.map((profession) => {
                                                const selected = value.includes(profession.name);
                                                return (
                                                    <div
                                                        key={profession.id}
                                                        onClick={() => toggleItem(profession.name)}
                                                        className={`p-2 pl-4 text-sm cursor-pointer hover:bg-purple-50 rounded flex items-center justify-between transition-colors ${selected ? "bg-purple-50 font-medium text-[#2A1458]" : "text-gray-700"
                                                            }`}
                                                    >
                                                        <span>{profession.name}</span>
                                                        {selected && (
                                                            <span className="text-[#2A1458]">
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* FOOTER */}
                    {value.length > 0 && (
                        <div className="sticky bottom-0 bg-gray-50 border-t p-2 flex justify-end">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-1.5 bg-[#2A1458] text-white text-sm rounded-lg hover:bg-[#1C0F3A] transition-colors"
                            >
                                Done ({value.length})
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Standard Multi-Select Component
// Standard Multi-Select Component
function MultiSelect({ label, options, value, onChange }: {
    label: string;
    options: string[];
    value: string[];
    onChange: (val: string[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
                setSearch(""); // Reset search when closing
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const toggleItem = (item: string) => {
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
        <div className="w-full" ref={dropdownRef}>
            <p className="font-medium mb-2">{label}</p>

            <div
                className="border rounded-xl p-2 min-h-[44px] flex flex-wrap gap-2 cursor-pointer hover:border-[#2A1458] transition-colors"
                onClick={() => setOpen(!open)}
            >
                {value.length === 0 && (
                    <span className="text-gray-400 text-sm p-1">
                        Select {label}
                    </span>
                )}

                {value.map((item) => (
                    <span
                        key={item}
                        className="bg-[#2A1458] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 hover:bg-[#1C0F3A] transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleItem(item);
                        }}
                    >
                        {item} ✕
                    </span>
                ))}
            </div>

            {open && (
                <div className="border rounded-xl mt-2 bg-white shadow-lg max-h-60 overflow-auto">
                    <input
                        className="w-full p-2 border-b outline-none text-sm sticky top-0 bg-white"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />

                    {filtered.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                            No options found
                        </div>
                    ) : (
                        filtered.map((item) => {
                            const selected = value.includes(item);
                            return (
                                <div
                                    key={item}
                                    onClick={() => toggleItem(item)}
                                    className={`p-2 text-sm cursor-pointer hover:bg-purple-50 flex items-center justify-between transition-colors ${selected ? "bg-purple-50 font-medium text-[#2A1458]" : "text-gray-700"
                                        }`}
                                >
                                    <span>{item}</span>
                                    {selected && (
                                        <span className="text-[#2A1458]">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    )}

                    {value.length > 0 && (
                        <div className="sticky bottom-0 bg-gray-50 border-t p-2 flex justify-between">
                            <button
                                onClick={() => onChange([])}
                                className="text-xs text-red-500 hover:text-red-700 px-2"
                            >
                                Clear all
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-1.5 bg-[#2A1458] text-white text-sm rounded-lg hover:bg-[#1C0F3A] transition-colors"
                            >
                                Done ({value.length})
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

