import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomeCoins from '../routes/HomeCoins';
import CoinPage from '../components/CoinPage';
import axios from 'axios';

// simple in-memory cache (prevents refetch on navigation)
let coinsCache = null;

function MoreCoinsApp() {
  const [coins, setCoins] = useState([]);

  const url =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=true';

  useEffect(() => {
    // if we already have data, reuse it
    if (coinsCache) {
      setCoins(coinsCache);
      return;
    }

    axios.get(url).then((response) => {
      coinsCache = response.data;
      setCoins(response.data);
    });
  }, []); // ✅ fetch ONCE

  return (
    <Routes>
      <Route path="/" element={<HomeCoins coins={coins} />} />
      <Route path="coin/:coinId" element={<CoinPage />} />
    </Routes>
  );
}

export default MoreCoinsApp;
