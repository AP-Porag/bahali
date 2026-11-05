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
        : 'border-[#1E4D4A]/65 focus:border-[#1E4D4A] focus:ring-[#1E4D4A]/25';

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

    const preview = national.length >= country.min ? formatPhoneDisplay(toE164(country, national), { international: true }) : '';

    return (
        <div>
            <div ref={rootRef} className="relative flex">
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-label={`Country code: ${country.name} +${country.dial}`}
                    className={`flex min-w-[7.5rem] flex-shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-l-[10px] border border-r-0 bg-[#FAFAF6] px-3.5 text-sm font-medium text-[#2C2C2C] outline-none transition hover:bg-[#1E4D4A]/5 focus:ring-4 ${errClass(error)} ${open ? 'border-[#1E4D4A]' : ''}`}
                >
                    <span className="text-sm font-semibold text-[#2C2C2C]">{country.iso}</span>
                    <span>+{country.dial}</span>
                    <svg
                        viewBox="0 0 24 24"
                        className={`h-3.5 w-3.5 text-[#2C2C2C] transition-transform ${open ? 'rotate-180' : ''}`}
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
                    className={`min-h-[48px] min-w-0 flex-1 rounded-r-[10px] border bg-white px-3.5 py-2.5 text-[#2C2C2C] placeholder-[#2C2C2C]/70 outline-none transition focus:ring-4 ${errClass(error)}`}
                />

                {open && (
                    <div className="absolute left-0 top-full z-30 mt-1.5 w-full max-w-md overflow-hidden sm:min-w-[18rem] rounded-lg border border-[#1E4D4A]/65 bg-white shadow-lg">
                        <div className="flex items-center gap-2 border-b border-[#E8D9B8] px-3">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 text-[#2C2C2C]/70" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
                            </svg>
                            <input
                                ref={searchRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search country or code…"
                                className="w-full bg-transparent py-2.5 text-sm text-[#2C2C2C] placeholder-[#2C2C2C]/70 outline-none"
                            />
                        </div>
                        <ul role="listbox" className="max-h-60 overflow-y-auto p-1">
                            {filtered.length === 0 && (
                                <li className="px-3 py-6 text-center text-sm text-[#2C2C2C]/70">No results found.</li>
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
                                            className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition ${active ? 'bg-[#1E4D4A]/10 text-[#1E4D4A]' : 'text-[#2C2C2C] hover:bg-[#1E4D4A]/5'}`}
                                        >
                                            <span className="w-7 flex-shrink-0 text-sm font-semibold text-[#2C2C2C]/70">{c.iso}</span>
                                            <span className="flex-1 truncate">{c.name}</span>
                                            <span className="flex-shrink-0 whitespace-nowrap text-right tabular-nums text-[#2C2C2C]">
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
                <p className="mt-1.5 text-sm text-[#2C2C2C]">
                    Shown on your profile as <span className="font-medium text-[#2C2C2C]">{preview}</span>
                </p>
            )}
        </div>
    );
}
