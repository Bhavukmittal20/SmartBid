import React from 'react'
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
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Title() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate=useNavigate()
  return (
    <div className="relative w-full overflow-x-hidden overflow-y-auto bg-[#0B101A] text-slate-200 font-sans flex flex-col selection:bg-[#7C3AED]/30 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 border-b border-slate-800/50 backdrop-blur-sm bg-[#0F172A]/80">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="bg-gradient-to-br from-[#7C3AED] to-[#a78bfa] p-2 rounded-lg">
            <Gavel className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SmartBid</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#" className="text-white hover:text-[#a78bfa] transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Auctions</a>
          <a href="#" className="hover:text-white transition-colors">Categories</a>
          <a href="#" className="hover:text-white transition-colors">How It Works</a>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 border border-slate-700 hover:border-slate-500 rounded-lg cursor-pointer" onClick={()=>navigate('/login')}>
            Login
          </button>
          <button className="text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors px-5 py-2 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] cursor-pointer" onClick={()=>navigate('/register')}>
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden text-slate-300" onClick={()=>setIsOpen(!isOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </nav>
      {isOpen && (
  <div className="md:hidden bg-[#0F172A] border-b border-slate-800">
    <div className="flex flex-col px-6 py-5 space-y-4">

      <button
        onClick={() => {
          navigate("/");
          setIsOpen(false);
        }}
        className="text-left hover:text-[#a78bfa]"
      >
        Home
      </button>

      <button
        onClick={() => {
          navigate("/auctions");
          setIsOpen(false);
        }}
        className="text-left hover:text-[#a78bfa]"
      >
        Auctions
      </button>

      <button
        onClick={() => {
          navigate("/categories");
          setIsOpen(false);
        }}
        className="text-left hover:text-[#a78bfa]"
      >
        Categories
      </button>

      <button
        onClick={() => {
          navigate("/how-it-works");
          setIsOpen(false);
        }}
        className="text-left hover:text-[#a78bfa]"
      >
        How It Works
      </button>

      <hr className="border-slate-700" />

      <button
        onClick={() => {
          navigate("/login");
          setIsOpen(false);
        }}
        className="border border-slate-700 py-2 rounded-lg"
      >
        Login
      </button>

      <button
        onClick={() => {
          navigate("/signup");
          setIsOpen(false);
        }}
        className="bg-[#7C3AED] py-2 rounded-lg"
      >
        Sign Up
      </button>

    </div>
  </div>
)}
      </div>
  )
}
