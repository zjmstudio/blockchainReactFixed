import React from 'react'
import Logo from '../images/blockchain_logo.svg';
import {FaFacebook, FaGithub, FaLinkedin, FaTwitter} from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  return (
    <div className='footer'>
        <div className='container'>
            <div className='col col-1'>
                <img width="189px" height="auto" src={Logo}  alt="logo" />
            </div>
            <div className='col'>
                <h5>Support</h5>
                <span className='bar'></span>
                    <a className='footer-text'href='/'>Contact Us</a>
                    <a className='footer-text'href='/'>Chat</a>
                    <a className='footer-text'href='/'>Help Center</a>
                    <a className='footer-text'href='/'>FAQ</a>
                
            </div>

            <div className='col'>
                <h5>Developer</h5>
                <span className='bar'></span>
                    <a className='footer-text'href='https://www.zjmstudio.com/'>ZJM Studio</a>
                    <a className='footer-text'>Blockchain</a>
                    <a className='footer-text'>Ver 3.0</a>
                    <a className='footer-text'>© 2023 Blockchain</a>
                
            </div>

            <div className='col'>
                <h5>Company</h5>
                <span className='bar'></span>
                    <a className='footer-text' href='/'>About</a>
                    <a className='footer-text'href='/'>Blog</a>
                    <a className='footer-text'href='/'>Legal</a>
                    <a className='footer-text'href='/'>Privacy</a>
                
            </div>

            <div className='col'>
                <h5>Social</h5>
                <span className='bar'></span>
                    <a className='footer-text'href='/'><FaFacebook className='footericon'/></a>
                    <a className='footer-text'href='/'><FaTwitter className='footericon'/></a>
                    <a className='footer-text'href='/'><FaLinkedin className='footericon'/></a>
                    <a className='footer-text'href='/'><FaGithub className='footericon'/></a>
                
            </div>

        </div>
      
    </div>
  )
}

export default Footer
