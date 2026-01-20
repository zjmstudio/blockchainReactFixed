import React from 'react'
import CoinSearch from './CoinSearch';


const HomeCoins = ({coins}) => {
  return (
    <div>
      <CoinSearch coins={coins}/>
    </div>
  )
}

export default HomeCoins
