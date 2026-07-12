import {createContext, useContext, useEffect, useState} from 'react'
export const AuthContext=createContext()
import { toast } from 'react-toastify'
export const useAuth=()=>{
    return useContext(AuthContext);
}