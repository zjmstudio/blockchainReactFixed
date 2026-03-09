import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomeCoins from '../routes/HomeCoins';
import CoinPage from '../components/CoinPage';
import axios from 'axios';
import { API } from '../api';

// simple in-memory cache (prevents refetch on navigation)
let coinsCache = null;

function MoreCoinsApp() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  const url = API.markets;

  useEffect(() => {
    let cancelled = false;

    if (coinsCache) {
      setCoins(coinsCache);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrMsg('');

    axios
  .get(url, {
    headers: {
      'x-cg-demo-api-key': process.env.REACT_APP_COINGECKO_KEY
    }
  })
      .then((response) => {
        if (cancelled) return;

        const list = Array.isArray(response.data) ? response.data : [];
        coinsCache = list;
        setCoins(list);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('markets fetch failed:', err);
        setErrMsg('Market data is temporarily unavailable. Please refresh in a moment.');
        setCoins([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <Routes>
      <Route
        index
        element={<HomeCoins coins={coins} loading={loading} errMsg={errMsg} />}
      />
      <Route path="coin/:coinId" element={<CoinPage />} />
    </Routes>
  );
}

export default MoreCoinsApp;