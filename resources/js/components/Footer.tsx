import { Facebook, HeartHandshake, Instagram, Linkedin, Youtube } from 'lucide-react';
import FooterCredit from './madbrain';
export default function Footer() {
    return (
        <section>
            {/* desktop footer */}
            <footer className="bg-[#1e4d4a] pt-16 text-white hidden md:block">
                {/* Main Footer */}
                <div className="mx-auto grid max-w-[1600px] overflow-hidden px-10 md:grid-cols-4 lg:grid-cols-[350px_240px_240px_1fr]">
                    {/* Column 1 */}
                    <div className="border-r border-white/10 pt-10">
                        {/* Logo */}
                        <div className="lg:w-[250px] mb-3 md:h-[60px] lg:h-[80px]">
                            <a href="https://bahali.org" target="_blank">
                                <img src="/images/bahali-footer-logo.png" alt="" className="h-full w-full cursor-pointer object-contain -mt-6" />
                            </a>
                        </div>

                        <p className="mb-6 leading-9 text-white/95 md:pr-4 md:pl-12 md:text-[14px] lg:pr-12 lg:pl-20 lg:text-[16px] font-open">
                            Rooted in culture. Centered on emotional wellness.
                        </p>

                        <ul className="space-y-5 md:pr-4 md:pl-12 md:text-[16px] lg:pr-10 lg:pl-22 lg:text-[18px]">
                            <li>
                                <a href="https://bahali.org/about/" target="_blank" className="cursor-pointer font-open">
                                    About Bahali
                                </a>
                            </li>
                            <li>
                                <a href="https://bahali.org/our-founder/" target="_blank" className="cursor-pointer font-open">
                                    Our Caribbean Focus
                                </a>
                            </li>
                            <li>
                                <a href="https://bahali.org/our-founder/" target="_blank" className="cursor-pointer font-open">
                                    Founder
                                </a>
                            </li>
                        </ul>

                        <div className="mt-4 flex md:gap-3 md:pr-4 md:pl-12 lg:gap-5 lg:pr-12 lg:pl-20">
                            <a href="https://web.facebook.com/BahaliCircle?_rdc=1&_rdr#" target="_blank">
                                <Facebook size={26} className="cursor-pointer duration-300 hover:text-[#E49C7A]" />
                            </a>

                            <a href="https://www.instagram.com/BahaliCircle" target="_blank">
                                <Instagram size={26} className="cursor-pointer duration-300 hover:text-[#E49C7A]" />
                            </a>
                            <a href="https://www.youtube.com/@BahaliCircle">
                                <Youtube size={26} className="cursor-pointer duration-300 hover:text-[#E49C7A]" />
                            </a>
                            <a href="https://www.youtube.com/@BahaliCircle" target="_blank">
                                <Linkedin size={26} className="cursor-pointer duration-300 hover:text-[#E49C7A]" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="border-r border-white/10 px-4 pt-10">
                        <h3 className="mb-6 font-medium md:text-[16px] lg:text-[18px] font-libre">Programs & Services</h3>

                        <hr className="mb-8 border-white/10" />

                        <ul className="space-y-4 md:text-[14px] lg:text-[16px] font-open">
                            <a href="https://bahali.org/disaster-recovery/" target="_blank" className="block">
                                <li className="cursor-pointer">Disaster Recovery</li>
                            </a>
                            <a href="https://bahali.org/programs/" target="_blank" className="block">
                                <li className="cursor-pointer">Community Healing</li>
                            </a>
                            <a href="https://bahali.org/programs/" target="_blank" className="block">
                                <li className="cursor-pointer">Workshops & Events</li>
                            </a>
                            <a href="https://bahali.org/programs/" target="_blank" className="block">
                                <li className="cursor-pointer">Training & Education</li>
                            </a>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="border-r border-white/10 px-4 pt-10">
                        <h3 className="mb-6 font-medium md:text-[16px] lg:text-[18px] font-libre">Resources</h3>

                        <hr className="mb-8 border-white/10" />

                        <ul className="space-y-4 md:text-[14px] lg:text-[16px] font-open">
                            <a href="https://bahali.org/resources/" className="block" target='_blank'>
                                <li className="cursor-pointer">Resources Library</li>
                            </a>
                            <a href="https://bahali.org/kids-corner/" className="block" target='_blank'>
                                <li className="cursor-pointer">Parenting Tools</li>
                            </a>
                            <a href="https://bahali.org/kids-corner/" className="block" target='_blank'>
                                <li className="cursor-pointer">Children's Books</li>
                            </a>
                            <a href="https://bahali.org/kids-corner/" className="block" target='_blank'>
                                <li className="cursor-pointer">Kidz Corner</li>
                            </a>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div className="px-4 pt-10">
                        <h3 className="mb-6 font-medium md:text-[16px] lg:text-[18px] font-libre">Community</h3>

                        <hr className="mr-20 mb-8 border-white/10" />

                        <ul className="mb-10 space-y-4 md:text-[14px] font-open lg:text-[16px]">
                            <a href="https://bahali.org/join-the-circle/#" target="_blank" className="block">
                                <li className="cursor-pointer">Join the Circle</li>
                            </a>
                            <a href="https://bahali.org/get-involved/" target="_blank" className="block">
                                <li className="cursor-pointer">Get Involved</li>
                            </a>
                            <a href="https://bahali.org/get-involved/" target="_blank" className="block">
                                <li className="cursor-pointer">Volunteer</li>
                            </a>
                            <a href="https://bahali.org/get-involved/" target="_blank" className="block">
                                <li className="cursor-pointer">Partner With Us</li>
                            </a>
                        </ul>

                        {/* Donate */}
                        <a href="https://bahali.org/donate/#give" target="_blank">
                            <button className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[#e99e84] px-5 py-3 text-[16px] font-bold transition duration-300 hover:bg-[#d7845e] font-inter">
                                <HeartHandshake size={20} />
                                Donate
                            </button>
                        </a>

                        {/* Newsletter */}
                        <div className="-lg:ml-16 mt-14 flex items-center justify-center">
                            {/* Outer Container */}
                            <div className="rounded-[2px] bg-[#8ca4a3] p-5 shadow-[3px_3px_3px_rgba(207,215,211,1)] md:mr-10 lg:mr-0">
                                {/* Inner Card */}
                                <div className="rounded-[8px] bg-[#eef3f1] px-4 py-2">
                                    {/* Heading */}
                                    {/* <h2 className="text-[26px] mb-10 text-center leading-none pt-1 font-extrabold text-[#134B59]">Join the Bahali Circle</h2> */}

                                    {/* Form */}
                                    <div className="mt-4 mb-4 gap-2 md:space-y-4 lg:flex lg:space-y-0">
                                        {/* Input */}
                                        <input
                                            type="email"
                                            placeholder="email address"
                                            className="h-[40px] rounded-[12px] border border-[#A8B6B8] bg-[#f4f6f5] px-2 py-2 text-[14px] text-[#134B59] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] outline-none placeholder:text-[#134B59] focus:ring-2 focus:ring-[#134B59]/20 min-[992px]:w-[170px] font-inter"
                                        />

                                        {/* Button */}
                                        <button className="rounded-[12px] bg-[#e99e84] px-4 py-3 text-[16px] font-bold text-white md:w-full">
                                            <span className="hidden flex-col items-center leading-[1.3] min-[982px]:flex font-inter">
                                                <span>Join</span>
                                                <span>the</span>
                                                <span>Circle</span>
                                            </span>

                                            <span className="min-[982px]:hidden font-inter">Join the Circle</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 pb-8 text-center leading-8 font-medium text-white/90 hover:text-[#e99e84] md:text-[14px] lg:text-[15px] font-open">
                            No spam. Just thoughtful resources and occasional updates.
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 py-6 text-center text-[14px] font-open hover:text-[#e99e84]">© 2026 Bahali. All rights reserved.</div>

                {/* Bottom Links */}
                <div className="border-t border-white/10">
                    <div className="mx-auto flex max-w-[1200px] flex-col justify-center gap-12 pt-2 pb-16 text-[14px] md:flex-row font-open">
                        <a href="https://bahali.org/legal/#" className="cursor-pointer">
                            Terms of Service
                        </a>
                        <a href="https://bahali.org/legal/#" className="cursor-pointer">
                            Privacy Policy
                        </a>
                        <a href="https://bahali.org/legal/#" className="cursor-pointer">
                            Donation Policy
                        </a>
                        <a href="https://bahali.org/contact/" className="cursor-pointer">
                            Contact Us
                        </a>
                    </div>
                </div>
                <div className="py-3 text-center text-sm">
                    <FooterCredit text="Technology Partner" />
                </div>
            </footer>






            {/* mobile footer */}
            <footer className="bg-[#1F5955] text-white block md:hidden">

                {/* Top Logo Area */}
                <section className="max-w-[1440px] mx-auto h-[260px] border-b border-[#4E7572]">
                    <div className="pt-10 flex flex-col items-center justify-center px-16 ">
                        {/* Logo Here */}
                        <div className=" h-[100px]">
                            <a href="https://bahali.org/">
                                <img src="/images/bahali-footer-logo.png" alt="" className="h-full w-full object-contain cursor-pointer" />
                            </a>
                        </div>

                        <p className="text-[16px] leading-9 text-center text-white/95 font-open pt-3 sm:pl-30">Rooted in culture. Centered on emotional wellness.</p>
                    </div>
                </section>

                {/* ================= GRID ================= */}
                <section className="max-w-[1440px] mx-auto">

                    <div className="grid grid-cols-2">

                        {/* LEFT */}
                        <div className="border-r border-[#416C68] ">

                            {/* Bahali */}
                            <div className="py-8 border-b border-[#416C68] px-4 pt-10 pl-10">
                                <h3 className="mb-6 text-[16px] font-medium text-[#e99e84] font-libre">Bahali</h3>

                                <hr className="mb-8 border-white/10" />

                                <ul className="space-y-4 text-[14px] font-open">
                                    <a href="https://bahali.org/about/" className="block">
                                        <li className="cursor-pointer">About Bahali</li>
                                    </a>
                                    <a href="https://bahali.org/our-founder/" className="block">
                                        <li className="cursor-pointer">Our Caribbean Focus</li>
                                    </a>
                                    <a href="https://bahali.org/our-founder/" className="block">
                                        <li className="cursor-pointer">Founder</li>
                                    </a>
                                </ul>

                            </div>

                            {/* Resources */}
                            <div className="py-8 px-4 pt-10 pl-10">
                                <h3 className="mb-6 text-[16px] text-[#e99e84] font-medium font-libre">Resources</h3>

                                <hr className="mb-8 border-white/10" />

                                <ul className="space-y-4 text-[14px] font-open">
                                    <a href="https://bahali.org/resources/" className="block" target="_blank">
                                        <li className="cursor-pointer">Resources Library</li>
                                    </a>
                                    <a href="https://bahali.org/kids-corner/" className="block" target="_blank">
                                        <li className="cursor-pointer">Parenting Tools</li>
                                    </a>
                                    <a href="https://bahali.org/kids-corner/" className="block" target="_blank">
                                        <li className="cursor-pointer">Children's Books</li>
                                    </a>
                                    <a href="https://bahali.org/kids-corner/" className="block" target="_blank">
                                        <li className="cursor-pointer">Kidz Corner</li>
                                    </a>
                                </ul>

                            </div>

                        </div>

                        {/* RIGHT */}
                        <div>

                            {/* Programs */}
                            <div className="py-8 border-b border-[#416C68] px-4 pt-10">
                                <h3 className="mb-6 text-[16px] text-[#e99e84] font-medium font-libre">Programs & Services</h3>

                                <hr className="mb-8 border-white/10" />

                                <ul className="space-y-4 text-[14px] font-open">

                                    <li className="cursor-pointer">
                                        <a href="https://bahali.org/disaster-recovery/" className="block">
                                            Disaster Recovery
                                        </a>
                                    </li>


                                    <li className="cursor-pointer">
                                        <a href="https://bahali.org/programs/" className="block">Community Healing</a>
                                    </li>


                                    <li className="cursor-pointer">
                                        <a href="https://bahali.org/programs/" className="block">Workshops & Events </a>
                                    </li>


                                    <li className="cursor-pointer">
                                        <a href="https://bahali.org/programs/" className="block">Training & Education
                                        </a>
                                    </li>

                                </ul>
                            </div>

                            {/* Community */}
                            <div className="py-8 px-4 pt-10">
                                <h3 className="mb-6 text-[16px] text-[#e99e84] font-medium font-libre">Community</h3>

                                <hr className="mb-8 border-white/10" />

                                <ul className="mb-10 space-y-4 text-[14px] font-open">
                                    <a href="https://bahali.org/join-the-circle/#" className="block">
                                        <li className="cursor-pointer">Join the Circle</li>
                                    </a>
                                    <a href="https://bahali.org/get-involved/" className="block">
                                        <li className="cursor-pointer">Get Involved</li>
                                    </a>
                                    <a href="https://bahali.org/get-involved/" className="block">
                                        <li className="cursor-pointer">Volunteer</li>
                                    </a>
                                    <a href="https://bahali.org/get-involved/" className="block">
                                        <li className="cursor-pointer">Partner With Us</li>
                                    </a>
                                </ul>
                                {/* Donate */}
                                <a href="https://bahali.org/donate/#give">
                                    <button className="flex items-center gap-3 rounded-xl border-2 border-[#e99e84] px-5 py-3 text-[14px] font-bold transition cursor-pointer hover:bg-[#d7845e] duration-300 font-inter">
                                        <HeartHandshake size={20} />
                                        Donate
                                    </button>
                                </a>
                            </div>

                        </div>

                    </div>

                </section>

                {/* Newsletter */}
                <section className="border-t border-[#416C68] border-b">

                    {/* Newsletter Card */}
                    <div className="px-10 pt-10">
                        {/* Outer Container */}
                        <div className=" bg-[#8ca4a3] p-5 rounded-[2px] shadow-[3px_3px_3px_rgba(207,215,211,1)]">
                            {/* Inner Card */}
                            <div className="rounded-[8px] bg-[#eef3f1] px-4 py-2">
                                {/* Heading */}
                                {/* <h2 className="text-[26px] mb-10 text-center leading-none pt-1 font-extrabold text-[#134B59]">Join the Bahali Circle</h2> */}

                                {/* Form */}
                                <div className="mt-4 space-y-5 sm:flex gap-2 mb-4">
                                    {/* Input */}
                                    <input
                                        type="email"
                                        placeholder="email address"
                                        className="rounded-[12px] w-full h-[40px] border border-[#A8B6B8] px-2 py-2 text-[14px] font-inter text-[#134B59] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] outline-none placeholder:text-[#134B59] bg-[#f4f6f5] focus:ring-2 focus:ring-[#134B59]/20"
                                    />

                                    {/* Button */}
                                    <button className="rounded-[12px] w-full sm:w-[40%] bg-[#e99e84] px-4 py-2 text-[15px]  font-bold text-white shadow-md transition hover:bg-[#e99e84] cursor-pointer font-inter">
                                        Join the Circle
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 px-12 text-center text-[14px] leading-8 pb-8 font-medium text-white/90 font-open hover:text-[#e99e84]">No spam. Just thoughtful resources and occasional updates.</p>

                </section>

                {/* Social */}
                <section className=" border-b border-[#416C68]">

                    {/* Social */}
                    <div className="flex items-center justify-center pb-10 pt-2 gap-5 pl-18 pr-10">
                        <a href="https://www.facebook.com/BahaliCircle">
                            <Facebook size={24} className="hover:text-[#E49C7A] duration-300 cursor-pointer" />
                        </a>
                        <a href="https://www.instagram.com/BahaliCircle">
                            <Instagram size={24} className="hover:text-[#E49C7A] duration-300 cursor-pointer" />
                        </a>
                        <a href="https://m.youtube.com/@BahaliCircle">
                            <Youtube size={24} className="hover:text-[#E49C7A] duration-300 cursor-pointer" />
                        </a>
                        <a href="https://www.youtube.com/@BahaliCircle">
                            <Linkedin size={24} className="hover:text-[#E49C7A] duration-300 cursor-pointer" />
                        </a>
                    </div>

                </section>

                <div className="border-t border-b border-white/10 hover:text-[#e99e84] py-6 text-center text-[14px] font-open">© 2026 Bahali. All rights reserved.</div>

                {/* Bottom Links */}
                <section className="">

                    <div className="grid grid-cols-3 h-[40px] text-[13px] sm:text-[14px] gap-2 border-b px-2 border-[#416C68]">

                        <div className="flex items-center justify-center font-open">
                            <a href="https://bahali.org/legal/#" className="cursor-pointer">Terms of Service</a>
                        </div>

                        <div className="flex items-center justify-center font-open">
                            <a href="https://bahali.org/legal/#" className="cursor-pointer">Privacy Policy</a>
                        </div>

                        <div className="flex items-center justify-center font-open">
                            <a href="https://bahali.org/legal/#" className="cursor-pointer">Donation Policy</a>
                        </div>

                    </div>

                    <div className="h-[70px] flex items-center justify-center font-open text-[14px]">
                        <a href="https://bahali.org/contact/" className="cursor-pointer">Contact Us</a>
                    </div>
                </section>

            </footer >

        </section >
    );
}



