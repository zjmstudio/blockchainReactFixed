import React, { useState } from 'react'
import CoinItem from './CoinItem';

const CoinSearch = ({ coins }) => {
  const [searchText, setSearchText] = useState('')

  return (
    <div className='rounded-div my-4 border-none'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between pt-4 pb-8'>
  <h1 className='text-xl font-bold text-center md:text-left'>
    Coins by Market Cap
  </h1>

  <form className='w-[90%] mx-auto mt-[15px] md:mt-0 md:mx-0 md:w-auto'>
    <div className='relative w-full md:w-[320px]'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z'
        />
      </svg>

      <input
        onChange={(e) => setSearchText(e.target.value)}
        className='w-full rounded-2xl border border-[#d7dbe3] bg-white pl-10 pr-4 py-3 text-sm text-black outline-none transition focus:border-[#f7931a] focus:ring-2 focus:ring-[#f7931a]/20'
        type='text'
        placeholder='Search for a coin'
      />
    </div>
  </form>
</div>

      <table className='w-full border-collapse text-center'>
        <thead>
          <tr className='border-b text-gray-500 text-sm md:text-base'>
            <th></th>
            <th className='px-4'>Rank</th>
            <th className='text-left'>Name</th>
            <th></th>
            <th>Price</th>
            <th>24h</th>
            <th className='hidden md:table-cell'>24h Volume</th>
            <th className='hidden sm:table-cell'>Market Cap</th>
            <th>Last 7 Days</th>
          </tr>
        </thead>

        <tbody>
          {coins
            .filter((value) => {
              if (searchText === '') {
                return value;
              } else if (
                value.name.toLowerCase().includes(searchText.toLowerCase())
              ) {
                return value;
              }
              return false;
            })
            .map((coin) => (
              <CoinItem key={coin.id} coin={coin} />
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default CoinSearch