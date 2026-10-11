// resources/js/constants/fees.ts
// Shared by the registration and provider edit forms (session fee step).

export const CURRENCIES: { code: string; symbol: string; name: string }[] = [
    { code: 'USD', symbol: '$', name: 'US dollar' },
    { code: 'CAD', symbol: '$', name: 'Canadian dollar' },
    { code: 'GBP', symbol: '£', name: 'British pound' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'XCD', symbol: '$', name: 'Eastern Caribbean dollar' },
    { code: 'JMD', symbol: '$', name: 'Jamaican dollar' },
    { code: 'TTD', symbol: '$', name: 'Trinidad and Tobago dollar' },
    { code: 'BBD', symbol: '$', name: 'Barbadian dollar' },
    { code: 'BSD', symbol: '$', name: 'Bahamian dollar' },
    { code: 'BZD', symbol: '$', name: 'Belize dollar' },
    { code: 'BMD', symbol: '$', name: 'Bermudian dollar' },
    { code: 'KYD', symbol: '$', name: 'Cayman Islands dollar' },
    { code: 'GYD', symbol: '$', name: 'Guyanese dollar' },
    { code: 'SRD', symbol: '$', name: 'Surinamese dollar' },
    { code: 'DOP', symbol: '$', name: 'Dominican peso' },
    { code: 'CUP', symbol: '$', name: 'Cuban peso' },
    { code: 'HTG', symbol: 'G', name: 'Haitian gourde' },
    { code: 'ANG', symbol: 'ƒ', name: 'Netherlands Antillean guilder' },
    { code: 'AWG', symbol: 'ƒ', name: 'Aruban florin' },
    { code: 'CRC', symbol: '₡', name: 'Costa Rican colón' },
    { code: 'PAB', symbol: 'B/.', name: 'Panamanian balboa' },
];

export const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} — ${c.name}` }));

export const currencySymbol = (code: string): string =>
    CURRENCIES.find((c) => c.code === code)?.symbol ?? '$';

/* Payment methods that count as a reduced-cost option (matches ProviderService::PAYMENT_GROUPS). */
export const REDUCED_COST_METHODS = [
    'Sliding Scale',
    'No-Cost Services',
    'Pro Bono / Volunteer Services',
    'Donation-Based',
    'Government-Funded',
    'Grant-Funded',
];

export const hasReducedCost = (methods: string[] = []): boolean =>
    methods.some((m) => REDUCED_COST_METHODS.includes(m));

export type ReducedCostScope = '' | 'this_service' | 'other_offerings';

export const REDUCED_COST_SCOPES: { value: Exclude<ReducedCostScope, ''>; label: string }[] = [
    { value: 'this_service', label: 'Yes — it applies to the session fee shown' },
    { value: 'other_offerings', label: 'No — it applies to other services or programs' },
];

/* Preview text, e.g. "$100–$150 JMD / session". */
export function feePreview(min: string, max: string, code: string): string {
    const s = currencySymbol(code);
    if (min && max) return `${s}${min}–${s}${max} ${code} / session`;
    if (min) return `From ${s}${min} ${code} / session`;
    return '—';
}
