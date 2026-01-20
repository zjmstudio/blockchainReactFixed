import React from 'react'
import Navbar from '../Navbar';
import Hero from '../Hero';
import Featured from '../Featured';
import Signup from '../Signup';
import Footer from '../Footer';
import MoreCoins from '../pages/MoreCoins';
import TrendingCoins from '../TrendingCoins';


const Home = () => {
  return (
    <>
      
      <Hero />
      <Featured />
      <Signup />
      <TrendingCoins />
      
    </>
  )
}

export default Home
