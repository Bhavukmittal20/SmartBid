import { useState } from 'react';
import { Gavel, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

export default function LoginPage() {
  const navigate=useNavigate()
  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-[#1E293B] border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-[#7C3AED] transition-colors [&:-webkit-autofill]:[box-shadow:0_0_0px_1000px_#1E293B_inset] [&:-webkit-autofill]:[!text-white] [&:-webkit-autofill]:[caret-color:white]";
  const {login}=useAuth();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('')
  const loginUser= async(e)=>{
    e.preventDefault();
    try{
      await login(email,password);
      navigate('/dashboard')
    }catch(err){
      toast.error(err.message);
    }
  }

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
            <input type="email" placeholder="Email" className={inputClass} onChange={(e)=>(setEmail(e.target.value))}/>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input type="password" placeholder="Password" className={inputClass} onChange={(e)=>(setPassword(e.target.value))}/>
          </div>



          <button className="w-full py-3 bg-[#7C3AED] text-white font-semibold rounded-lg shadow-lg hover:bg-[#6D28D9]" onClick={(e)=>loginUser(e)}>Login</button>
        </form>
      </div>
    </div>
  );
}
