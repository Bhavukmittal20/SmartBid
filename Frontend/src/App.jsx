import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Route,Routes } from 'react-router'
import SmartBidLanding from './pages/LandingPage'
import Title from './components/Title'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Registration'
import Dashboard from './pages/Dashboard'
import Footer from './components/Footer'
function App() {
  return (
    <div>
    <Title />
    <Routes>
      <Route path='/' element={<SmartBidLanding />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
    <Footer />
    </div>
  )
}

export default App
