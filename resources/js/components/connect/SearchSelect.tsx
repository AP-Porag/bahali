import { Check, ChevronDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

/**
 * Bahali Connect dropdowns — one look everywhere on the public site (the Find support style),
 * built from shadcn Popover + Command so every list can be searched.
 *
 *   <SearchSelect value={country} onChange={setCountry} options={names} allLabel="All locations" />
 *   <SearchMultiSelect values={langs} onChange={setLangs} options={languages} />
 *
 * The wrapper has "bc-plain", so the reference stylesheet (connect.css) does not restyle it.
 */

export type SelectOption = string | { value: string; label: string };

const norm = (options: SelectOption[]) => options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

const trigger = (active: boolean, invalid?: boolean) =>
    'flex h-12 w-full items-center justify-between gap-2 rounded-[7px] border bg-white px-3.5 text-left text-[17px] font-normal leading-tight tracking-normal text-[#243638] outline-none transition focus:border-[#176B68] focus:ring-2 focus:ring-[#176B68]/20 focus-visible:border-[#176B68] focus-visible:ring-2 focus-visible:ring-[#176B68]/20 disabled:cursor-not-allowed disabled:bg-[#F3F5F4] disabled:opacity-70 ' +
    (invalid ? 'border-[#A94332]' : active ? 'border-[#176B68]' : 'border-[#176B68]/65');

const panel =
    "w-[var(--radix-popover-trigger-width)] min-w-[220px] overflow-hidden rounded-[10px] border border-[#176B68]/40 bg-white p-0 font-['Source_Sans_3',Arial,sans-serif] text-[#243638] shadow-[0_12px_32px_-12px_rgba(35,75,82,0.35)]";

const item =
    'flex min-h-[40px] cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-[17px] text-[#243638] data-[selected=true]:bg-[#E8F3F0] data-[selected=true]:text-[#176B68]';

function List({
    options,
    isSelected,
    onPick,
    searchPlaceholder,
    allLabel,
    onAll,
}: {
    options: { value: string; label: string }[];
    isSelected: (value: string) => boolean;
    onPick: (value: string) => void;
    searchPlaceholder: string;
    allLabel?: string;
    onAll?: () => void;
}) {
    return (
        <Command className="bg-white [&_[data-slot=command-input-wrapper]]:border-[#D6E1DD]" filter={(value, search) => (value.toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0)}>
            <CommandInput placeholder={searchPlaceholder} className="h-11 text-[17px] placeholder:text-[#526664]/70" />
            <CommandList className="max-h-[280px] p-1">
                <CommandEmpty className="px-3 py-6 text-center text-[17px] text-[#526664]">No matches found.</CommandEmpty>
                <CommandGroup>
                    {allLabel && onAll && (
                        <CommandItem value={'__all__ ' + allLabel} onSelect={onAll} className={item}>
                            <Check className={`h-4 w-4 text-[#176B68] ${isSelected('') ? 'opacity-100' : 'opacity-0'}`} aria-hidden />
                            <span className={isSelected('') ? 'font-semibold text-[#176B68]' : ''}>{allLabel}</span>
                        </CommandItem>
                    )}
                    {options.map((o) => {
                        const on = isSelected(o.value);
                        return (
                            <CommandItem key={o.value} value={o.label + ' ' + o.value} onSelect={() => onPick(o.value)} className={item}>
                                <Check className={`h-4 w-4 text-[#176B68] ${on ? 'opacity-100' : 'opacity-0'}`} aria-hidden />
                                <span className={on ? 'font-semibold text-[#176B68]' : ''}>{o.label}</span>
                            </CommandItem>
                        );
                    })}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}

/** Single choice. `allLabel` adds an "All …" first row that clears the value (''). */
export function SearchSelect({
    id,
    value,
    onChange,
    options,
    allLabel,
    placeholder = 'Select…',
    searchPlaceholder = 'Search…',
    icon,
    invalid,
    disabled,
    describedBy,
    ariaLabel,
    fallbackToFirst = false,
}: {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    allLabel?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    icon?: ReactNode;
    invalid?: boolean;
    disabled?: boolean;
    describedBy?: string;
    ariaLabel?: string;
    /** Show the first option when nothing is chosen (lists without an "All" row). */
    fallbackToFirst?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const list = norm(options);
    const selected = list.find((o) => o.value === value);
    const shown = selected?.label ?? (allLabel || (fallbackToFirst ? list[0]?.label : '') || placeholder);
    const isPlaceholder = !selected && !allLabel && !(fallbackToFirst && list[0]);

    const pick = (v: string) => {
        onChange(v);
        setOpen(false);
    };

    return (
        <div className="bc-plain w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        id={id}
                        type="button"
                        role="combobox"
                        aria-expanded={open}
                        aria-haspopup="listbox"
                        aria-label={ariaLabel}
                        aria-invalid={invalid || undefined}
                        aria-describedby={describedBy}
                        disabled={disabled}
                        className={trigger(!!value, invalid)}
                    >
                        <span className="flex min-w-0 items-center gap-2">
                            {icon && <span className="flex-shrink-0 text-[#176B68]">{icon}</span>}
                            <span className={`truncate ${isPlaceholder ? 'text-[#526664]' : ''}`}>{shown}</span>
                        </span>
                        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-[#176B68] transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
                    </button>
                </PopoverTrigger>
                <PopoverContent align="start" className={panel}>
                    <List
                        options={list}
                        isSelected={(v) => v === value}
                        onPick={pick}
                        searchPlaceholder={searchPlaceholder}
                        allLabel={allLabel}
                        onAll={allLabel ? () => pick('') : undefined}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

/** Several choices (checkmarks); the list stays open while choosing. */
export function SearchMultiSelect({
    id,
    values,
    onChange,
    options,
    placeholder = 'All',
    searchPlaceholder = 'Search…',
    ariaLabel,
}: {
    id?: string;
    values: string[];
    onChange: (values: string[]) => void;
    options: SelectOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    ariaLabel?: string;
}) {
    const [open, setOpen] = useState(false);
    const list = norm(options);
    const labelOf = (v: string) => list.find((o) => o.value === v)?.label ?? v;
    const summary = values.length === 0 ? placeholder : values.length === 1 ? labelOf(values[0]) : `${values.length} selected`;

    const toggle = (v: string) => onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);

    return (
        <div className="bc-plain w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        id={id}
                        type="button"
                        role="combobox"
                        aria-expanded={open}
                        aria-haspopup="listbox"
                        aria-label={ariaLabel}
                        className={trigger(values.length > 0)}
                    >
                        <span className="truncate">{summary}</span>
                        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-[#176B68] transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
                    </button>
                </PopoverTrigger>
                <PopoverContent align="start" className={panel}>
                    <List
                        options={list}
                        isSelected={(v) => values.includes(v)}
                        onPick={toggle}
                        searchPlaceholder={searchPlaceholder}
                        allLabel={values.length ? 'Clear selection' : undefined}
                        onAll={values.length ? () => onChange([]) : undefined}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
