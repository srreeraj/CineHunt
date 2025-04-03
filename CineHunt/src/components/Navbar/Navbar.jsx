import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Search,Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className='bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white shadow-lg'>
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className='text-2xl font-bold tracking-wide text-red-500'>
                CineHunt
            </Link>

            {/* Drop Menu */}
            <div className="hidden md:flext items-center space-x-6">
                <Link to="/" className='hover:text-red-500 transition duration-300 font-medium'>
                    Home
                </Link>
            </div>

            {/* Search and Profile */}
            <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                    <input t
                        ype="text" 
                        placeholder='Search...'  
                        className='bg-gray-800 text-white rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-red-500'
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18}/>
                </div>
                <div className="relative">
                    <User className='hover:cursor-pointer' size={20}/>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <button
                className='md:hidden text-white focus:outline-none'
                onClick={()=>setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen &&(
            <div className="md:hidden bg-black/90 text-white">
                <Link
                    to='/'
                    className='hover:text-red-500 transition duration-300 font-medium'
                    onClick={()=>setIsMenuOpen(false)}
                >
                    Home
                </Link>
                <div
                    className='hover:text-red-500 transition duration-300 font-medium'
                    onClick={()=>setIsMenuOpen(false)}
                >
                    Movies
                </div>
                <div
                    className='hover:text-red-500 transition duration-300 font-medium'
                    onClick={()=>setIsMenuOpen(false)}
                >
                    TV Shows
                </div>
                <div
                    className='hover:text-red-500 transition duration-300 font-medium'
                    onClick={()=>setIsMenuOpen(false)}
                >
                    Favorite
                </div>
                <div
                    className='hover:text-red-500 transition duration-300 font-medium'
                    onClick={()=>setIsMenuOpen(false)}
                >
                    <User size={20}/>
                </div>
            </div>
        )}
    </nav>
  )
}

export default Navbar
