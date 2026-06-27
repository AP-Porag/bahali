import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const [open, setOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const toggleMenu = (menu: string) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const dropdownMenus = {
        About: ['Founder', 'Advisory Board'],

        Programs: ['Disaster Recovery'],

        Resources: ['Kidz Corner', 'Bahali Resources Hub'],
    };

    const navItems = ['About', 'Programs', 'Resources', 'Bahali Press', 'Contact', 'Get Involved'];

    return (
        <header className="w-full border-b border-gray-200 bg-[#fafaf6]">
            <div className="mx-auto flex max-w-[1600px] justify-between px-3 min-[982px]:flex min-[982px]:justify-center min-[982px]:px-8 min-[982px]:pt-3 lg:flex lg:justify-between lg:px-6 lg:py-1">
                {/* Logo */}
                <div className="mb-2 min-[982px]:flex min-[982px]:items-start lg:flex lg:items-center">
                    <div className="w-[230px] overflow-hidden rounded-md">
                        {/* Replace with your logo */}
                        <img src="/img/new-logo.png" alt="Logo" className="w-[160px] object-contain" />
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="mb-2 flex gap-8">
                    <nav className="hidden flex-wrap items-center gap-7 min-[982px]:flex">
                        {navItems.map((item) => (
                            <div
                                key={item}
                                className="relative"
                                onMouseEnter={() => setActiveDropdown(item)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button className="flex items-center gap-2 text-[20px] font-medium text-[#1e4d4a] hover:text-[#e99e84]">
                                    {item}

                                    {dropdownMenus[item] &&
                                        (activeDropdown === item ? (
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
                                        ))}
                                </button>

                                <div className="absolute top-full -left-6 z-50">
                                    {dropdownMenus[item] && activeDropdown === item && (
                                        <div className="mt-2 w-[210px] rounded-xl border border-gray-200 bg-white pb-2 shadow-xl">
                                            {dropdownMenus[item].map((menu) => (
                                                <a
                                                    key={menu}
                                                    href="#"
                                                    className="block px-8 py-3 text-[18px] font-semibold text-gray-700 hover:text-[#d8886c]"
                                                >
                                                    {menu}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div className="hidden min-[982px]:block">
                            <button className="cursor-pointer rounded-full bg-[#d8886c] px-7 py-3.5 text-[20px] text-white transition hover:text-[#1e4d4a]">
                                Give Now
                            </button>
                        </div>
                    </nav>

                    {/* Right Side */}
                </div>

                {/* Mobile Right */}
                <div className="flex items-center gap-4 min-[982px]:hidden">
                    {/* <button className="bg-[#d8886c] text-white px-6 py-3 rounded-full font-semibold">
            Give Now
          </button> */}

                    <button onClick={() => setOpen(!open)}>
                        {open ? <X size={34} className="text-[#1F5559]" /> : <Menu size={34} className="text-[#1F5559]" />}
                    </button>
                </div>
            </div>





            {/* mobile nav */}
            <div className="min-[982px]:hidden">
                {/* Overlay */}
                <div
                    onClick={() => setOpen(false)}
                    className={`fixed inset-0 z-40 transition-all duration-500 ${
                        open ? 'bg-black/30 opacity-100 backdrop-blur-md' : 'invisible opacity-0'
                    }`}
                >
                    <div className="h-[90px] w-full border-b-1 border-black/5">
                        {/* <div className="flex items-center gap-4 min-[982px]:hidden">
                            <button onClick={() => setOpen(open)}>{<Menu size={34} className="text-[#1F5559]" />}</button>
                        </div> */}
                    </div>
                </div>

                {/* Drawer */}
                <aside
                    className={`fixed top-0 right-0 z-50 h-full w-[40%] bg-white transition-transform duration-500 ease-out ${
                        open ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                  

                    {/* Scroll Area */}
                    <div className="h-full overflow-y-auto px-8 pb-20">
                          {/* Close */}
                    <div className="flex justify-end mb-[80px] -mr-2">
                        <button onClick={() => setOpen(false)} className="pt-[16px]">
                            <X size={26} strokeWidth={1.5} />
                        </button>
                    </div>


                        {navItems.map((item, index) => {
                            const hasDropdown = item === 'About' || item === 'Programs' || item === 'Resources';

                            return (
                                <div key={item} className="">
                                    <button
                                        onClick={() => hasDropdown && toggleMenu(item)}
                                        className="flex w-full hover:text-[#d8886c] items-center justify-between pb-10 text-left text-[20px]"
                                    >
                                        <span>{item}</span>


                                        {hasDropdown &&
                                            (activeMenu === item ? (
                                                <div className="flex h-8 w-8 hover:text-[#d8886c] items-center justify-center rounded-full bg-gray-100">
                                                    <X size={22} />
                                                </div>
                                            ) : (
                                                <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                                                </svg>
                                            ))}
                                    </button>

                                    {/* Dropdown */}

                                    <div className={`overflow-hidden transition-all duration-300 -mt-3 ${activeMenu === item ? 'max-h-96' : 'max-h-0'}`}>
                                        {hasDropdown &&
                                            dropdownMenus[item].map((sub) => (
                                                <a key={sub} href="#" className="block pb-4 pl-6 text-[18px]">
                                                    {sub}
                                                </a>
                                            ))}
                                    </div>
                                </div>
                            );
                        })}

                        <button className="text-[20px]">
                           <span>Give Now</span>
                        </button>
                    </div>
                </aside>
            </div>
        </header>
    );
}
