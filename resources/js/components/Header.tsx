import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    Menu,
    X,
    ChevronDown,
    ShoppingCart,
} from "lucide-react";

/* Brand tokens — swap with Bahali's real hex values */
const C = {
    headerBg: "#FFFFFF",
    ink: "#1C2B29",
    inkSoft: "#5B6B68",
    accent: "#E07A5C",
    accentDark: "#C9603F",
    line: "#E7E3DB",
};

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

const NAV: NavItem[] = [
    {
        label: "About",
        href: "/about",
        children: [
            { label: "Founder", href: "/marsha-smith-bahali-founder" },
            { label: "Advisory Board", href: "/advisory-board" },
        ],
    },
    {
        label: "Programs",
        href: "/caribbean-wellness-programs",
        children: [{ label: "Disaster Recovery", href: "/disaster-recovery" }],
    },
    {
        label: "Resources",
        href: "/resources",
        children: [
            { label: "Kidz Corner", href: "/kids-corner" },
            { label: "Bahali Resource Hub", href: "/bahali-resource-hub" },
        ],
    },
    { label: "Bahali Press", href: "/bahali-press" },
    { label: "Contact", href: "/contact" },
    { label: "Get Involved", href: "/get-involved" },
];

function Wordmark() {
    return (
        <span
            className="text-2xl font-semibold leading-none tracking-tight"
            style={{ color: C.ink }}
        >
            Bahali<span style={{ color: C.accent }}>.</span>
        </span>
    );
}

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openSub, setOpenSub] = useState<string | null>(null);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    return (
        <header
            className="sticky top-0 z-50 w-full border-b"
            style={{ backgroundColor: C.headerBg, borderColor: C.line }}
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" aria-label="Bahali home" className="shrink-0">
                    <Wordmark />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 lg:flex">
                    {NAV.map((item) => (
                        <div key={item.label} className="group relative">
                            <Link
                                href={item.href}
                                className="flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium transition-colors"
                                style={{ color: C.ink }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                                onMouseLeave={(e) => (e.currentTarget.style.color = C.ink)}
                            >
                                {item.label}
                                {item.children && (
                                    <ChevronDown
                                        size={15}
                                        className="mt-0.5 transition-transform group-hover:rotate-180"
                                    />
                                )}
                            </Link>

                            {item.children && (
                                <div
                                    className="invisible absolute left-0 top-full min-w-[220px] translate-y-1 rounded-xl border bg-white p-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
                                    style={{ borderColor: C.line }}
                                >
                                    {item.children.map((c) => (
                                        <Link
                                            key={c.label}
                                            href={c.href}
                                            className="block rounded-lg px-3 py-2 text-sm transition-colors"
                                            style={{ color: C.inkSoft }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = C.accent;
                                                e.currentTarget.style.backgroundColor = "#FBF6F3";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = C.inkSoft;
                                                e.currentTarget.style.backgroundColor = "transparent";
                                            }}
                                        >
                                            {c.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <Link
                        href="/donate"
                        className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.03] sm:inline-block"
                        style={{ backgroundColor: C.accent }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.accentDark)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.accent)}
                    >
                        Give Now
                    </Link>

                    <button
                        aria-label="Cart"
                        className="rounded-full p-2 transition-colors hover:bg-stone-100"
                        style={{ color: C.ink }}
                    >
                        <ShoppingCart size={20} />
                    </button>

                    <button
                        aria-label="Open menu"
                        onClick={() => setMobileOpen(true)}
                        className="rounded-full p-2 transition-colors hover:bg-stone-100 lg:hidden"
                        style={{ color: C.ink }}
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <div
                className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
                aria-hidden={!mobileOpen}
            >
                <div
                    onClick={() => setMobileOpen(false)}
                    className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"
                        }`}
                />
                <div
                    className={`absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div
                        className="flex h-20 items-center justify-between border-b px-5"
                        style={{ borderColor: C.line }}
                    >
                        <Wordmark />
                        <button
                            aria-label="Close menu"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-full p-2 hover:bg-stone-100"
                            style={{ color: C.ink }}
                        >
                            <X size={22} />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-3 py-4">
                        {NAV.map((item) => (
                            <div key={item.label} className="border-b last:border-0" style={{ borderColor: C.line }}>
                                {item.children ? (
                                    <>
                                        <button
                                            onClick={() => setOpenSub(openSub === item.label ? null : item.label)}
                                            className="flex w-full items-center justify-between px-2 py-3.5 text-left text-base font-medium"
                                            style={{ color: C.ink }}
                                        >
                                            {item.label}
                                            <ChevronDown
                                                size={18}
                                                className={`transition-transform ${openSub === item.label ? "rotate-180" : ""}`}
                                            />
                                        </button>
                                        <div
                                            className="overflow-hidden transition-all duration-200"
                                            style={{
                                                maxHeight:
                                                    openSub === item.label ? item.children.length * 48 + "px" : "0px",
                                            }}
                                        >
                                            {item.children.map((c) => (
                                                <Link
                                                    key={c.label}
                                                    href={c.href}
                                                    className="block py-2.5 pl-5 pr-2 text-sm"
                                                    style={{ color: C.inkSoft }}
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    {c.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="block px-2 py-3.5 text-base font-medium"
                                        style={{ color: C.ink }}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="border-t p-5" style={{ borderColor: C.line }}>
                        <Link
                            href="/donate"
                            className="block rounded-full py-3 text-center text-sm font-semibold text-white"
                            style={{ backgroundColor: C.accent }}
                            onClick={() => setMobileOpen(false)}
                        >
                            Give Now
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
