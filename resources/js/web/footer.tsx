import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  HeartHandshake,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1F5A58] text-white">
      {/* Main Footer */}
      <div className="max-w-[1600px] mx-auto grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">

        {/* Column 1 */}
        <div className="border-r border-white/10 p-10">

          {/* Logo */}
          <div className="w-[250px] h-[80px] mb-8">
            <img
              src="/logo-white.png"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>

          <p className="text-[20px] leading-10 text-white/95 mb-8">
            Rooted in culture. Centered on emotional wellness.
          </p>

          <ul className="space-y-5 text-xl">
            <li>
              <a href="#">About Bahali</a>
            </li>
            <li>
              <a href="#">Our Caribbean Focus</a>
            </li>
            <li>
              <a href="#">Founder</a>
            </li>
          </ul>

          <div className="flex gap-5 mt-10">
            <Facebook size={26} />
            <Instagram size={26} />
            <Youtube size={26} />
            <Linkedin size={26} />
          </div>
        </div>

        {/* Column 2 */}
        <div className="border-r border-white/10 p-10">
          <h3 className="text-[30px] font-semibold mb-8">
            Programs & Services
          </h3>

          <hr className="border-white/10 mb-8" />

          <ul className="space-y-6 text-xl">
            <li>Disaster Recovery</li>
            <li>Community Healing</li>
            <li>Workshops & Events</li>
            <li>Training & Education</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="border-r border-white/10 p-10">
          <h3 className="text-[30px] font-semibold mb-8">
            Resources
          </h3>

          <hr className="border-white/10 mb-8" />

          <ul className="space-y-6 text-xl">
            <li>Resources Library</li>
            <li>Parenting Tools</li>
            <li>Children's Books</li>
            <li>Kidz Corner</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="p-10">

          <h3 className="text-[30px] font-semibold mb-8">
            Community
          </h3>

          <hr className="border-white/10 mb-8" />

          <ul className="space-y-6 text-xl mb-10">
            <li>Join the Circle</li>
            <li>Get Involved</li>
            <li>Volunteer</li>
            <li>Partner With Us</li>
          </ul>

          {/* Donate */}
          <button className="border border-[#E49C7A] rounded-xl px-8 py-4 flex items-center gap-3 hover:bg-[#E49C7A] transition">
            <HeartHandshake size={20} />
            Donate
          </button>

          {/* Newsletter */}
          <div className="mt-20 bg-[#d8dfdc] rounded-md p-6 shadow-lg">

            <h3 className="text-[#174D53] text-3xl font-bold text-center mb-8">
              Join the Bahali Circle
            </h3>

            <div className="flex md:flex-row flex-col gap-4">

              <input
                type="email"
                placeholder="email address"
                className="flex-1 h-14 rounded-xl px-5 text-[#174D53] outline-none"
              />

              <button className="bg-[#EA9D79] text-white rounded-xl px-8 font-semibold">
                Join the Circle
              </button>

            </div>
          </div>

          <p className="text-center mt-8 text-lg text-white/90">
            No spam. Just thoughtful resources and occasional updates.
          </p>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-6 text-center text-lg">
        © 2026 Bahali. All rights reserved.
      </div>

      {/* Bottom Links */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto flex md:flex-row flex-col justify-center gap-12 py-6 text-lg">

          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Donation Policy</a>
          <a href="#">Contact Us</a>

        </div>
      </div>
    </footer>
  );
}