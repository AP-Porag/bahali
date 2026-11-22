import type { ReactNode } from 'react';

/* Line icons from the Bahali Connect reference (src.jsx). */
const PATHS: Record<string, ReactNode> = {
    search: (
        <>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
        </>
    ),
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    pin: (
        <>
            <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
            <circle cx="12" cy="10" r="2" />
        </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    person: (
        <>
            <circle cx="12" cy="7" r="4" />
            <path d="M4 22v-3a8 8 0 0 1 16 0v3" />
        </>
    ),
    heart: <path d="M20 5c-3-3-7 0-8 2-1-2-5-5-8-2-5 5 1 10 8 15 7-5 13-10 8-15Z" />,
    message: <path d="M21 11a9 9 0 0 1-9 9H4l-2 2V11a9 9 0 0 1 19 0Z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    globe: (
        <>
            <circle cx="12" cy="12" r="9" />
            <ellipse cx="12" cy="12" rx="4" ry="9" />
            <path d="M3 12h18" />
        </>
    ),
    lock: (
        <>
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
    ),
};

export default function Icon({ name, size = 22 }: { name: string; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {PATHS[name] || PATHS.heart}
        </svg>
    );
}
