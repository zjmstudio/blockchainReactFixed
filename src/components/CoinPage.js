import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import { API } from '../api';

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : 'N/A');

const money = (v) => {
  if (!Number.isFinite(v)) return 'N/A';

  const abs = Math.abs(v);

  if (abs >= 1) {
    return v.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (abs >= 0.01) {
    return v.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }

  if (abs >= 0.0001) {
    return v.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });
  }

  return v.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  });
};

const pctClass = (v) => {
  if (!Number.isFinite(v)) return 'text-gray-500';
  return v >= 0 ? 'text-green-600' : 'text-red-600';
};

const rangeConfig = {
  '1D': { label: '1 Day Performance' },
  '7D': { label: '7 Day Performance' },
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';

  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const AreaSparkline = ({ data }) => {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!Array.isArray(data) || data.length < 2) {
    return (
      <p className='px-5 pb-5 text-sm text-gray-500 md:px-6 md:pb-6'>
        Market data is temporarily unavailable.
      </p>
    );
  }

  const width = 900;
  const height = 260;
  const padTop = 16;
  const padBottom = 18;
  const chartHeight = height - padBottom;
  const bottomY = height;

  const min = Math.min(...data.map((pricePoint) => pricePoint.price));
  const max = Math.max(...data.map((pricePoint) => pricePoint.price));
  const range = max - min || 1;

  const points = data.map((pricePoint, index) => {
    const x = (index / (data.length - 1)) * width;
    const y =
      chartHeight - ((pricePoint.price - min) / range) * (chartHeight - padTop);
    return [x, y];
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1][0]} ${bottomY} L ${points[0][0]} ${bottomY} Z`;

  const hoveredPoint = hoverIndex !== null ? data[hoverIndex] : null;
  const hoveredCoords = hoverIndex !== null ? points[hoverIndex] : null;
  const tooltipPercent =
    hoveredCoords && width ? `${(hoveredCoords[0] / width) * 100}%` : '50%';

  const updateHoverFromClientX = (clientX, element) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = rect.width ? x / rect.width : 0;
    const index = Math.max(
      0,
      Math.min(data.length - 1, Math.round(percent * (data.length - 1)))
    );

    setHoverIndex(index);
  };

  return (
    <div className='relative h-full min-h-[190px] w-full overflow-hidden px-3 pb-3 pt-12 sm:min-h-[210px] sm:px-4 md:min-h-[230px] md:px-5'>
      {hoveredPoint && (
        <div
          className='pointer-events-none absolute top-2 z-10 max-w-[calc(100%-16px)] rounded-lg bg-black/90 px-2.5 py-1.5 text-[11px] text-white shadow sm:text-xs'
          style={{
            left: `clamp(78px, ${tooltipPercent}, calc(100% - 78px))`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className='whitespace-nowrap font-semibold'>
            {money(hoveredPoint.price)}
          </div>
          {hoveredPoint.timestamp && (
            <div className='mt-0.5 whitespace-nowrap text-white/80'>
              {formatTime(hoveredPoint.timestamp)}
            </div>
          )}
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className='block h-full w-full overflow-visible'
        preserveAspectRatio='none'
        aria-label='price chart'
        onMouseMove={(e) => updateHoverFromClientX(e.clientX, e.currentTarget)}
        onMouseLeave={() => setHoverIndex(null)}
        onTouchStart={(e) =>
          updateHoverFromClientX(e.touches[0].clientX, e.currentTarget)
        }
        onTouchMove={(e) =>
          updateHoverFromClientX(e.touches[0].clientX, e.currentTarget)
        }
        onTouchEnd={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id='coinAreaFill' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#f97316' stopOpacity='0.32' />
            <stop offset='100%' stopColor='#f97316' stopOpacity='0.05' />
          </linearGradient>

          <filter id='glow'>
            <feGaussianBlur stdDeviation='4' result='coloredBlur' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        <path
          d={areaPath}
          fill='url(#coinAreaFill)'
          style={{ transition: 'all 0.25s ease' }}
        />

        <path
          d={linePath}
          fill='none'
          stroke='#f97316'
          strokeWidth='6'
          opacity='0.22'
          filter='url(#glow)'
          style={{ transition: 'all 0.25s ease' }}
        />

        <path
          d={linePath}
          fill='none'
          stroke='#f97316'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
          style={{ transition: 'all 0.25s ease' }}
        />

        {hoverIndex !== null && hoveredCoords && (
          <>
            <line
              x1={hoveredCoords[0]}
              x2={hoveredCoords[0]}
              y1='0'
              y2={height}
              stroke='#9ca3af'
              strokeDasharray='4 4'
            />
            <circle
              cx={hoveredCoords[0]}
              cy={hoveredCoords[1]}
              r='5'
              fill='#f97316'
              stroke='white'
              strokeWidth='2'
            />
          </>
        )}
      </svg>
    </div>
  );
};

const CoinPage = () => {
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  const [activeRange, setActiveRange] = useState('7D');
  const [oneDayChart, setOneDayChart] = useState([]);
  const [oneDayLoading, setOneDayLoading] = useState(false);

  const { coinId } = useParams();
  const coinUrl = API.coin(coinId ?? '');

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setErrMsg('');
    setCoin(null);
    setOneDayChart([]);

    axios
      .get(coinUrl)
      .then((response) => {
        if (cancelled) return;
        setCoin(response.data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('coin fetch failed:', err);
        setErrMsg(
          'Coin data is temporarily unavailable. Please refresh in a moment.'
        );
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [coinUrl]);

  useEffect(() => {
    let cancelled = false;

    const loadOneDayChart = async () => {
      if (!coinId) return;
      if (activeRange !== '1D') return;
      if (oneDayChart.length > 1) return;

      setOneDayLoading(true);

      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days: 1,
            },
          }
        );

        if (cancelled) return;

        const prices = Array.isArray(response.data?.prices)
          ? response.data.prices.map(([timestamp, price]) => ({
              price,
              timestamp,
            }))
          : [];

        setOneDayChart(prices);
      } catch (err) {
        if (cancelled) return;
        console.error('1D chart fetch failed:', err);
        setOneDayChart([]);
      } finally {
        if (cancelled) return;
        setOneDayLoading(false);
      }
    };

    loadOneDayChart();

    return () => {
      cancelled = true;
    };
  }, [coinId, activeRange, oneDayChart.length]);

  const spark7d = coin?.market_data?.sparkline_7d?.price ?? [];

  const activeChartData = useMemo(() => {
    if (activeRange === '1D') {
      return oneDayChart;
    }

    return Array.isArray(spark7d) ? spark7d.map((price) => ({ price })) : [];
  }, [activeRange, oneDayChart, spark7d]);

  const price = coin?.market_data?.current_price?.usd;
  const marketCap = coin?.market_data?.market_cap?.usd;
  const volume24h = coin?.market_data?.total_volume?.usd;
  const high24h = coin?.market_data?.high_24h?.usd;
  const low24h = coin?.market_data?.low_24h?.usd;

  const pct24h = coin?.market_data?.price_change_percentage_24h;
  const pct7d = coin?.market_data?.price_change_percentage_7d;
  const pct14d = coin?.market_data?.price_change_percentage_14d;
  const pct30d = coin?.market_data?.price_change_percentage_30d;
  const pct60d = coin?.market_data?.price_change_percentage_60d;
  const pct1y = coin?.market_data?.price_change_percentage_1y;

  const rangePct = activeRange === '1D' ? pct24h : pct7d;

  if (loading) {
    return (
      <div className='rounded-div my-12 border-none py-8'>
        <p className='text-gray-500'>Loading coin…</p>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className='rounded-div my-12 border-none py-8'>
        <p className='text-red-500'>{errMsg}</p>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className='rounded-div my-12 border-none py-8'>
        <p className='text-gray-500'>No coin data.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Market Cap', value: money(marketCap) },
    { label: 'Volume (24h)', value: money(volume24h) },
    { label: '24h High', value: money(high24h) },
    { label: '24h Low', value: money(low24h) },
    { label: 'Market Rank', value: coin.market_cap_rank ?? 'N/A' },
    { label: 'Hashing Algorithm', value: coin.hashing_algorithm ?? 'N/A' },
    { label: 'Trust Score', value: fmt(coin?.liquidity_score, 2) },
    { label: 'Symbol', value: coin.symbol?.toUpperCase() ?? 'N/A' },
  ];

  const performanceCards = [
    { label: '24h Change', value: `${fmt(pct24h, 2)}%`, raw: pct24h },
    { label: '7d Change', value: `${fmt(pct7d, 2)}%`, raw: pct7d },
    { label: '14d Change', value: `${fmt(pct14d, 2)}%`, raw: pct14d },
    { label: '30d Change', value: `${fmt(pct30d, 2)}%`, raw: pct30d },
    { label: '60d Change', value: `${fmt(pct60d, 2)}%`, raw: pct60d },
    { label: '1y Change', value: `${fmt(pct1y, 2)}%`, raw: pct1y },
  ];

  return (
    <div className='rounded-div my-12 border-none py-8'>
      <div className='grid grid-cols-12 items-stretch gap-8'>
        <div className='col-span-12 rounded-3xl border border-[#f2e2c7] bg-[#fff9f2] px-6 py-6 shadow-sm md:px-8 md:py-7 lg:col-span-4'>
          <div className='flex items-center gap-5'>
            <img
              className='h-16 w-16 md:h-20 md:w-20'
              src={coin.image?.large}
              alt={coin?.name ?? 'coin'}
            />

            <div className='min-w-0'>
              <p className='text-3xl font-bold leading-tight md:text-4xl'>
                {coin?.name}
              </p>

              <div className='mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600 md:text-base'>
                <span className='font-medium'>
                  {coin.symbol?.toUpperCase()} / USD
                </span>
                <span className='inline-block h-1 w-1 rounded-full bg-gray-400'></span>
                <span>Rank #{coin.market_cap_rank ?? 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className='mt-5 min-w-0'>
            <p className='text-sm uppercase tracking-wide text-gray-500'>
              Current Price
            </p>

            <p className='mt-1 max-w-full break-all text-[clamp(1.6rem,4.2vw,2.6rem)] font-bold leading-none'>
              {money(price)}
            </p>

            <div className='mt-2'>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                  Number.isFinite(pct24h)
                    ? pct24h >= 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                24h {Number.isFinite(pct24h) ? `${fmt(pct24h, 2)}%` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className='col-span-12 flex flex-col overflow-hidden rounded-3xl border border-[#ececec] bg-white pt-5 shadow-sm md:pt-6 lg:col-span-8'>
          <div className='mb-4 flex items-start justify-between gap-4 px-5 md:px-6'>
            <div className='flex flex-wrap gap-2'>
              {Object.keys(rangeConfig).map((range) => (
                <button
                  key={range}
                  type='button'
                  onClick={() => setActiveRange(range)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition md:text-sm ${
                    activeRange === range
                      ? 'bg-[#14b8a6] text-white'
                      : 'bg-[#f3f4f6] text-gray-600 hover:bg-[#e7e7e7]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <div className='text-right'>
              <p className='text-sm uppercase tracking-wide text-gray-500'>
                {rangeConfig[activeRange].label}
              </p>
              <p className={`mt-1 font-semibold ${pctClass(rangePct)}`}>
                {Number.isFinite(rangePct) ? `${fmt(rangePct, 2)}%` : 'N/A'}
              </p>
            </div>
          </div>

          <div className='flex-1'>
            {activeRange === '1D' && oneDayLoading ? (
              <p className='px-5 pb-5 text-sm text-gray-500 md:px-6 md:pb-6'>
                Loading chart…
              </p>
            ) : activeChartData.length > 1 ? (
              <AreaSparkline key={activeRange} data={activeChartData} />
            ) : (
              <p className='px-5 pb-5 text-sm text-gray-500 md:px-6 md:pb-6'>
                Market data is temporarily unavailable.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className='mt-8 grid gap-8 lg:grid-cols-2'>
        <div className='rounded-3xl border border-[#ececec] bg-white p-5 shadow-sm md:p-6'>
          <p className='mb-4 text-xl font-bold'>Market Stats</p>

          <div className='grid grid-cols-2 gap-4'>
            {statCards.map((item) => (
              <div key={item.label} className='min-w-0 rounded-xl border p-4'>
                <p className='text-sm text-gray-500'>{item.label}</p>
                <p className='mt-1 break-words font-semibold'>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-3xl border border-[#ececec] bg-white p-5 shadow-sm md:p-6'>
          <p className='mb-4 text-xl font-bold'>Performance</p>

          <div className='grid grid-cols-2 gap-4'>
            {performanceCards.map((item) => (
              <div key={item.label} className='min-w-0 rounded-xl border p-4'>
                <p className='text-sm text-gray-500'>{item.label}</p>
                <p
                  className={`mt-1 break-words font-semibold ${pctClass(
                    item.raw
                  )}`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='mt-8 rounded-3xl border border-[#ececec] bg-white p-5 shadow-sm md:p-6'>
        <p className='mb-4 text-2xl font-bold'>About {coin.name}</p>

        <div
          className='leading-7 text-gray-700'
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(coin.description?.en ?? ''),
          }}
        />
      </div>
    </div>
  );
};

export default CoinPage;