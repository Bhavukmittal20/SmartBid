import React from 'react';
import { Gavel, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-[#1E293B] border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-[#7C3AED] transition-colors [&:-webkit-autofill]:[box-shadow:0_0_0px_1000px_#1E293B_inset] [&:-webkit-autofill]:[!text-white] [&:-webkit-autofill]:[caret-color:white]";

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-[#0B101A] p-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative w-full max-w-md bg-[#0F172A]/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-[#7C3AED] p-2 rounded-lg"> <Gavel className="w-5 h-5 text-white" /> </div>
                <span className="text-xl font-bold text-white">SmartBid</span>
              </div>
        <h2 className="text-2xl font-bold text-white mb-8">Welcome Back!</h2>
        
        <form className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input type="email" placeholder="Email" className={inputClass} />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input type="password" placeholder="Password" className={inputClass} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input type="checkbox" className="peer sr-only" />
              <div className="w-5 h-5 border border-slate-600 rounded flex items-center justify-center peer-checked:bg-[#7C3AED] peer-checked:border-[#7C3AED] transition-all">
                <span className="text-white hidden peer-checked:block text-xs">✓</span>
              </div>
              <span className="text-slate-400 group-hover:text-white transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-[#7C3AED] hover:underline">Forgot Password?</a>
          </div>

          <button className="w-full py-3 bg-[#7C3AED] text-white font-semibold rounded-lg shadow-lg hover:bg-[#6D28D9]">Login</button>
        </form>
      </div>
    </div>
  );
}