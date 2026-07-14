import React, { useState } from 'react';
import { 
  Gavel, 
  Menu, 
  User, 
  LogOut,
  PlusSquare
} from 'lucide-react';
import { useNavigate } from 'react-router';
// 1. Apna AuthContext hook import kar le
import { useAuth } from '../context/authContext'; 

export default function Title() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    
    // 2. Context se user aur logout function nikal le
    const { user, logout } = useAuth(); 

    // Ek helper function logout aur redirect ke liye
    const handleLogout = async () => {
      try {
        await logout();
        navigate('/login'); // Logout hone ke baad wapas login bhej do
      } catch (error) {
        console.error("Logout failed", error);
      }
    };

  return (
    <div className="relative w-full overflow-x-hidden overflow-y-auto bg-[#0B101A] text-slate-200 font-sans flex flex-col selection:bg-[#7C3AED]/30 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 border-b border-slate-800/50 backdrop-blur-sm bg-[#0F172A]/80">
        
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-gradient-to-br from-[#7C3AED] to-[#a78bfa] p-2 rounded-lg">
            <Gavel className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SmartBid</span>
        </div>

        {/* Desktop Nav Links (Ye toh sabko dikhenge) */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#" className="text-white hover:text-[#a78bfa] transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Auctions</a>
          <a href="#" className="hover:text-white transition-colors">Categories</a>
          
          {/* Agar user logged in hai, toh 'Create Auction' dikha do */}
          {user && (
            <button onClick={() => navigate('/create-auction')} className="flex items-center gap-1 hover:text-[#a78bfa] transition-colors cursor-pointer">
              <PlusSquare className="w-4 h-4" />
              Create
            </button>
          )}
        </div>

        {/* Auth Buttons / Profile Area */}
        <div className="hidden md:flex items-center space-x-4">
          
          {/* CONDITION: Agar User Logged In Nahi Hai */}
          {!user ? (
            <>
              <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 border border-slate-700 hover:border-slate-500 rounded-lg cursor-pointer" onClick={()=>navigate('/login')}>
                Login
              </button>
              <button className="text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors px-5 py-2 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] cursor-pointer" onClick={()=>navigate('/register')}>
                Sign Up
              </button>
            </>
          ) : (
          /* CONDITION: Agar User Logged In Hai */
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                <div className="bg-slate-800 p-1.5 rounded-full">
                  <User className="w-4 h-4" />
                </div>
                <span>{user.name || "My Account"}</span>
              </button>
              
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden text-slate-300" onClick={()=>setIsOpen(!isOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* MOBILE MENU (Ye bhi condition ke hisaab se badlega) */}
      {isOpen && (
        <div className="md:hidden bg-[#0F172A] border-b border-slate-800">
          <div className="flex flex-col px-6 py-5 space-y-4">

            <button onClick={() => { navigate("/"); setIsOpen(false); }} className="text-left hover:text-[#a78bfa]">
              Home
            </button>

            <button onClick={() => { navigate("/auctions"); setIsOpen(false); }} className="text-left hover:text-[#a78bfa]">
              Auctions
            </button>
            
            {user && (
              <button onClick={() => { navigate("/create-auction"); setIsOpen(false); }} className="text-left hover:text-[#a78bfa] flex items-center gap-2">
                <PlusSquare className="w-4 h-4" /> Create Auction
              </button>
            )}

            <hr className="border-slate-700" />

            {!user ? (
              <>
                <button onClick={() => { navigate("/login"); setIsOpen(false); }} className="border border-slate-700 py-2 rounded-lg">
                  Login
                </button>
                <button onClick={() => { navigate("/register"); setIsOpen(false); }} className="bg-[#7C3AED] py-2 rounded-lg">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { navigate("/dashboard"); setIsOpen(false); }} className="border border-slate-700 py-2 rounded-lg flex justify-center items-center gap-2">
                  <User className="w-4 h-4" /> Dashboard
                </button>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="bg-red-500/20 text-red-400 border border-red-500/30 py-2 rounded-lg flex justify-center items-center gap-2">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
