import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext/AuthContext'
import { useNavigate } from 'react-router-dom';
const Login = () => {

  const { user , login} = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    if(user) {
      navigate('/')
    }
  },[user, navigate])
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-3xl mb-4'>Welcome to CineHunt</h1>
        <button onClick={login} className='bg-blue-500 text-white px-4 py-2'>
            Sign in with Google
        </button>
    </div>
  );
};

export default Login
