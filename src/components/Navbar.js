import React , {useState} from 'react'
import { Link, useNavigate} from 'react-router-dom';
import Logo from '../images/blockchain_logo.svg';
import {FaBars, FaTimes} from 'react-icons/fa';
import './Navbar.css';
import {UserAuth} from '../context/AuthContext';



const Navbar = () => {
const [click, setClick] = useState(false);
const handleClick = () => setClick(!click);

const {user, logout} = UserAuth();
const navigate = useNavigate();


const handleSignOut = async () => {
    try {
      await logout()
      navigate('/')
    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <div className='header'>
        <div className='container'>
        <Link to='/'><img width="189px" height="auto" src={Logo}  alt="logo" /></Link>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>

            
            <li className='nav-hover'>
                <a href='/more-coins'>All Coins</a>
            </li>
            <li className='nav-hover'>
                <a href='https://www.zjmstudio.com/'>Developer</a>
            </li>
            <li className='nav-hover'>
                <a href='/'>News</a>
            </li>
            <li className='nav-hover'>
                <a href='/'>Contact</a>
            </li>

           

<div className='btn-group-hidden'>
{user?.email ? (
            <div className='btn-group-hidden'>
                <Link to='/account' className='btn_mobile'>Account</Link>
                <button onClick={handleSignOut} className='btn_mobile'>Sign out</button>
            </div>
        ) : (<div>
            <span className='hidden-nav-item'><Link to='signin'><li><button onClick={handleClick} className='btn_mobile'>Login</button></li></Link></span>
            <span className='hidden-nav-item'><Link to='signup1'><li><button onClick={handleClick} className='btn2_mobile'>Sign up</button></li></Link></span>
        </div>)}
</div>
            {/*<span className='hidden-nav-item'><Link to='signin'><li><button className='btn_mobile'>Login</button></li></Link></span>
            <span className='hidden-nav-item'><Link to='signup1'><li><button className='btn2_mobile'>Sign up</button></li></Link></span>*/}
        </ul>   
      {/*}  <div className="btn-group">
            <Link to='signin'><button className='btn'>Login</button></Link>
            <Link to='signup1'><button className='btn2'>Sign up</button></Link>
  </div>*/}
        {user?.email ? (
            <div>
                <Link to='/account' className='btn'>Account</Link>
                <button onClick={handleSignOut} className='btn'>Sign out</button>
            </div>
        ) : (<div className="btn-group">
            <Link to='signin'><button onClick={handleClick} className='btn'>Login</button></Link>
            <Link to='signup1'><button onClick={handleClick} className='btn2'>Sign up</button></Link>
        </div>)}


        <div className='hamburger' onClick={handleClick}>
            {click ? (<FaTimes size={20} style={{color: '#333'}}/>) : (<FaBars size={20} style={{color: '#333'}}/>)}
            
        </div>
     </div>
</div>


//mobile menu


  )
}

export default Navbar
