// import AppLogoIcon from './app-logo-icon';

// export default function AppLogo() {
//     return (
//         <>
//             <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
//                 <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
//             </div>
//             <div className="ml-1 grid flex-1 text-left text-sm">
//                 <span className="mb-0.5 truncate leading-none font-semibold">Bahali</span>
//             </div>
//         </>
//     );
// }

export default function AppLogo() {
    return (
        <>
            <div className="flex items-center gap-2">
                {/* First Logo (icon) */}
                <div className="flex aspect-square size-8 items-center justify-center rounded-md">
                    <img src="/images/bahali-icon.png" alt="Bahali Icon" className="size-8 object-contain" />
                </div>

                {/* Second Logo (text/logo image) */}
                <img src="/images/bahali-text.png" alt="Bahli Logo" className="h-6 object-contain" />
            </div>
        </>
    );
}
