import {useEffect, useState} from 'react'
import {AuthContext} from './authContext.js'
export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
    const login=async(email,password)=>{
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
        const result=await response.json()
        if(!response.ok||!result.success){
            throw new Error(result.message||'Unable to login');
        }
        const loggedInUser=result.data.user
        setUser(loggedInUser)
        return loggedInUser
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
                setUser(null)
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
                setUser(null)
            }else {
                setUser(data2.data.user)
            }
} catch {
    setUser(null)
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
