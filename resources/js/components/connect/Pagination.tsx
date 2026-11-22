import { Fragment } from 'react';

/* Numbered pagination from the reference blog (Previous · 1 … 4 5 6 … 9 · Next · "Page 5 of 9"). */
export default function Pagination({
    current,
    last,
    label,
    onPage,
}: {
    current: number;
    last: number;
    label: string;
    onPage: (page: number) => void;
}) {
    if (last <= 1) return null;
    const pages = Array.from({ length: last }, (_, i) => i + 1).filter((n) => n === 1 || n === last || Math.abs(n - current) <= 1);

    return (
        <nav className="blog-pagination" aria-label={label}>
            <button type="button" disabled={current === 1} onClick={() => onPage(current - 1)}>
                Previous
            </button>
            {pages.map((n, i) => (
                <Fragment key={n}>
                    {i > 0 && n - pages[i - 1] > 1 && <span aria-hidden="true">…</span>}
                    <button type="button" aria-label={'Page ' + n} aria-current={current === n ? 'page' : undefined} onClick={() => onPage(n)}>
                        {n}
                    </button>
                </Fragment>
            ))}
            <button type="button" disabled={current === last} onClick={() => onPage(current + 1)}>
                Next
            </button>
            <span className="small">
                Page {current} of {last}
            </span>
        </nav>
    );
}
