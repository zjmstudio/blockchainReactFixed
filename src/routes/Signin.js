import React, {useState} from 'react'
import { AiOutlineMail, AiFillLock } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom';
import {signIn, UserAuth} from '../context/AuthContext'

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {signIn} = UserAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await signIn(email,password);
      navigate('/account')
    } catch (e) {
      setError(e.message)
      console.log(e.message)
    }
  }

  return (
    <div>
      <div className='max-w-[400px] mx-auto min-h-[600px] px-4 py-20'>
        <h1 className='text-2xl font-bold'>Sign In</h1>
        <form onSubmit={handleSubmit}>
            <div className='my-4'>
                <label>Email</label>
                <div className='my-2 w-full relative rounded-2xl'>
                    <input onChange={(e) => setEmail(e.target.value)} className='signin-field' type='email'/>
                    <AiOutlineMail className='absolute right-2 top-3 text-gray-400' />
                </div>
            </div>
            <div className='my-4'>
              <label>Password</label>
              <div className='my-2 w-full relative rounded-2xl'>
                <input onChange={(e) => setPassword(e.target.value)}className='signin-field' type='password'/>
                <AiFillLock className='absolute right-2 top-3 text-gray-400'/>
              </div>
            </div>
            <button className='btn_signin'>Sign in</button>
        </form>
        <p className='my-4'>Don't have an account? <Link to='/signup1' className='font-semibold text-[#000]'>Sign up</Link></p>
      </div>
    </div>
  )
}

export default Signin
