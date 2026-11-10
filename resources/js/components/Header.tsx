import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePage } from '@inertiajs/react';

interface User {
    role?: 'admin' | 'provider';
}

interface PageProps {
    auth?: {
        user?: User | null;
    };
}

interface HeaderProps {
    app_url?: string;
    loginUrl?: string;
}

export default function Header({ app_url = '', loginUrl = '/login' }: HeaderProps) {
    const { auth } = usePage<PageProps>().props;

    const user = auth?.user ?? null;

    const [open, setOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const toggleMenu = (menu: string) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const directoryUrl = `${app_url.replace(/\/$/, '')}/provider`;

    const dashboardUrl =
        user?.role === 'admin'
            ? '/admin/dashboard'
            : '/provider/dashboard';

    const dropdownMenus = {
        About: ['Founder', 'Advisory Board'],
        Programs: ['Disaster Recovery'],
        Resources: ['Kidz Corner', 'Bahali Resources Hub'],
    };

    const navItems = ['About', 'Programs', 'Resources', 'Bahali Press', 'Contact', 'Get Involved'];

    return (
        <header className="w-full border-b border-[#E8D9B8] bg-[#FAFAF6] font-body">
            <div className="mx-auto flex max-w-[1600px] justify-between px-3 min-[982px]:flex min-[982px]:justify-center min-[982px]:px-8 min-[982px]:pt-3 lg:flex lg:justify-between lg:px-6 lg:py-1">
                {/* Logo */}
                <div className="mb-2 min-[982px]:flex min-[982px]:items-start lg:flex lg:items-center">
                    <div className="mt-1 w-[230px] overflow-hidden rounded-md">
                        <a href="https://bahali.org/" target="_blank">
                            <img src="/images/logo.png" alt="Logo" className="w-[160px] object-contain" />
                        </a>
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="mb-2 flex gap-8">
                    <nav className="hidden flex-wrap items-center gap-7 min-[982px]:flex">
                        {/* About */}
                        {/* <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('About')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="font-body flex items-center gap-2 text-[16px] font-medium text-[#1E4D4A] hover:text-[#163F3C] hover:underline hover:underline-offset-4">
                                <a href="https://bahali.org/about/" target="_blank">
                                    About
                                </a>

                                {activeDropdown === 'About' ? (
                                    <X size={18} className="min-[982px]:block lg:hidden" />
                                ) : (
                                    <svg
                                        className="h-5 w-5 min-[982px]:block lg:hidden"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>

                            <div
                                className={`absolute top-full -left-6 z-50 origin-top transition-transform duration-300 ease-in-out ${activeDropdown === 'About' ? 'scale-y-100' : 'scale-y-0'
                                    }`}
                            >
                                <div className="mt-2 w-[210px] rounded-xl border border-[#E8D9B8] bg-white pb-2 shadow-xl">
                                    <a
                                        href="https://bahali.org/marsha-smith-bahali-founder/"
                                        target="_blank"
                                        className="font-body block px-7 py-2.5 text-[16px] font-semibold text-[#2C2C2C] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                                    >
                                        Founder
                                    </a>

                                    <a
                                        href="https://bahali.org/advisory-board/"
                                        target="_blank"
                                        className="font-body block px-7 py-2.5 text-[16px] font-semibold text-[#2C2C2C] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                                    >
                                        Advisory Board
                                    </a>
                                </div>
                            </div>
                        </div> */}

                        {/* Programs */}
                        {/* <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('Programs')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="font-body flex items-center gap-2 text-[16px] font-medium text-[#1E4D4A] hover:text-[#163F3C] hover:underline hover:underline-offset-4">
                                <a href="https://bahali.org/caribbean-wellness-programs/" target="_blank">
                                    Programs
                                </a>

                                {activeDropdown === 'Programs' ? (
                                    <X size={18} className="min-[982px]:block lg:hidden" />
                                ) : (
                                    <svg
                                        className="h-5 w-5 min-[982px]:block lg:hidden"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>

                            <div
                                className={`absolute top-full -left-6 z-50 origin-top transition-all duration-300 ease-in-out ${activeDropdown === 'Programs'
                                    ? 'scale-y-100 opacity-100'
                                    : 'pointer-events-none scale-y-0 opacity-0'
                                    }`}
                            >
                                <div className="mt-2 w-[210px] rounded-xl border border-[#E8D9B8] bg-white pb-2 shadow-xl">
                                    <a
                                        href="https://bahali.org/disaster-recovery/"
                                        target="_blank"
                                        className="font-body block px-7 py-2.5 text-[16px] font-semibold text-[#2C2C2C] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                                    >
                                        Disaster Recovery
                                    </a>
                                </div>
                            </div>
                        </div> */}

                        {/* Resources */}
                        {/* <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('Resources')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="font-body flex items-center gap-2 text-[16px] font-medium text-[#1E4D4A] hover:text-[#163F3C] hover:underline hover:underline-offset-4">
                                <a href="https://bahali.org/resources/" target="_blank">
                                    Resources
                                </a>

                                {activeDropdown === 'Resources' ? (
                                    <X size={18} className="min-[982px]:block lg:hidden" />
                                ) : (
                                    <svg
                                        className="h-5 w-5 min-[982px]:block lg:hidden"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>

                            <div
                                className={`absolute top-full -left-6 z-50 origin-top transition-all duration-300 ease-in-out ${activeDropdown === 'Resources'
                                    ? 'scale-y-100 opacity-100'
                                    : 'pointer-events-none scale-y-0 opacity-0'
                                    }`}
                            >
                                <div className="mt-2 w-[210px] rounded-xl border border-[#E8D9B8] bg-white pb-2 shadow-xl">
                                    <a
                                        href="https://bahali.org/kids-corner/"
                                        target="_blank"
                                        className="font-body block px-7 py-2.5 text-[16px] font-semibold text-[#2C2C2C] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                                    >
                                        Kidz Corner
                                    </a>

                                    <a
                                        href="https://bahali.org/bahali-resource-hub/"
                                        target="_blank"
                                        className="font-body block px-7 py-2.5 text-[16px] font-semibold text-[#2C2C2C] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                                    >
                                        Bahali Resources Hub
                                    </a>
                                </div>
                            </div>
                        </div> */}

                        {/* Bahali Press */}
                        {/* <a
                            href="https://bahali.org/bahali-press/#coping"
                            target="_blank"
                            className="font-body text-[16px] font-medium text-[#1E4D4A] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                        >
                            Bahali Press
                        </a> */}

                        {/* Contact */}
                        {/* <a
                            href="https://bahali.org/contact/"
                            target="_blank"
                            className="font-body text-[16px] font-medium text-[#1E4D4A] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                        >
                            Contact
                        </a> */}

                        {/* Get Involved */}
                        {/* <a
                            href="https://bahali.org/get-involved/"
                            target="_blank"
                            className="font-body text-[16px] font-medium text-[#1E4D4A] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                        >
                            Get Involved
                        </a> */}

                        {/* Provider Directory Link */}
                        {/* <a
                            href={directoryUrl}
                            className="font-body text-[16px] font-medium text-[#1E4D4A] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                        >
                            Providers
                        </a> */}
                        {/* Login / Dashboard (Desktop) */}
                        <div className="hidden min-[982px]:block">
                            {user ? (
                                <a
                                    href={dashboardUrl}
                                    className="font-body inline-flex min-h-[48px] cursor-pointer items-center rounded-[10px] bg-[#1E4D4A] px-7 text-[15px] font-semibold text-white transition hover:bg-[#163F3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D4A]/40 focus-visible:ring-offset-2"
                                >
                                    Dashboard
                                </a>
                            ) : (
                                <a
                                    href={loginUrl}
                                    className="font-body inline-flex min-h-[48px] cursor-pointer items-center rounded-[10px] bg-[#1E4D4A] px-7 text-[15px] font-semibold text-white transition hover:bg-[#163F3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D4A]/40 focus-visible:ring-offset-2"
                                >
                                    Login
                                </a>
                            )}
                        </div>

                        {/* <div className="hidden min-[982px]:block">
                            <a href="https://bahali.org/donate/" target="_blank">
                                <button className="font-body inline-flex min-h-[48px] cursor-pointer items-center rounded-[10px] bg-[#1E4D4A] px-7 text-[15px] font-semibold text-white transition hover:bg-[#163F3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D4A]/40 focus-visible:ring-offset-2">
                                    Give Now
                                </button>
                            </a>
                        </div> */}


                    </nav>
                </div>

                {/* Mobile Right */}
                <div className="flex items-center gap-4 min-[982px]:hidden">
                    <button onClick={() => setOpen(!open)}>
                        {open ? (
                            <X size={34} className="text-[#1E4D4A]" />
                        ) : (
                            <Menu size={34} className="text-[#1E4D4A]" />
                        )}
                    </button>
                </div>
            </div>

            {/* mobile nav */}
            <div className="min-[982px]:hidden">
                {/* Overlay */}
                <div
                    onClick={() => setOpen(false)}
                    className={`fixed inset-0 z-40 transition-all duration-500 ${open
                        ? 'bg-[#9CAEA9]/70 opacity-100 backdrop-blur-md'
                        : 'invisible opacity-0'
                        }`}
                >
                    <div className="h-[90px] w-full bg-[#FAFAF6]"></div>
                </div>

                {/* Drawer */}
                <aside
                    className={`fixed top-0 right-0 z-50 h-full w-[300px] bg-white text-[#2C2C2C] shadow-[-20px_0_60px_rgba(0,0,0,0.14)] transition-transform duration-500 ease-out ${open ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="h-full overflow-y-auto px-8 pb-20">
                        {/* Close */}
                        <div className="-mr-2 mb-[60px] flex justify-end">
                            <button onClick={() => setOpen(false)} className="pt-[16px]">
                                <X size={26} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* <div>
                            <button
                                onClick={() => toggleMenu('About')}
                                className="flex w-full items-center justify-between border-gray-100 pb-6 text-left text-[16px] hover:border hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                            >
                                <a href="https://bahali.org/about/" target="_blank">
                                    About
                                </a>

                                <div
                                    className={`relative mr-2 flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300 ${activeMenu === 'About'
                                        ? 'bg-gray-100'
                                        : 'bg-transparent'
                                        }`}
                                >
                                    <svg
                                        className={`absolute h-4 w-4 transition-all duration-300 ${activeMenu === 'About'
                                            ? 'rotate-90 opacity-0'
                                            : 'rotate-0 opacity-100'
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 9l6 6 6-6"
                                        />
                                    </svg>

                                    <X
                                        size={18}
                                        className={`absolute text-[#1E4D4A] transition-all duration-300 ${activeMenu === 'About'
                                            ? 'rotate-0 opacity-100'
                                            : '-rotate-90 opacity-0'
                                            }`}
                                    />
                                </div>
                            </button>

                            <div
                                className={`-mt-2 overflow-hidden transition-all duration-300 ${activeMenu === 'About'
                                    ? 'max-h-96'
                                    : 'max-h-0'
                                    }`}
                            >
                                <a
                                    href="https://bahali.org/marsha-smith-bahali-founder/"
                                    target="_blank"
                                    className="block pb-3 pl-5 text-[15px]"
                                >
                                    Founder
                                </a>

                                <a
                                    href="https://bahali.org/advisory-board/"
                                    target="_blank"
                                    className="block pb-4 pl-5 text-[15px]"
                                >
                                    Advisory Board
                                </a>
                            </div>
                        </div> */}

                        {/* Programs */}
                        {/* <div>
                            <button
                                onClick={() => toggleMenu('Programs')}
                                className="flex w-full items-center justify-between pb-6 text-left text-[16px] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                            >
                                <a
                                    href="https://bahali.org/caribbean-wellness-programs/#Programs"
                                    target="_blank"
                                >
                                    Programs
                                </a>

                                <div
                                    className={`relative mr-2 flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300 ${activeMenu === 'Programs'
                                        ? 'bg-gray-100'
                                        : 'bg-transparent'
                                        }`}
                                >
                                    <svg
                                        className={`absolute h-4 w-4 transition-all duration-300 ${activeMenu === 'Programs'
                                            ? 'rotate-90 opacity-0'
                                            : 'rotate-0 opacity-100'
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 9l6 6 6-6"
                                        />
                                    </svg>

                                    <X
                                        size={20}
                                        className={`absolute text-[#1E4D4A] transition-all duration-300 ${activeMenu === 'Programs'
                                            ? 'rotate-0 opacity-100'
                                            : '-rotate-90 opacity-0'
                                            }`}
                                    />
                                </div>
                            </button>

                            <div
                                className={`-mt-2 overflow-hidden transition-all duration-300 ${activeMenu === 'Programs'
                                    ? 'max-h-96'
                                    : 'max-h-0'
                                    }`}
                            >
                                <a
                                    href="https://bahali.org/disaster-recovery/"
                                    target="_blank"
                                    className="block pb-4 pl-5 text-[15px]"
                                >
                                    Disaster Recovery
                                </a>
                            </div>
                        </div> */}

                        {/* Resources */}
                        {/* <div>
                            <button
                                onClick={() => toggleMenu('Resources')}
                                className="flex w-full items-center justify-between pb-6 text-left text-[16px] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                            >
                                <a
                                    href="https://bahali.org/resources/"
                                    target="_blank"
                                >
                                    Resources
                                </a>

                                <div
                                    className={`relative mr-2 flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300 ${activeMenu === 'Resources'
                                        ? 'bg-gray-100'
                                        : 'bg-transparent'
                                        }`}
                                >
                                    <svg
                                        className={`absolute h-4 w-4 transition-all duration-300 ${activeMenu === 'Resources'
                                            ? 'rotate-90 opacity-0'
                                            : 'rotate-0 opacity-100'
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 9l6 6 6-6"
                                        />
                                    </svg>

                                    <X
                                        size={20}
                                        className={`absolute text-[#1E4D4A] transition-all duration-300 ${activeMenu === 'Resources'
                                            ? 'rotate-0 opacity-100'
                                            : '-rotate-90 opacity-0'
                                            }`}
                                    />
                                </div>
                            </button>

                            <div
                                className={`-mt-2 overflow-hidden transition-all duration-300 ${activeMenu === 'Resources'
                                    ? 'max-h-96'
                                    : 'max-h-0'
                                    }`}
                            >
                                <a
                                    href="https://bahali.org/kids-corner/"
                                    target="_blank"
                                    className="block pb-3 pl-5 text-[15px]"
                                >
                                    Kidz Corner
                                </a>

                                <a
                                    href="https://bahali.org/bahali-resource-hub/"
                                    target="_blank"
                                    className="block pb-4 pl-5 text-[15px]"
                                >
                                    Bahali Resources Hub
                                </a>
                            </div>
                        </div> */}

                        {/* Bahali Press */}
                        {/* <div>
                            <a
                                href="https://bahali.org/bahali-press/#coping"
                                className="flex w-full items-center justify-between pb-4 text-left text-[16px] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                            >
                                <span>Bahali Press</span>
                            </a>
                        </div> */}

                        {/* Contact */}
                        {/* <div>
                            <a
                                href="https://bahali.org/contact/"
                                className="flex w-full items-center justify-between pb-4 text-left text-[16px] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                            >
                                <span>Contact</span>
                            </a>
                        </div> */}

                        {/* Get Involved */}
                        {/* <div>
                            <a
                                href="https://bahali.org/get-involved/"
                                className="flex w-full items-center justify-between pb-4 text-left text-[16px] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                            >
                                <span>Get Involved</span>
                            </a>
                        </div> */}

                        {/* Provider Directory Link (Mobile) */}
                        {/* <div>
                            <a
                                href={directoryUrl}
                                className="flex w-full items-center justify-between pb-4 text-left text-[16px] hover:text-[#163F3C] hover:underline hover:underline-offset-4"
                            >
                                <span>Providers</span>
                            </a>
                        </div> */}



                        {/* <a href="https://bahali.org/donate/" target="_blank">
                            <button className="font-body text-[16px] hover:text-[#163F3C] hover:underline hover:underline-offset-4">
                                <span>Give Now</span>
                            </button>
                        </a> */}

                        {/* Login / Dashboard (Mobile) */}
                        <div className="mt-3">
                            {user ? (
                                <a
                                    href={dashboardUrl}
                                    className="font-body inline-flex min-h-[48px] cursor-pointer items-center rounded-[10px] bg-[#1E4D4A] px-7 text-[15px] font-semibold text-white transition hover:bg-[#163F3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D4A]/40 focus-visible:ring-offset-2"
                                >
                                    Dashboard
                                </a>
                            ) : (
                                <a
                                    href={loginUrl}
                                    className="font-body inline-flex min-h-[48px] cursor-pointer items-center rounded-[10px] bg-[#1E4D4A] px-7 text-[15px] font-semibold text-white transition hover:bg-[#163F3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D4A]/40 focus-visible:ring-offset-2"
                                >
                                    Login
                                </a>
                            )}
                        </div>


                    </div>
                </aside>
            </div>
        </header>
    );
}
