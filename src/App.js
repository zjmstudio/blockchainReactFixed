import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Featured from './components/Featured';
import Signup from './components/Signup';
import Footer from './components/Footer';

import MoreCoins from './components/pages/MoreCoins';
import Home from './components/pages/Home';
import MoreCoinsApp from './components/MoreCoinsApp';
import CoinPage from './components/CoinPage';
import TrendingCoins from './components/TrendingCoins';

import Signup1 from './routes/Signup1';
import Signin from './routes/Signin';
import Account from './routes/Account';

import { AuthContextProvider } from './context/AuthContext';

import axios from 'axios';

function App() {
  const [coins, setCoins] = useState([]);

  // IMPORTANT: never call CoinGecko directly from the browser in production
  const url = '/.netlify/functions/markets';

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        // Response should be an array of coins
        setCoins(Array.isArray(response.data) ? response.data : []);
      })
      .catch((err) => {
        console.error('markets fetch failed:', err);
        setCoins([]); // keep app stable
      });
  }, []); // do not include url here; it never changes

  return (
    <AuthContextProvider>
      <Navbar />

      <Routes>
        {/* Main home page */}
        <Route path='/' element={<Home coins={coins} />} />

        {/* Auth routes */}
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup1' element={<Signup1 />} />
        <Route path='/account' element={<Account />} />

        {/* Other pages */}
        <Route path='/hero' element={<Hero />} />
        <Route path='/featured' element={<Featured />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/trending-coins' element={<TrendingCoins />} />

        {/* Coins pages */}
        <Route path='/more-coins/*' element={<MoreCoins />} />
        <Route path='/more-coins-app/*' element={<MoreCoinsApp />} />
        <Route path='/coin/:coinId' element={<CoinPage />} />
      </Routes>

      <Footer />
    </AuthContextProvider>
  );
}

export default App;
