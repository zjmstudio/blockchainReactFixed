import React from 'react'
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Featured from './components/Featured';
import Signup from './components/Signup';
import Footer from './components/Footer';
import TrendingCoins from '../components/TrendingCoins';

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Featured />
      <Signup />
      <TrendingCoins />
      <Footer />
    </>
  )
}

export default Home
