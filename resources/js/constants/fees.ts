// resources/js/constants/fees.ts
// Shared by the registration and provider edit forms (session fee step).

/*
 * Symbols are unambiguous on purpose (US$, JA$, TT$ …) so a fee never reads as a plain "$".
 * Keep in sync with ProviderService::CURRENCY_SYMBOLS.
 */
export const CURRENCIES: { code: string; symbol: string; name: string }[] = [
    { code: 'USD', symbol: 'US$', name: 'US dollar' },
    { code: 'CAD', symbol: 'CA$', name: 'Canadian dollar' },
    { code: 'GBP', symbol: '£', name: 'British pound' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'XCD', symbol: 'EC$', name: 'Eastern Caribbean dollar' },
    { code: 'JMD', symbol: 'JA$', name: 'Jamaican dollar' },
    { code: 'TTD', symbol: 'TT$', name: 'Trinidad and Tobago dollar' },
    { code: 'BBD', symbol: 'Bds$', name: 'Barbadian dollar' },
    { code: 'BSD', symbol: 'B$', name: 'Bahamian dollar' },
    { code: 'BZD', symbol: 'BZ$', name: 'Belize dollar' },
    { code: 'BMD', symbol: 'BD$', name: 'Bermudian dollar' },
    { code: 'KYD', symbol: 'CI$', name: 'Cayman Islands dollar' },
    { code: 'GYD', symbol: 'G$', name: 'Guyanese dollar' },
    { code: 'SRD', symbol: 'SR$', name: 'Surinamese dollar' },
    { code: 'DOP', symbol: 'RD$', name: 'Dominican peso' },
    { code: 'CUP', symbol: 'CUP ', name: 'Cuban peso' },
    { code: 'HTG', symbol: 'HTG ', name: 'Haitian gourde' },
    { code: 'XCG', symbol: 'Cg ', name: 'Caribbean guilder' },
    { code: 'ANG', symbol: 'NAƒ', name: 'Netherlands Antillean guilder' },
    { code: 'AWG', symbol: 'Afl. ', name: 'Aruban florin' },
    { code: 'CRC', symbol: '₡', name: 'Costa Rican colón' },
    { code: 'PAB', symbol: 'B/.', name: 'Panamanian balboa' },
];

export const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} — ${c.name}` }));

export const currencySymbol = (code: string): string =>
    CURRENCIES.find((c) => c.code === code)?.symbol ?? '$';

/*
 * Default currency for the provider's country — the fee currency is loaded from the
 * country selected on the Location step (the provider can still change it).
 */
export const COUNTRY_CURRENCY: Record<string, string> = {
    'United States': 'USD',
    'Puerto Rico': 'USD',
    'United States Virgin Islands': 'USD',
    'U.S. Virgin Islands': 'USD',
    'Spanish Virgin Islands': 'USD',
    'British Virgin Islands': 'USD',
    'Turks and Caicos Islands': 'USD',
    'Bonaire': 'USD',
    'Ecuador': 'USD',
    'El Salvador': 'USD',
    'Canada': 'CAD',
    'United Kingdom': 'GBP',
    'France': 'EUR',
    'Netherlands': 'EUR',
    'Spain': 'EUR',
    'Guadeloupe': 'EUR',
    'Martinique': 'EUR',
    'French Guiana': 'EUR',
    'Saint Barthélemy': 'EUR',
    'Saint Martin': 'EUR',
    'Anguilla': 'XCD',
    'Antigua and Barbuda': 'XCD',
    'Dominica': 'XCD',
    'Grenada': 'XCD',
    'Montserrat': 'XCD',
    'Saint Kitts and Nevis': 'XCD',
    'Saint Lucia': 'XCD',
    'Saint Vincent and the Grenadines': 'XCD',
    'Jamaica': 'JMD',
    'Trinidad and Tobago': 'TTD',
    'Barbados': 'BBD',
    'Bahamas': 'BSD',
    'The Bahamas': 'BSD',
    'Belize': 'BZD',
    'Bermuda': 'BMD',
    'Cayman Islands': 'KYD',
    'Guyana': 'GYD',
    'Suriname': 'SRD',
    'Dominican Republic': 'DOP',
    'Cuba': 'CUP',
    'Haiti': 'HTG',
    'Curaçao': 'XCG',
    'Sint Maarten': 'XCG',
    'Saint Martin / Sint Maarten': 'XCG',
    'Aruba': 'AWG',
    'Costa Rica': 'CRC',
    'Panama': 'PAB',
};

/* Returns the currency code for a country name, or null when we don't know it. */
export const currencyForCountry = (country: string | null | undefined): string | null =>
    (country && COUNTRY_CURRENCY[country.trim()]) || null;

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

/* Preview text, e.g. "JA$5,000–JA$8,000 / session" — identical to what the card and profile show. */
export function feePreview(min: string, max: string, code: string): string {
    const s = currencySymbol(code);
    if (min && max) return `${s}${min}–${s}${max} / session`;
    if (min) return `From ${s}${min} / session`;
    return '—';
}
