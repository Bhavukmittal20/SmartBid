import React from 'react';
import { 
  Gavel, 
  Search, 
  Menu, 
  User, 
  Radio, 
  ShoppingBag, 
  IndianRupee,
  Zap,
  Cpu,
  ShieldCheck,
  Users
} from 'lucide-react';

export default function SmartBidLanding() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#0B101A] text-slate-200 font-sans flex flex-col selection:bg-[#7C3AED]/30 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      
      {/* Background glow effects - FIXED position so they never cause horizontal scrollbars */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#7C3AED]/20 blur-[120px] rounded-full"></div>
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-[#2563EB]/10 blur-[100px] rounded-full"></div>
      </div>
      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-16 lg:pt-32 lg:pb-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* Left Column: Typography & CTAs */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] xl:text-[5rem] font-bold leading-[1.1] text-white mb-6 tracking-tight">
            Bid Smart.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#c4b5fd]">Win Big.</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
            Join thousands of buyers and sellers in our intelligent, AI-powered auction platform. Experience seamless, real-time bidding today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all transform hover:-translate-y-0.5">
              Explore Auctions
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 text-white font-medium rounded-xl transition-all">
              How It Works
            </button>
          </div>
        </div>

        {/* Right Column: Hero Graphic */}
        <div className="flex-1 relative w-full flex justify-center items-center mt-10 lg:mt-0">
          <div className="relative w-full max-w-[300px] sm:max-w-[400px] aspect-square flex justify-center items-center">
            
            {/* Orbital Rings */}
            <div className="absolute inset-4 border border-[#7C3AED]/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute inset-10 border border-slate-700/40 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="absolute inset-16 border border-[#2563EB]/20 rounded-full animate-[spin_25s_linear_infinite]"></div>

            {/* Center Glass Card */}
            <div className="relative z-10 w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-5 sm:p-6 transform hover:scale-105 transition-transform duration-500">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#a78bfa] mb-4 sm:mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.4)]">
                <Gavel className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
              </div>
              <h3 className="text-white font-semibold text-base sm:text-lg mb-1">Premium Asset</h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-4">ID: #SB-8924</p>
              <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-green-400 rounded-full"></div>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-3">Auction ending soon...</p>
            </div>

            {/* Floating Badges */}
            <div className="absolute top-0 sm:top-4 right-0 sm:-right-4 z-20 bg-[#0F172A]/90 backdrop-blur-md border border-slate-700 p-2 sm:p-3 rounded-xl shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-[10px] sm:text-xs font-semibold text-white">Live Auction</span>
              </div>
            </div>
            
            <div className="absolute bottom-6 sm:bottom-10 left-0 sm:-left-8 z-20 bg-[#0F172A]/90 backdrop-blur-md border border-slate-700 p-3 sm:p-4 rounded-xl shadow-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <p className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-wider mb-1">Highest Bid</p>
              <span className="text-base sm:text-lg font-bold text-[#a78bfa]">₹1,45,000</span>
            </div>

          </div>
        </div>
      </main>

      {/* Stats Section */}
      <div className="relative z-10 border-t border-slate-800/50 bg-[#0B101A]/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-3xl font-bold text-white">25K+</h3>
              </div>
              <p className="text-sm text-slate-400">Active Users</p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mb-2">
                <Radio className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-3xl font-bold text-white">12K+</h3>
              </div>
              <p className="text-sm text-slate-400">Auctions Live</p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingBag className="w-4 h-4 text-[#7C3AED]" />
                <h3 className="text-3xl font-bold text-white">45K+</h3>
              </div>
              <p className="text-sm text-slate-400">Items Sold</p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mb-2">
                <IndianRupee className="w-4 h-4 text-green-400" />
                <h3 className="text-3xl font-bold text-white">12Cr+</h3>
              </div>
              <p className="text-sm text-slate-400">Total Transactions</p>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Features Bar */}
      <div className="relative z-10 bg-[#1E293B] border-t border-slate-700/50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center space-x-4">
              <div className="bg-[#7C3AED]/10 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Real-time Bidding</h4>
                <p className="text-xs text-slate-400">Live updates with WebSockets</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-[#7C3AED]/10 p-3 rounded-lg">
                <Cpu className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">AI Powered</h4>
                <p className="text-xs text-slate-400">Smart predictions & recommendations</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-[#7C3AED]/10 p-3 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Secure Payments</h4>
                <p className="text-xs text-slate-400">Safe & secure transactions</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-[#7C3AED]/10 p-3 rounded-lg">
                <Users className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Trusted Community</h4>
                <p className="text-xs text-slate-400">Verified users & secure platform</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}