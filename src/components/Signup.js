import React from 'react'
import './Signup.css'
import SignUpImage from '../assets/blockchainApp_graph.png'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className='signup'>
        <div className='container'>
        {/* left  */}
            <div className='left'>
                <img src={SignUpImage} alt='' />

            </div>

        {/* right  */}
        <div className='right'>

            <h2 className='signup-h2'>Buy, sell, and store over 100 cryptocurrencies</h2>
            <p className='signup-text'>From Bitcoin to Dogecoin, we make it easy to buy and sell cryptocurrency. Protect your crypto with best in class cold storage.</p>
            <div className='input-container'>
                <input className='input1' type='email' placeholder='Enter your email' />
                <Link to='/'><button className="btn2_hero">Learn More</button></Link>

            </div>
        </div>

        </div>
    </div>



       
  )
}

export default Signup
