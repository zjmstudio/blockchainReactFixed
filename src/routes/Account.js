import React from 'react'
import SavedCoin from '../components/SavedCoin'
import { UserAuth } from '../context/AuthContext'
import {Navigate, useNavigate} from 'react-router-dom'

const Account = () => {
  const {user, logout} = UserAuth()
  const navigate = useNavigate()

const handleSignOut = async () => {
  try {
    await logout()
    navigate('/')
  } catch (e) {
    console.log(e.message)
  }
}

if (user) {
  return (
    <div className='max-w-[1140px] mx-auto'>
      <div className='account-box'>
        <div>
            <h1 className='text-2xl font-bold py-4'>Account</h1>
            <div>
                <p>Welcome, {user?.email}</p>
            </div>
        </div>
        <div>
            <button onClick={handleSignOut} className='account-btn'>Sign Out</button>
        </div>
      </div>
      <div className='account-box'>
        <div className='w-full min-h-[300px]'>
            <h1 className='text-2xl font-bold py-4'>Watch List</h1>
            <SavedCoin />
        </div>
      </div>
    </div>
  ) 
} else {
  return <Navigate to='/signin'/>
}

  
};

export default Account;
