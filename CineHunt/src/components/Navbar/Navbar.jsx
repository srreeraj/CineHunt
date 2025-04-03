import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Search, Menu, X, User, Home as HomeIcon, Film, Tv, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black shadow-lg' : 'bg-gradient-to-b from-black/90 to-transparent'
    }`}>
      <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className='text-2xl font-bold tracking-wide text-red-500 flex items-center'>
          <span className="hidden sm:inline">CineHunt</span>
          <span className="sm:hidden">CH</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className='hover:text-red-500 transition duration-300 font-medium flex items-center gap-1'>
            <HomeIcon size={16} />
            <span>Home</span>
          </Link>
          <Link to="/movies" className='hover:text-red-500 transition duration-300 font-medium flex items-center gap-1'>
            <Film size={16} />
            <span>Movies</span>
          </Link>
          <Link to="/tvshows" className='hover:text-red-500 transition duration-300 font-medium flex items-center gap-1'>
            <Tv size={16} />
            <span>TV Shows</span>
          </Link>
          <Link to="/favorites" className='hover:text-red-500 transition duration-300 font-medium flex items-center gap-1'>
            <Heart size={16} />
            <span>Favorites</span>
          </Link>
        </div>

        {/* Search and Profile - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search movies, shows...'
              className='bg-gray-800/80 text-white rounded-full w-48 lg:w-64 px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300'
            />
            <Search className='absolute left-3 top-2.5 text-gray-400' size={18}/>
          </div>
          <div className="relative">
            <Link to="/profile" className="flex items-center gap-2 hover:text-red-500 transition duration-300">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-red-500 transition-all duration-300">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <User size={18} />
                )}
              </div>
              <span className="hidden lg:inline text-sm font-medium">
                {user?.displayName ? user.displayName.split(' ')[0] : 'Profile'}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden text-white focus:outline-none'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden bg-black/95 text-white py-4 px-6 absolute top-full left-0 right-0 shadow-lg backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="flex flex-col space-y-4">
            {/* Search - Mobile */}
            <div className="relative mb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search movies, shows...'
                className='bg-gray-800/80 text-white rounded-full w-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-red-500'
              />
              <Search className='absolute left-3 top-2.5 text-gray-400' size={18}/>
            </div>
            
            {/* Nav Links - Mobile */}
            <Link to="/" className='flex items-center gap-2 hover:text-red-500 transition duration-300 font-medium py-2'>
              <HomeIcon size={18} />
              <span>Home</span>
            </Link>
            <Link to="/movies" className='flex items-center gap-2 hover:text-red-500 transition duration-300 font-medium py-2'>
              <Film size={18} />
              <span>Movies</span>
            </Link>
            <Link to="/tvshows" className='flex items-center gap-2 hover:text-red-500 transition duration-300 font-medium py-2'>
              <Tv size={18} />
              <span>TV Shows</span>
            </Link>
            <Link to="/favorites" className='flex items-center gap-2 hover:text-red-500 transition duration-300 font-medium py-2'>
              <Heart size={18} />
              <span>Favorites</span>
            </Link>
            
            {/* Profile - Mobile */}
            <Link to="/profile" className='flex items-center gap-2 hover:text-red-500 transition duration-300 font-medium py-2 border-t border-gray-700 mt-2 pt-4'>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <User size={18} />
                )}
              </div>
              <span>
                {user?.displayName || 'Profile'}
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar