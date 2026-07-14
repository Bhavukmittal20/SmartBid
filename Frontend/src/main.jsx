import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from 'react-router'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import {AuthProvider} from './context/authContextProvider.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthProvider>
  <ToastContainer />
    <App />
    </AuthProvider>
  </BrowserRouter>
)
