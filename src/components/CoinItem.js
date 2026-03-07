import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : 'N/A');

const CoinItem = ({ coin }) => {
  const [savedCoin, setSavedCoin] = useState(false);
  const { user } = UserAuth();

  const coinPath = doc(db, 'users', `${user?.email}`);

  const saveCoin = async () => {
    if (user?.email) {
      setSavedCoin(true);
      await updateDoc(coinPath, {
        watchList: arrayUnion({
          id: coin.id,
          name: coin.name,
          image: coin.image,
          rank: coin.market_cap_rank,
          symbol: coin.symbol,
        }),
      });
    } else {
      alert('Sign in to save a coin to your watchlist');
    }
  };

  const pct = coin?.price_change_percentage_24h;

  return (
    <tr className="h-[80px] border-b">
      <td onClick={saveCoin}>
        {savedCoin ? <AiFillStar /> : <AiOutlineStar />}
      </td>

      <td>{coin.market_cap_rank ?? '—'}</td>

      <td>
        <Link to={`/coin/${coin.id}`}>
          <div className="flex items-center">
            <img className="w-8 mr-2" src={coin.image} alt={coin.id} />
            <p className="hidden sm:table-cell">{coin.name}</p>
          </div>
        </Link>
      </td>

      <td>{coin.symbol?.toUpperCase()}</td>

      <td>${coin.current_price?.toLocaleString()}</td>

      <td className="px-[5px] min-w-[60px]">
        {Number.isFinite(pct) ? (
          <p className={`whitespace-nowrap text-sm ${pct > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {fmt(pct, 2)}%
          </p>
        ) : (
          <p className="text-gray-400 whitespace-nowrap text-sm">N/A</p>
        )}
      </td>

      <td className="w-[180px] hidden md:table-cell">
        ${coin.total_volume?.toLocaleString()}
      </td>

      <td className="w-[180px] hidden sm:table-cell">
        ${coin.market_cap?.toLocaleString()}
      </td>

      <td className="hidden sm:table-cell w-[90px] sm:w-auto">
        <Sparklines data={coin.sparkline_in_7d?.price ?? []}>
          <SparklinesLine color="teal" />
        </Sparklines>
      </td>
    </tr>
  );
};

export default CoinItem;