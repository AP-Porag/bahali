import React from 'react'
import { Facebook, HeartHandshake, Instagram, Linkedin, Youtube } from 'lucide-react';

export const MobileFooter = () => {
  return (
      <footer className="bg-[#1F5955] text-white">

      {/* Top Logo Area */}
      <section className="max-w-[1440px] mx-auto h-[260px] border-b border-[#4E7572]">
        <div className="pt-10 flex flex-col items-center justify-center px-16 ">
          {/* Logo Here */}
                    <div className=" h-[100px]">
                        <img src="/img/bahali-foot-logo.png" alt="" className="h-full w-full object-contain cursor-pointer" />
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
                        <li className="cursor-pointer">About Bahali</li>
                        <li className="cursor-pointer">Our Caribbean Focus</li>
                        <li className="cursor-pointer">Founder</li>
                    </ul>

            </div>

            {/* Resources */}
            <div className="py-8 px-4 pt-10 pl-10">
                    <h3 className="mb-6 text-[16px] text-[#e99e84] font-medium font-libre">Resources</h3>

                    <hr className="mb-8 border-white/10" />

                    <ul className="space-y-4 text-[14px] font-open">
                        <li className="cursor-pointer">Resources Library</li>
                        <li className="cursor-pointer">Parenting Tools</li>
                        <li className="cursor-pointer">Children's Books</li>
                        <li className="cursor-pointer">Kidz Corner</li>
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
                        <li className="cursor-pointer">Disaster Recovery</li>
                        <li className="cursor-pointer">Community Healing</li>
                        <li className="cursor-pointer">Workshops & Events</li>
                        <li className="cursor-pointer">Training & Education</li>
                    </ul>
            </div>

            {/* Community */}
            <div className="py-8 px-4 pt-10">
                    <h3 className="mb-6 text-[16px] text-[#e99e84] font-medium font-libre">Community</h3>

                    <hr className="mb-8 border-white/10"/>

                    <ul className="mb-10 space-y-4 text-[14px] font-open">
                        <li className="cursor-pointer">Join the Circle</li>
                        <li className="cursor-pointer">Get Involved</li>
                        <li className="cursor-pointer">Volunteer</li>
                        <li className="cursor-pointer">Partner With Us</li>
                    </ul>
                    {/* Donate */}
                    <button className="flex items-center gap-3 rounded-xl border-2 border-[#e99e84] px-5 py-3 text-[14px] font-bold transition cursor-pointer hover:bg-[#d7845e] duration-300 font-inter">
                        <HeartHandshake size={20} />
                        Donate
                    </button>
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
                        <Facebook size={24} className="hover:text-[#E49C7A] duration-300 cursor-pointer"/>
                        <Instagram size={24} className="hover:text-[#E49C7A] duration-300 cursor-pointer"/>
                        <Youtube size={24} className="hover:text-[#E49C7A] duration-300 cursor-pointer"/>
                        <Linkedin size={24} className="hover:text-[#E49C7A] duration-300 cursor-pointer"/>
                    </div>

      </section>

       <div className="border-t border-b border-white/10 hover:text-[#e99e84] py-6 text-center text-[14px] font-open">© 2026 Bahali. All rights reserved.</div>

      {/* Bottom Links */}
      <section className="">

        <div className="grid grid-cols-3 h-[40px] text-[14px] border-b border-[#416C68]">

          <div className="flex items-center justify-center font-open">
            <a href="#" className="cursor-pointer">Terms of Service</a>
          </div>

          <div className="flex items-center justify-center font-open">
            <a href="#" className="cursor-pointer">Privacy Policy</a>
          </div>

          <div className="flex items-center justify-center font-open">
            <a href="#" className="cursor-pointer">Donation Policy</a>
          </div>

        </div>

        <div className="h-[70px] flex items-center justify-center font-open text-[14px]">
            <a href="#" className="cursor-pointer">Contact Us</a>
        </div>

      </section>

    </footer>
  )
}
