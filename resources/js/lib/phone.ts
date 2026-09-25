// resources/js/lib/phone.ts
// Phone rules for the countries seeded in CountrySeeder.
// Storage format: E.164 (e.g. +13054792993). Display is derived from it.

export interface PhoneCountry {
    key: string;          // unique key
    iso: string;          // short label shown in the picker
    name: string;         // label in the picker
    country?: string;     // matching name in the `countries` table (if different from `name`)
    dial: string;         // country calling code, digits only
    min: number;          // min national digits
    max: number;          // max national digits (input is capped here)
    areaCodes?: string[]; // NANP (+1) islands
    lead?: string[];      // leading digits to tell apart shared codes (+599)
    trunk?: string;       // national prefix people often type (e.g. 0)
    example: string;      // national digits, used for placeholder
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
    { key: 'AI', iso: 'AI', name: 'Anguilla', dial: '1', min: 10, max: 10, areaCodes: ['264'], example: '2644971234' },
    { key: 'AG', iso: 'AG', name: 'Antigua and Barbuda', dial: '1', min: 10, max: 10, areaCodes: ['268'], example: '2684601234' },
    { key: 'AW', iso: 'AW', name: 'Aruba', dial: '297', min: 7, max: 7, example: '5601234' },
    { key: 'BS', iso: 'BS', name: 'Bahamas', dial: '1', min: 10, max: 10, areaCodes: ['242'], example: '2423591234' },
    { key: 'BB', iso: 'BB', name: 'Barbados', dial: '1', min: 10, max: 10, areaCodes: ['246'], example: '2464101234' },
    { key: 'BZ', iso: 'BZ', name: 'Belize', dial: '501', min: 7, max: 7, example: '6221234' },
    { key: 'BM', iso: 'BM', name: 'Bermuda', dial: '1', min: 10, max: 10, areaCodes: ['441'], example: '4413701234' },
    { key: 'BQ-BO', iso: 'BQ', name: 'Bonaire', dial: '599', min: 7, max: 7, lead: ['7'], example: '7171234' },
    { key: 'VG', iso: 'VG', name: 'British Virgin Islands', dial: '1', min: 10, max: 10, areaCodes: ['284'], example: '2842291234' },
    { key: 'CA', iso: 'CA', name: 'Canada', dial: '1', min: 10, max: 10, example: '4165550123' },
    { key: 'KY', iso: 'KY', name: 'Cayman Islands', dial: '1', min: 10, max: 10, areaCodes: ['345'], example: '3453231234' },
    { key: 'CR', iso: 'CR', name: 'Costa Rica', dial: '506', min: 8, max: 8, example: '83123456' },
    { key: 'CU', iso: 'CU', name: 'Cuba', dial: '53', min: 6, max: 8, example: '51234567' },
    { key: 'CW', iso: 'CW', name: 'Curaçao', dial: '599', min: 8, max: 8, lead: ['9'], example: '95181234' },
    { key: 'DM', iso: 'DM', name: 'Dominica', dial: '1', min: 10, max: 10, areaCodes: ['767'], example: '7672251234' },
    { key: 'DO', iso: 'DO', name: 'Dominican Republic', dial: '1', min: 10, max: 10, areaCodes: ['809', '829', '849'], example: '8092345678' },
    { key: 'FR', iso: 'FR', name: 'France', dial: '33', min: 9, max: 9, trunk: '0', example: '612345678' },
    { key: 'GD', iso: 'GD', name: 'Grenada', dial: '1', min: 10, max: 10, areaCodes: ['473'], example: '4734031234' },
    { key: 'GP', iso: 'GP', name: 'Guadeloupe', dial: '590', min: 9, max: 9, trunk: '0', example: '690001234' },
    { key: 'GY', iso: 'GY', name: 'Guyana', dial: '592', min: 7, max: 7, example: '6091234' },
    { key: 'HT', iso: 'HT', name: 'Haiti', dial: '509', min: 8, max: 8, example: '34101234' },
    { key: 'JM', iso: 'JM', name: 'Jamaica', dial: '1', min: 10, max: 10, areaCodes: ['876', '658'], example: '8762101234' },
    { key: 'MQ', iso: 'MQ', name: 'Martinique', dial: '596', min: 9, max: 9, trunk: '0', example: '696201234' },
    { key: 'MS', iso: 'MS', name: 'Montserrat', dial: '1', min: 10, max: 10, areaCodes: ['664'], example: '6644921234' },
    { key: 'NL', iso: 'NL', name: 'Netherlands', dial: '31', min: 9, max: 9, trunk: '0', example: '612345678' },
    { key: 'PA', iso: 'PA', name: 'Panama', dial: '507', min: 7, max: 8, example: '61234567' },
    { key: 'PR', iso: 'PR', name: 'Puerto Rico', dial: '1', min: 10, max: 10, areaCodes: ['787', '939'], example: '7872345678' },
    { key: 'BQ-SA', iso: 'BQ', name: 'Saba', dial: '599', min: 7, max: 7, lead: ['4'], example: '4161234' },
    { key: 'BL', iso: 'BL', name: 'Saint Barthélemy', dial: '590', min: 9, max: 9, trunk: '0', example: '690001234' },
    { key: 'KN', iso: 'KN', name: 'Saint Kitts and Nevis', dial: '1', min: 10, max: 10, areaCodes: ['869'], example: '8697652917' },
    { key: 'LC', iso: 'LC', name: 'Saint Lucia', dial: '1', min: 10, max: 10, areaCodes: ['758'], example: '7582845678' },
    { key: 'MF', iso: 'MF', name: 'Saint Martin (French side)', dial: '590', min: 9, max: 9, trunk: '0', example: '690001234' },
    { key: 'VC', iso: 'VC', name: 'Saint Vincent and the Grenadines', dial: '1', min: 10, max: 10, areaCodes: ['784'], example: '7844301234' },
    { key: 'SX', iso: 'SX', name: 'Sint Maarten', country: 'Saint Martin / Sint Maarten', dial: '1', min: 10, max: 10, areaCodes: ['721'], example: '7215203456' },
    { key: 'BQ-SE', iso: 'BQ', name: 'Sint Eustatius', dial: '599', min: 7, max: 7, lead: ['3'], example: '3181234' },
    { key: 'ES', iso: 'ES', name: 'Spain', dial: '34', min: 9, max: 9, example: '612345678' },
    { key: 'SR', iso: 'SR', name: 'Suriname', dial: '597', min: 6, max: 7, example: '7412345' },
    { key: 'TT', iso: 'TT', name: 'Trinidad and Tobago', dial: '1', min: 10, max: 10, areaCodes: ['868'], example: '8682911234' },
    { key: 'TC', iso: 'TC', name: 'Turks and Caicos Islands', dial: '1', min: 10, max: 10, areaCodes: ['649'], example: '6492311234' },
    { key: 'GB', iso: 'GB', name: 'United Kingdom', dial: '44', min: 9, max: 10, trunk: '0', example: '7400123456' },
    { key: 'US', iso: 'US', name: 'United States', dial: '1', min: 10, max: 10, example: '3054792993' },
    { key: 'VI', iso: 'VI', name: 'United States Virgin Islands', dial: '1', min: 10, max: 10, areaCodes: ['340'], example: '3406421234' },
];

// +1 numbers shown WITHOUT country code: (305) 479-2993
const DOMESTIC_KEYS = new Set(['US', 'CA', 'PR', 'VI']);

// Longest calling codes first so +590 is tried before +5x etc.
const DIAL_CODES = Array.from(new Set(PHONE_COUNTRIES.map((c) => c.dial))).sort((a, b) => b.length - a.length);

export const onlyDigits = (s: string = '') => s.replace(/\D/g, '');

export function findPhoneCountry(key: string): PhoneCountry | undefined {
    return PHONE_COUNTRIES.find((c) => c.key === key);
}

/** Match a `countries.name` value (from the Location step) to phone rules. */
export function phoneCountryForName(name: string = ''): PhoneCountry | undefined {
    if (!name) return undefined;
    return PHONE_COUNTRIES.find((c) => c.country === name) ?? PHONE_COUNTRIES.find((c) => c.name === name);
}

function detectCountry(dial: string, national: string): PhoneCountry | undefined {
    const candidates = PHONE_COUNTRIES.filter((c) => c.dial === dial);
    if (candidates.length === 0) return undefined;
    if (dial === '1') {
        const area = national.slice(0, 3);
        return candidates.find((c) => c.areaCodes?.includes(area)) ?? findPhoneCountry('US');
    }
    return candidates.find((c) => c.lead?.some((l) => national.startsWith(l))) ?? candidates[0];
}

/**
 * Parse any stored/typed number.
 * Handles E.164 (+13054792993), "+1 305-479-2993", "00..." and legacy 10-digit US numbers.
 * Returns null when the number can't be understood (e.g. old test data).
 */
export function parsePhone(raw?: string | null): { country: PhoneCountry; national: string } | null {
    const trimmed = (raw ?? '').trim();
    if (!trimmed) return null;
    let digits = onlyDigits(trimmed);
    if (!digits) return null;

    if (trimmed.startsWith('+') || trimmed.startsWith('00')) {
        if (!trimmed.startsWith('+')) digits = digits.slice(2);
        for (const dial of DIAL_CODES) {
            if (digits.startsWith(dial)) {
                const national = digits.slice(dial.length);
                const country = detectCountry(dial, national);
                if (country) return { country, national };
            }
        }
        return null;
    }

    // Legacy numbers saved without a country code: treat 10/11-digit as NANP.
    if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
    if (digits.length === 10 && /^[2-9]/.test(digits)) {
        const country = detectCountry('1', digits);
        if (country) return { country, national: digits };
    }
    return null;
}

export function toE164(country: PhoneCountry, national: string): string {
    return national ? `+${country.dial}${national}` : '';
}

function group(d: string, sizes: number[]): string {
    const out: string[] = [];
    let i = 0;
    for (const s of sizes) {
        if (i >= d.length) break;
        out.push(d.slice(i, i + s));
        i += s;
    }
    if (i < d.length) out.push(d.slice(i));
    return out.join(' ');
}

function groupSizes(c: PhoneCountry, d: string): number[] {
    switch (c.key) {
        case 'CW':
        case 'CU':
            return [1, 3, 4];
        case 'HT':
            return [2, 2, 4];
        case 'GP':
        case 'MQ':
        case 'BL':
        case 'MF':
            return [3, 2, 2, 2];
        case 'FR':
            return [1, 2, 2, 2, 2];
        case 'NL':
            return d.startsWith('6') ? [1, 4, 4] : [2, 3, 4];
        case 'ES':
            return [3, 3, 3];
        case 'CR':
            return [4, 4];
        case 'PA':
            return d.length > 7 ? [4, 4] : [3, 4];
        case 'SR':
            return d.length > 6 ? [3, 4] : [3, 3];
        case 'GB':
            if (d.startsWith('7')) return [4, 6];
            if (d.startsWith('2')) return [2, 4, 4];
            if (/^1\d1/.test(d) || d.startsWith('11')) return [3, 3, 4];
            if (d.startsWith('1')) return [4, 6];
            return [3, 3, 4];
        default:
            return [3, 4];
    }
}

/** National part only, safe for partial input while typing. */
export function formatNational(c: PhoneCountry, d: string): string {
    if (!d) return '';
    if (c.dial === '1') {
        if (d.length < 4) return d;
        if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
        return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    }
    return group(d, groupSizes(c, d));
}

/**
 * Public display.
 *  US/Canada/PR/USVI → (305) 479-2993
 *  Other +1 islands  → +1 (876) 555-1234
 *  Everyone else     → +33 6 12 34 56 78
 * Unparseable legacy values are returned as-is.
 */
export function formatPhoneDisplay(raw?: string | null): string {
    const p = parsePhone(raw);
    if (!p) return (raw ?? '').trim();
    const national = formatNational(p.country, p.national);
    return DOMESTIC_KEYS.has(p.country.key) ? national : `+${p.country.dial} ${national}`;
}

/** Full underlying number for the Call button. */
export function phoneHref(raw?: string | null): string {
    const p = parsePhone(raw);
    if (p) return `tel:${toE164(p.country, p.national)}`;
    const trimmed = (raw ?? '').trim();
    return `tel:${trimmed.startsWith('+') ? '+' : ''}${onlyDigits(trimmed)}`;
}

/** Returns an error message, or null when valid. */
export function phoneError(raw?: string | null): string | null {
    const p = parsePhone(raw);
    if (!p) return 'Please enter a valid phone number.';
    const { country: c, national: n } = p;
    if (n.length < c.min || n.length > c.max) {
        return c.min === c.max
            ? `Please enter a ${c.min}-digit phone number.`
            : `Please enter a ${c.min}–${c.max} digit phone number.`;
    }
    if (c.dial === '1' && !/^[2-9]\d{2}[2-9]/.test(n)) {
        return 'Please enter a valid area code and phone number.';
    }
    return null;
}
