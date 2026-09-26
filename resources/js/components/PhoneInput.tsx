// resources/js/components/PhoneInput.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    PHONE_COUNTRIES,
    PhoneCountry,
    findPhoneCountry,
    formatNational,
    formatPhoneDisplay,
    onlyDigits,
    parsePhone,
    phoneCountryForName,
    toE164,
} from '@/lib/phone';

const errClass = (hasError: boolean) =>
    hasError
        ? 'border-[#C2543B] focus:border-[#C2543B] focus:ring-[#C2543B]/30'
        : 'border-[#DED7C9] focus:border-[#0E7C7B] focus:ring-[#0E7C7B]/25';

interface PhoneInputProps {
    value: string;                 // E.164, e.g. +13054792993
    onChange: (v: string) => void; // emits E.164 ('' when empty)
    defaultCountry?: string;       // countries.name from the Location step
    error?: boolean;
}

export default function PhoneInput({ value, onChange, defaultCountry = '', error = false }: PhoneInputProps) {
    const fallback = findPhoneCountry('US') as PhoneCountry;

    const [country, setCountry] = useState<PhoneCountry>(() => {
        const parsed = parsePhone(value);
        return parsed?.country ?? phoneCountryForName(defaultCountry) ?? fallback;
    });
    const [national, setNational] = useState<string>(() => {
        const parsed = parsePhone(value);
        return parsed ? parsed.national.slice(0, parsed.country.max) : '';
    });

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const rootRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Follow the Location step's country until the provider starts typing.
    useEffect(() => {
        if (national) return;
        const c = phoneCountryForName(defaultCountry);
        if (c) setCountry(c);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultCountry]);

    useEffect(() => {
        if (!open) {
            setQuery('');
            return;
        }
        requestAnimationFrame(() => searchRef.current?.focus());
        const onClick = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const emit = (c: PhoneCountry, n: string) => onChange(n ? toE164(c, n) : '');

    const handleInput = (raw: string) => {
        const t = raw.trim();

        // Pasted a full international number → switch country automatically.
        if (t.startsWith('+') || t.startsWith('00')) {
            const parsed = parsePhone(t);
            if (parsed) {
                const n = parsed.national.slice(0, parsed.country.max);
                setCountry(parsed.country);
                setNational(n);
                emit(parsed.country, n);
                return;
            }
        }

        let d = onlyDigits(raw);
        if (country.dial === '1') d = d.replace(/^1+/, '');               // NANP: drop leading 1
        if (country.trunk) d = d.replace(new RegExp(`^${country.trunk}+`), ''); // drop leading 0
        d = d.slice(0, country.max);                                        // hard cap per country

        setNational(d);
        emit(country, d);
    };

    const selectCountry = (c: PhoneCountry) => {
        const n = national.slice(0, c.max);
        setCountry(c);
        setNational(n);
        emit(c, n);
        setOpen(false);
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return PHONE_COUNTRIES;
        const qd = onlyDigits(q);
        return PHONE_COUNTRIES.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                (qd && (c.dial.startsWith(qd) || c.areaCodes?.some((a) => a.startsWith(qd) || `${c.dial}${a}`.startsWith(qd))))
        );
    }, [query]);

    const preview = national.length >= country.min ? formatPhoneDisplay(toE164(country, national)) : '';

    return (
        <div>
            <div ref={rootRef} className="relative flex">
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-label={`Country code: ${country.name} +${country.dial}`}
                    className={`flex flex-shrink-0 items-center gap-1.5 rounded-l-lg border border-r-0 bg-[#FBF8F2] px-3 text-sm font-medium text-[#26403F] outline-none transition hover:bg-[#0E7C7B]/5 focus:ring-4 ${errClass(error)} ${open ? 'border-[#0E7C7B]' : ''}`}
                >
                    <span className="text-xs font-semibold text-[#6B7A78]">{country.iso}</span>
                    <span>+{country.dial}</span>
                    <svg
                        viewBox="0 0 24 24"
                        className={`h-3.5 w-3.5 text-[#6B7A78] transition-transform ${open ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" strokeWidth={2} aria-hidden
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                </button>

                <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    value={formatNational(country, national)}
                    onChange={(e) => handleInput(e.target.value)}
                    placeholder={formatNational(country, country.example)}
                    className={`min-w-0 flex-1 rounded-r-lg border bg-white px-3.5 py-2.5 text-[#1F2A2E] placeholder-[#9AA6A4] outline-none transition focus:ring-4 ${errClass(error)}`}
                />

                {open && (
                    <div className="absolute left-0 top-full z-30 mt-1.5 w-full max-w-sm overflow-hidden rounded-lg border border-[#DED7C9] bg-white shadow-lg">
                        <div className="flex items-center gap-2 border-b border-[#EFEAE0] px-3">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 text-[#9AA6A4]" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
                            </svg>
                            <input
                                ref={searchRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search country or code…"
                                className="w-full bg-transparent py-2.5 text-sm text-[#1F2A2E] placeholder-[#9AA6A4] outline-none"
                            />
                        </div>
                        <ul role="listbox" className="max-h-60 overflow-y-auto p-1">
                            {filtered.length === 0 && (
                                <li className="px-3 py-6 text-center text-sm text-[#9AA6A4]">No results found.</li>
                            )}
                            {filtered.map((c) => {
                                const active = c.key === country.key;
                                return (
                                    <li key={c.key}>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={active}
                                            onClick={() => selectCountry(c)}
                                            className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition ${active ? 'bg-[#0E7C7B]/10 text-[#15403F]' : 'text-[#3A4B49] hover:bg-[#0E7C7B]/5'}`}
                                        >
                                            <span className="w-7 flex-shrink-0 text-xs font-semibold text-[#9AA6A4]">{c.iso}</span>
                                            <span className="flex-1 truncate">{c.name}</span>
                                            <span className="flex-shrink-0 text-[#6B7A78]">
                                                +{c.dial}{c.areaCodes ? ` ${c.areaCodes[0]}` : ''}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>

            {preview && (
                <p className="mt-1.5 text-xs text-[#6B7A78]">
                    Shown on your profile as <span className="font-medium text-[#26403F]">{preview}</span>
                </p>
            )}
        </div>
    );
}
