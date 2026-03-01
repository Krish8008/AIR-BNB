import { useState, useEffect  } from 'react'
import './App.css'
import Navbar from './Navbar/Navabar'
import ListingCard from './Listings/index'
import Footer from './Navbar/Footer/Footer'

function App() {
  
  

  return (
    <>
      <Navbar/>
      <div className="max-w-7xl mx-auto px-6 mt-8"></div>
      <div className="flex gap-8 flex-wrap">
      
          <ListingCard />
        </div>

      <Footer/>
    </>
  )
}

export default App
