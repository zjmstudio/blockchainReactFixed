import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : 'N/A');

const CoinPage = () => {
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  const { coinId } = useParams();

  // IMPORTANT: proxy through Netlify function (no direct CoinGecko calls in browser)
  const url = `/.netlify/functions/coin?id=${encodeURIComponent(coinId ?? '')}`;

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setErrMsg('');
    setCoin(null);

    axios
      .get(url)
      .then((response) => {
        if (cancelled) return;
        setCoin(response.data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('coin fetch failed:', err);
        setErrMsg('Coin data is temporarily unavailable.  Please refresh in a moment.');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (loading) {
    return (
      <div className='rounded-div my-12 py-8 border-none'>
        <p className='text-gray-500'>Loading coin…</p>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className='rounded-div my-12 py-8 border-none'>
        <p className='text-red-500'>{errMsg}</p>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className='rounded-div my-12 py-8 border-none'>
        <p className='text-gray-500'>No coin data.</p>
      </div>
    );
  }

  return (
    <div className='rounded-div my-12 py-8 border-none'>
      <div className='flex py-8'>
        <img className='w-20 mr-8' src={coin.image?.large} alt={coin?.name ?? 'coin'} />
        <div>
          <p className='text-3xl font-bold'>{coin?.name}</p>
          <p>({coin.symbol?.toUpperCase()} / USD)</p>
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-8'>
        <div>
          <div className='flex justify-between'>
            {coin.market_data?.current_price?.usd != null && (
              <p className='text-3xl font-bold'>
                ${coin.market_data.current_price.usd.toLocaleString()}
              </p>
            )}
            <p>7 Day</p>
          </div>

          <Sparklines data={coin.market_data?.sparkline_7d?.price ?? []}>
            <SparklinesLine color='teal' />
          </Sparklines>

          <div className='flex justify-between py-4'>
            <div>
              <p className='text-gray-500 text-sm'>Market Cap</p>
              <p>${coin.market_data?.market_cap?.usd?.toLocaleString?.() ?? 'N/A'}</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Volume (24h)</p>
              <p>${coin.market_data?.total_volume?.usd?.toLocaleString?.() ?? 'N/A'}</p>
            </div>
          </div>

          <div className='flex justify-between py-4'>
            <div>
              <p className='text-gray-500 text-sm'>24h High</p>
              <p>${coin.market_data?.high_24h?.usd?.toLocaleString?.() ?? 'N/A'}</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>24h Low</p>
              <p>${coin.market_data?.low_24h?.usd?.toLocaleString?.() ?? 'N/A'}</p>
            </div>
          </div>
        </div>

        <div>
          <p className='text-xl font-bold'>Market Stats</p>

          <div className='flex justify-between py-4'>
            <div>
              <p className='text-gray-500 text-sm'>Market Rank</p>
              <p>{coin.market_cap_rank ?? 'N/A'}</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Hashing Algorithm</p>
              <p>{coin.hashing_algorithm ?? 'N/A'}</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Trust Score</p>
              <p>{fmt(coin?.liquidity_score, 2)}</p>
            </div>
          </div>

          <div className='flex justify-between py-4'>
            <div>
              <p className='text-gray-500 text-sm'>Price Change (24h)</p>
              <p>{fmt(coin.market_data?.price_change_percentage_24h, 2)}%</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Price Change (7d)</p>
              <p>{fmt(coin.market_data?.price_change_percentage_7d, 2)}%</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Price Change (14d)</p>
              <p>{fmt(coin.market_data?.price_change_percentage_14d, 2)}%</p>
            </div>
          </div>

          <div className='flex justify-between py-4'>
            <div>
              <p className='text-gray-500 text-sm'>Price Change (30d)</p>
              <p>{fmt(coin.market_data?.price_change_percentage_30d, 2)}%</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Price Change (60d)</p>
              <p>{fmt(coin.market_data?.price_change_percentage_60d, 2)}%</p>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Price Change (1y)</p>
              <p>{fmt(coin.market_data?.price_change_percentage_1y, 2)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className='py-8'>
        <p className='text-xl font-bold pb-2'>About {coin.name}</p>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(coin.description?.en ?? ''),
          }}
        />
      </div>
    </div>
  );
};

export default CoinPage;
