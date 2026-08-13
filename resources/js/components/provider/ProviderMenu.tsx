import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function ProviderMenu() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { url } = usePage(); // বর্তমান URL পাওয়া যায়

    // পাথ অনুযায়ী active কিনা নির্ধারণ
    const isActive = (path: string) => {
        if (path === '/provider/dashboard') {
            return url === '/provider/dashboard';
        }
        // অন্য পাথগুলোর জন্য startsWith ব্যবহার করা যায়
        return url.startsWith(path);
    };

    // Active ও inactive style
    const activeClass = 'bg-[#0E7C7B]/10 text-[#0E7C7B] font-medium';
    const inactiveClass = 'text-[#16302F] hover:bg-[#0E7C7B]/5';

    return (
        <nav className="sticky top-0 z-40 border-b border-[#E7E0D2] bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/provider/dashboard" className="flex items-center gap-2">
                    <img
                        src="/images/logo.png"
                        alt="Bahali"
                        className="h-10 w-auto object-contain"
                    />
                </Link>

                {/* Desktop menu */}
                <div className="hidden items-center gap-1 md:flex">
                    <Link
                        href="/provider/dashboard"
                        className={`rounded-lg px-3 py-2 text-sm ${isActive('/provider/dashboard') ? activeClass : inactiveClass}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/provider/profile/edit"
                        className={`rounded-lg px-3 py-2 text-sm ${isActive('/provider/profile/edit') ? activeClass : inactiveClass}`}
                    >
                        Edit Profile
                    </Link>
                    {/* <Link
                        href="/directory"
                        className={`rounded-lg px-3 py-2 text-sm ${isActive('/directory') ? activeClass : inactiveClass}`}
                    >
                        Directory
                    </Link> */}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="ml-2 rounded-lg border border-[#DED7C9] px-3 py-2 text-sm font-medium text-[#16302F] hover:bg-[#F7F3EC]"
                    >
                        Logout
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="rounded-lg p-2 text-[#5B6B6E] hover:bg-[#0E7C7B]/5 focus:outline-none focus:ring-2 focus:ring-[#0E7C7B] md:hidden"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="border-t border-[#E7E0D2] bg-white px-4 pb-3 pt-2 md:hidden">
                    <div className="flex flex-col gap-1">
                        <Link
                            href="/provider/dashboard"
                            className={`rounded-lg px-3 py-2 text-sm ${isActive('/provider/dashboard') ? activeClass : inactiveClass}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/provider/profile/edit"
                            className={`rounded-lg px-3 py-2 text-sm ${isActive('/provider/profile/edit') ? activeClass : inactiveClass}`}
                        >
                            Edit Profile
                        </Link>
                        <Link
                            href="/directory"
                            className={`rounded-lg px-3 py-2 text-sm ${isActive('/directory') ? activeClass : inactiveClass}`}
                        >
                            Directory
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="rounded-lg px-3 py-2 text-left text-sm font-medium text-[#16302F] hover:bg-[#0E7C7B]/5"
                        >
                            Logout
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
