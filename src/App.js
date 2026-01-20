import React, { useEffect, useState } from 'react';
import { BrowserRouter, Router, Routes, Route, Link } from 
'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Featured from './components/Featured';
import Signup from './components/Signup';
import Footer from './components/Footer';
import MoreCoins from './components/pages/MoreCoins';
import Home from './components/pages/Home';
import MoreCoinsApp from './components/MoreCoinsApp';
import CoinPage from './components/CoinPage';
import axios from 'axios'
import HomeCoins from './routes/HomeCoins';
import TrendingCoins from './components/TrendingCoins';
import Signup1 from './routes/Signup1';
import Signin from './routes/Signin';
import Account from './routes/Account';
import { AuthContextProvider } from './context/AuthContext';




function App() {
  const [coins, setCoins] = useState([])
  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=true'

  


  useEffect(() => {
  axios.get(url).then((response) => {
    setCoins(response.data)
   // console.log(response.data)
  })
},[url])

  return (
    
   <AuthContextProvider>
    <Navbar/>
    
        <Routes>
          <Route path='/' element = {<Home/>} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup1' element={<Signup1 />} />
          <Route path='/account' element={<Account />} />
          <Route path='hero' element = {<Hero/>} />
          <Route path='featured' element = {<Featured/>}/>
          <Route path="/more-coins/*" element={<MoreCoins />} />
          <Route path='/more-coins-app' element={<MoreCoinsApp/>} />
          <Route path='/' element={<HomeCoins coins={coins} />} />

          <Route path='/coin/:coinId' element={<CoinPage />}>
            <Route path=':coinId' />
      </Route>
          <Route path='signup' element = {<Signup/>} />
          <Route path='trending-coins' element = {<TrendingCoins/>} />
           
        </Routes>
    <Footer/>    
    </AuthContextProvider> 
    
  );
}
   
export default App;
