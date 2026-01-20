import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiArrowUpRight, FiArrowDown } from 'react-icons/fi';
import './Featured.css';
import { Link } from 'react-router-dom';

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : 'N/A');

function Featured() {
  const [data, setData] = useState(null);
  const [errMsg, setErrMsg] = useState('');

  // IMPORTANT: call Netlify function, not CoinGecko directly
  const url = '/.netlify/functions/markets';

  useEffect(() => {
    let cancelled = false;

    setErrMsg('');
    axios
      .get(url)
      .then((response) => {
        if (cancelled) return;
        setData(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('featured markets fetch failed:', error);
        setErrMsg('Market data is temporarily unavailable.');
        setData([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return null;

  const safeCoin = (idx) => data?.[idx] ?? null;

  const Card = ({ idx }) => {
    const coin = safeCoin(idx);
    if (!coin) return null;

    const change = coin.price_change_percentage_24h;
    const isDown = Number.isFinite(change) ? change < 0 : false;

    return (
      <div className='card'>
        <div className='top'>
          <img src={coin.image} alt='' />
        </div>
        <div>
          <h5>{coin.name}</h5>
          <p className='featured-text'>
            ${coin.current_price != null ? coin.current_price.toLocaleString() : 'N/A'}
          </p>
        </div>

        {isDown ? (
          <span className='red'>
            <FiArrowDown className='icon' />
            {fmt(change, 2)}%
          </span>
        ) : (
          <span className='green'>
            <FiArrowUpRight className='icon' />
            {fmt(change, 2)}%
          </span>
        )}
      </div>
    );
  };

  return (
    <div className='featured'>
      <div className='container'>
        {/* Left Side */}
        <div className='left'>
          <h2 className='featured-text-h2'>Explore Bitcoin and crypto like Ethereum and Dogecoin</h2>
          <p className='featured-text'>Simply and securely buy, sell, and manage 100+ cryptos.</p>
          <Link to='/more-coins'>
            <button className='btn2_hero'>See More Coins</button>
          </Link>

          {errMsg ? <p className='featured-text' style={{ marginTop: 12 }}>{errMsg}</p> : null}
        </div>

        {/* Right Side */}
        <div className='right'>
          {/* Keep your same picks / indices */}
          <Card idx={0} />  {/* bitcoin */}
          <Card idx={1} />  {/* ethereum */}
          <Card idx={5} />  {/* XRP */}
          <Card idx={7} />  {/* cardano */}
          <Card idx={8} />  {/* dogecoin */}
          <Card idx={10} /> {/* solana */}
        </div>
      </div>
    </div>
  );
}

export default Featured;
