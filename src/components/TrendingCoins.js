import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from "../api";

const TrendingCoins = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // API helper automatically switches between CoinGecko (local) and Netlify (production)
  const url = API.trending;

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setErrMsg('');

    axios
      .get(url)
      .then((response) => {
        if (cancelled) return;
        const coins = response.data?.coins ?? [];
        setTrending(coins);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('trending fetch failed:', err);
        setErrMsg('Trending data unavailable.');
        setTrending([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  if (loading) {
    return (
      <div className='rounded-div my-12 py-8 text-primary border-none'>
        <h1 className='trending-coins-h1'>Trending Coins</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className='rounded-div my-12 py-8 text-primary border-none'>
        <h1 className='trending-coins-h1'>Trending Coins</h1>
        <p className='text-red-500'>{errMsg}</p>
      </div>
    );
  }

return (
  <div className="rounded-div my-12 py-8 text-primary border-none">
    <div className="px-4 md:px-0">
      <h1 className="trending-coins-h1">Trending Coins</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trending.slice(0, isMobile ? 6 : 9).map((coin) => (
          <div key={coin.item.id} className="card-trending">
            <div className="flex w-full items-center justify-between">
              <div className="flex">
                <img className="mr-4 rounded-full" src={coin.item?.small} alt={coin.item?.name} />
                <div>
                  <p className="font-bold">{coin.item?.name}</p>
                  <p>{coin.item?.symbol}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
);
};

export default TrendingCoins;