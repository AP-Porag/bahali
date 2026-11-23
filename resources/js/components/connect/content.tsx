import { Link } from '@inertiajs/react';
import { Fragment, type ReactNode } from 'react';

/**
 * Bahali Connect — CMS page text (Admin → CMS → Website Pages).
 * Every page receives `content`: field key → text, already merged with the default text on the server
 * (App\Services\Web\ConnectContentSchema), so the page looks exactly the same until an editor changes it.
 */
export type ConnectContent = Record<string, string>;

/** Reads one field; a missing key renders as an empty string instead of crashing the page. */
export const reader = (content?: ConnectContent | null) => (key: string) => content?.[key] ?? '';

/* Inline formatting allowed in CMS text:
 *   **bold**   *italic*   [link text](/address or https://… or mailto:…)   new line → line break
 * No HTML is ever inserted, so an editor cannot break the page or add scripts. */
const TOKEN = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function linkFor(label: ReactNode, href: string, key: string, className?: string) {
    if (href.startsWith('/') && !href.startsWith('//')) {
        return (
            <Link key={key} href={href} className={className}>
                {label}
            </Link>
        );
    }
    if (/^https?:\/\//i.test(href)) {
        return (
            <a key={key} href={href} target="_blank" rel="noreferrer" className={className}>
                {label}
            </a>
        );
    }
    if (/^(mailto:|tel:|#)/i.test(href)) {
        return (
            <a key={key} href={href} className={className}>
                {label}
            </a>
        );
    }

    return <Fragment key={key}>{label}</Fragment>; // unknown scheme → plain text
}

function inline(text: string, prefix: string, linkClass?: string): ReactNode[] {
    const out: ReactNode[] = [];
    let last = 0;
    let i = 0;
    for (const m of text.matchAll(new RegExp(TOKEN.source, 'g'))) {
        const at = m.index ?? 0;
        if (at > last) out.push(text.slice(last, at));
        const key = `${prefix}-${i++}`;
        if (m[1] !== undefined) out.push(<strong key={key}>{inline(m[1], key, linkClass)}</strong>);
        else if (m[2] !== undefined) out.push(<em key={key}>{inline(m[2], key, linkClass)}</em>);
        else out.push(linkFor(inline(m[3], key, linkClass), m[4], key, linkClass));
        last = at + m[0].length;
    }
    if (last < text.length) out.push(text.slice(last));

    return out;
}

/** Renders CMS text with **bold**, *italic*, [links](/url) and line breaks. */
export function Rich({ text, linkClass }: { text?: string | null; linkClass?: string }) {
    const lines = (text ?? '').replace(/\r\n?/g, '\n').split('\n');

    return (
        <>
            {lines.map((line, n) => (
                <Fragment key={n}>
                    {n > 0 && <br />}
                    {inline(line, String(n), linkClass)}
                </Fragment>
            ))}
        </>
    );
}

/** One field split on blank lines — used where an editor may add or remove paragraphs. */
export function paragraphs(text?: string | null): string[] {
    return (text ?? '')
        .replace(/\r\n?/g, '\n')
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
}

/** One field split into list items: one item per line (a leading "- " is optional). */
export function lines(text?: string | null): string[] {
    return (text ?? '')
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((l) => l.replace(/^\s*[-•]\s+/, '').trim())
        .filter(Boolean);
}

/** Fills placeholders such as {count} or {topic} in CMS text. */
export function fill(text: string, values: Record<string, string | number>): string {
    return text.replace(/\{(\w+)\}/g, (all, name: string) => (name in values ? String(values[name]) : all));
}

/* ------------------------------------------------------------------ */
/*  Policy pages — one "markdown" field holds every section            */
/* ------------------------------------------------------------------ */

export interface ContentSection {
    title: string;
    blocks: string[];
}

/**
 * "## Section title" starts a section; a blank line separates paragraphs;
 * a block whose lines all start with "- " becomes a bullet list.
 */
export function contentSections(markdown?: string | null): ContentSection[] {
    // Part 0 is any text before the first "## " heading — it is not shown.
    const [, ...parts] = (markdown ?? '').replace(/\r\n?/g, '\n').split(/^##[ \t]+/m);

    return parts
        .map((part) => {
            const [first, ...rest] = part.split('\n');
            return { title: first.trim(), blocks: paragraphs(rest.join('\n')) };
        })
        .filter((section) => section.title);
}

/** Renders the paragraphs and bullet lists of one section. */
export function ContentBlocks({ blocks }: { blocks: string[] }) {
    return (
        <>
            {blocks.map((block, n) => {
                const rows = block.split('\n');
                if (rows.every((row) => /^\s*[-•]\s+/.test(row))) {
                    return (
                        <ul key={n}>
                            {lines(block).map((item, i) => (
                                <li key={i}>
                                    <Rich text={item} />
                                </li>
                            ))}
                        </ul>
                    );
                }

                return (
                    <p key={n}>
                        <Rich text={block.replace(/\s*\n\s*/g, ' ')} />
                    </p>
                );
            })}
        </>
    );
}
