import {createContext, useContext, useEffect, useState} from 'react'
import {AuthContext} from './authContext.js'
export const AuthProvider=({children})=>{
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
                throw new Error(data.message)
            }
            setUser(data.user)
        }catch (error){
            toast.error(error.message)
        }
    }
    return(
    <AuthContext.Provider value={{ user, setUser, login}}>
      {children} 
    </AuthContext.Provider>
    )
}