import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrendingCoins = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  // IMPORTANT: proxy through Netlify
  const url = '/.netlify/functions/trending';

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
  }, []);

  if (loading) {
    return (
      <div className='rounded-div my-12 py-8 text-primary border-none'>
        <h1 className='trending-coins-h1'>Trending Coins</h1>
        <p>Loading…</p>
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
    <div className='rounded-div my-12 py-8 text-primary border-none'>
      <h1 className='trending-coins-h1'>Trending Coins</h1>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {trending.map((coin, idx) => (
          <div key={idx} className='card-trending'>
            <div className='flex w-full items-center justify-between'>
              <div className='flex'>
                <img
                  className='mr-4 rounded-full'
                  src={coin.item?.small}
                  alt={coin.item?.name}
                />
                <div>
                  <p className='font-bold'>{coin.item?.name}</p>
                  <p>{coin.item?.symbol}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCoins;
