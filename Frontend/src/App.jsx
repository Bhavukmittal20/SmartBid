import './App.css'
import { Route,Routes } from 'react-router'
import SmartBidLanding from './pages/LandingPage'
import Title from './components/Title'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Registration'
import Dashboard from './pages/Dashboard'
import Footer from './components/Footer'
import Auctions from './pages/Auctions'
import AuctionDetails from './pages/Auctiondetails'
import CreateAuction from './pages/CreateAuction'
import Category from './pages/Category'
function App() {
  return (
    <div>
    <Title />
    <Routes>
      <Route path='/' element={<SmartBidLanding />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/auction' element={<Auctions />} />
      <Route path="/auction/:id" element={<AuctionDetails />} />
      <Route path="/create-auction" element={<CreateAuction />} />
      <Route path="/categories" element={<Category />} />
    </Routes>
    <Footer />
    </div>
  )
}

export default App
