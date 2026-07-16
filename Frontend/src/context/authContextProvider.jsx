import {createContext, useContext, useEffect, useState} from 'react'
import {AuthContext} from './authContext.js'
import { data, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
export const AuthProvider=({children})=>{
    const navigate=useNavigate()
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)
    const login=async(email,password)=>{
        try{
            const response=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/login`,{
                method:'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    email,password
                })
            })
            const data=await response.json()
            if(!data.success){
                throw new Error(data.message);

            }
            setUser(data.user)
        }catch (error){
            toast.error(error.message)
        }
    }
    useEffect(()=>{
    const verifyUser=async()=> {try {
            const response1=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/refresh-token`,{
                    method:'POST',
                    credentials:'include',
                    headers:{
                        'Content-Type':'application/json'
                    },
            });
            const data1=await response1.json()
            if(!data1.success) {
                navigate('/')
                return;
            }
            const response2=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/get-details`,{
                method:'GET',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
            })
            const data2=await response2.json();
            if(!data2.success){
                navigate('/');
                toast.error(data2.message)
            }else if(location.pathname==='/'||location.pathname==='/login'||location.pathname==='/register'){
                navigate('/dashboard')
                setUser(data2.user)
            }
} catch (error) {
    console.error("Unable to fetch details")
}}
verifyUser()
    },[])
    return(
    <AuthContext.Provider value={{ user, setUser, login}}>
      {children} 
    </AuthContext.Provider>
    )
}