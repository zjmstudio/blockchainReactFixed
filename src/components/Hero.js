import React from 'react'
import './Hero.css'
import heroImage from '../assets/hero_image.png'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='hero'>
      <div className='container'>

            {/*Left Side */}
            <div className='left'>
                {/*<p className='hero-text-1'>The freedom of crypto for everyone, everywhere</p>*/}
                <h1 className='hero-title-h1'>Own Your Future. Secure Your Wealth.</h1>
                <p className='hero-text-2'>Sign up now to build your own crypto portfolio for free!</p>
                <div className='input-container'>
                    {/*<input className='input1' type='email' placeholder='Enter your email' />*/}
                    <Link to='/signup1'><button className='btn2_hero'>Get Started</button></Link>
                </div>

            </div>

            {/*Right Side */}
            <div className='right'>
                <div className='img-container'>
                    <img src={heroImage} alt=''/>
                </div>

            </div>


      </div>
    </div>
  )
}

export default Hero
