import React from 'react';
import { Gavel, ArrowLeft, Mail, Lock, User, Phone } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios'
export default function RegisterPage() {
  const registerUser=async (e)=>{
try {
  e.preventDefault()
      if(password!==confirmPassword){
        console.log('Passwords do not match');
        return ;
      }
      if([fullname,email,password].some((field)=>field?.trim()=="")){
        console.log('All Fields are compulsory.')
        return;
      }
      const response=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/register`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          fullname,email,password
        })
      })
      const data=await response.json()
      if(!data.success){
        console.log(response.message)
      }else{
        console.log('Success!')
      }
} catch (error) {
  console.log(error)
}

  }
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [fullname,setFullName]=useState('');
  // Input class jo autofill ko handle karegi
  const inputClass = "w-full pl-10 pr-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-[#7C3AED] transition-colors [&:-webkit-autofill]:[box-shadow:0_0_0px_1000px_#1E293B_inset] [&:-webkit-autofill]:[!text-white] [&:-webkit-autofill]:[caret-color:white]";
  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-[#0B101A] text-slate-200 font-sans p-6 overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#7C3AED]/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#2563EB]/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#0F172A]/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-[#7C3AED] p-2 rounded-lg"> <Gavel className="w-5 h-5 text-white" /> </div>
          <span className="text-xl font-bold text-white">SmartBid</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

        <form className="space-y-4">
          {/* Inputs */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
              <input type="text" placeholder="John Doe" className={inputClass} onChange={(e)=>(setFullName(e.target.value))}/>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
              <input type="email" placeholder="you@example.com" onChange={(e)=>(setEmail(e.target.value))} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                <input type="password" placeholder="••••" onChange={(e)=>(setPassword(e.target.value))} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Confirm</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                <input type="password" placeholder="••••" className={inputClass} onChange={(e)=>(setConfirmPassword(e.target.value))} />
              </div>
            </div>
          </div>

          {/* Custom Radio Group */}
          <div>
          </div>

          <button className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all" onClick={registerUser}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}