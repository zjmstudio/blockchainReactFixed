

import React, {useState, useEffect}  from 'react'
import axios from 'axios'
import {FiArrowUpRight, FiArrowDown} from 'react-icons/fi'
import './Featured.css'
import { Link } from "react-router-dom";

const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : "N/A");


function Featured() {

    const [data, setData] = useState(null);

    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false';

    useEffect(() => {
        axios.get(url).then((response) => {
            setData(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    console.log(data);
    if (!data)
        return null;

    return (
        <div className='featured'>
            <div className='container'>

                {/*Left Side */}
                <div className='left'>
                    <h2 className='featured-text-h2'>Explore Bitcoin and crypto like Ethereum and Dogecoin</h2>
                    <p className='featured-text'>Simply and securely buy, sell, and manage 100+ cryptos.</p>
                    <Link to='/more-coins'><button className='btn2_hero'>See More Coins</button></Link>
                </div>

                {/*Right Side */}
                <div className='right'>

                    {/*bitcoin*/}

                    <div className="card">
                        <div className='top'>
                            {/*<img src={BTC} alt=''/>*/}
                            <img src={data[0].image} alt='' />
                        </div>
                        <div>
                            <h5>{data[0].name}</h5>
                            <p className='featured-text'>${data[0].current_price.toLocaleString()}</p>
                        </div>

                        {data[0].price_change_percentage_24h < 0 ? (
                            <span className="red">
                                <FiArrowDown className='icon' />
                                {data[0].price_change_percentage_24h.toFixed(2)}%
                            </span>
                        ) : (
                            <span className='green'>
                                <FiArrowUpRight className='icon' />
                                {data[0].price_change_percentage_24h.toFixed(2)}%
                            </span>
                        )}
                    </div>

                    {/*ethereum*/}

                    <div className="card">
                        <div className='top'>

                            <img src={data[1].image} alt='' />
                        </div>
                        <div>
                            <h5>{data[1].name}</h5>
                            <p className='featured-text'>${data[1].current_price.toLocaleString()}</p>
                        </div>

                        {data[1].price_change_percentage_24h < 0 ? (
                            <span className="red">
                                <FiArrowDown className='icon' />
                                {data[1].price_change_percentage_24h.toFixed(2)}%
                            </span>
                        ) : (
                            <span className='green'>
                                <FiArrowUpRight className='icon' />
                                {data[1].price_change_percentage_24h.toFixed(2)}%
                            </span>
                        )}
                    </div>

                    {/*XRP*/}

                    <div className="card">
                        <div className='top'>
                            <img src={data[5].image} alt='' />
                        </div>
                        <div>
                            <h5>{data[5].name}</h5>
                            <p className='featured-text'>${data[5].current_price.toLocaleString()}</p>
                        </div>

                        {data[5].price_change_percentage_24h < 0 ? (
                            <span className="red">
                                <FiArrowDown className='icon' />
                                {data[5].price_change_percentage_24h.toFixed(2)}%
                            </span>
                        ) : (
                            <span className='green'>
                                <FiArrowUpRight className='icon' />
                                {data[5].price_change_percentage_24h.toFixed(2)}%
                            </span>
                        )}
                    </div>

                    {/*cardano*/}

                    <div className="card">
                        <div className='top'>
                            <img src={data[7].image} alt='' />
                        </div>
                        <div>
                            <h5>{data[7].name}</h5>
                            <p className='featured-text'>${data[7].current_price.toLocaleString()}</p>
                        </div>

                        {data[7].price_change_percentage_24h < 0 ? (
                            <span className="red">
                                <FiArrowDown className='icon' />
                                {data[7].price_change_percentage_24h.toFixed(2)}%
                            </span>
                        ) : (
                            <span className='green'>
                                <FiArrowUpRight className='icon' />
                                {data[7].price_change_percentage_24h.toFixed(2)}%
                            </span>
                        )}
                    </div>

                    {/*dogecoin*/}

                    <div className="card">
                        <div className='top'>
                            <img src={data[8].image} alt='' />
                        </div>
                        <div>
                            <h5>{data[8].name}</h5>
                            <p className='featured-text'>${data[8].current_price.toLocaleString()}</p>
                        </div>

                        {data[8].price_change_percentage_24h < 0 ? (
                            <span className="red">
                                <FiArrowDown className='icon' />
                                {data[8].price_change_percentage_24h.toFixed(2)}%
                            </span>
                        ) : (
                            <span className='green'>
                                <FiArrowUpRight className='icon' />
                                {data[8].price_change_percentage_24h.toFixed(2)}%
                            </span>
                        )}
                    </div>

                    {/*solana*/}

                    <div className="card">
                        <div className='top'>
                            <img src={data[10].image} alt='' />
                        </div>
                        <div>
                            <h5>{data[10].name}</h5>
                            <p className='featured-text'>${data[10].current_price.toLocaleString()}</p>
                        </div>

                        {data[10].price_change_percentage_24h < 0 ? (
                            <span className="red">
                                <FiArrowDown className='icon' />
                                {fmt(data?.[10]?.price_change_percentage_24h, 2)}%
                            </span>
                        ) : (
                            <span className='green'>
                                <FiArrowUpRight className='icon' />
                                {fmt(data?.[10]?.price_change_percentage_24h, 2)}%
                            </span>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Featured
