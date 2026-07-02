import { Gavel } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className=" border-t border-slate-800 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-violet-600 p-2 rounded-lg">
                <Gavel className="w-5 h-5 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-white">
                SmartBid
              </h2>
            </div>

            <p className="text-slate-400 mt-4 leading-7">
              SmartBid is an AI-powered online auction platform where users
              can buy, sell and bid in real-time with intelligent price
              predictions.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">
              Platform
            </h3>

            <ul className="space-y-3 text-slate-400">
              <li className="hover:text-violet-400 cursor-pointer">Dashboard</li>
              <li className="hover:text-violet-400 cursor-pointer">Auctions</li>
              <li className="hover:text-violet-400 cursor-pointer">Categories</li>
              <li className="hover:text-violet-400 cursor-pointer">AI Insights</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">
              Support
            </h3>

            <ul className="space-y-3 text-slate-400">
              <li className="hover:text-violet-400 cursor-pointer">Help Center</li>
              <li className="hover:text-violet-400 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-violet-400 cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-violet-400 cursor-pointer">Contact Us</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">
              Connect
            </h3>

            <div className="flex gap-4">
              <button className="w-11 h-11 rounded-xl bg-[#111827] hover:bg-violet-600 transition flex items-center justify-center">
                <FaGithub className="text-white text-xl"/>
              </button>

              <button className="w-11 h-11 rounded-xl bg-[#111827] hover:bg-violet-600 transition flex items-center justify-center">
                <FaLinkedin className="text-white text-xl" />
              </button>

              <button className="w-11 h-11 rounded-xl bg-[#111827] hover:bg-violet-600 transition flex items-center justify-center">
                <FaXTwitter className="text-white text-xl" />
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-slate-500 text-sm">
            © 2026 SmartBid. All rights reserved.
          </p>

          <p className="text-slate-500 text-sm">
            Built with ❤️ using MERN + AI
          </p>

        </div>

      </div>
    </footer>
  );
}