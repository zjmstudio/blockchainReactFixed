import React from 'react'
import CoinSearch from '../components/CoinSearch'


const HomeCoins = ({coins}) => {
  return (
    <div>
      <CoinSearch coins={coins}/>
    </div>
  )
}

export default HomeCoins
