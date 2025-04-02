import React from 'react'
import { useAuth } from '../../context/AuthContext/AuthContext'
import { useNavigate } from 'react-router-dom'
import MovieCard from '../../components/MovieCard/MovieCard';

const Home = () => {
  const { user , logout } = useAuth();
  const navigate = useNavigate();

  if (!user){
    navigate('/login');
    return null
  }

  return (
    <div className='p-4'>
        <h1 className='text-2xl'>Hello, {user.displayName}</h1>
        <button onClick={logout} className='bg-red-500 text-white px-4 py-2 mt-4 rounded'>
            Logout
        </button>
        <MovieCard/>
    </div>
  )
}

export default Home
