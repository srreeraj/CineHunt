import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../../components/MovieCard/MovieCard';
import Navbar from '../../components/Navbar/Navbar';
import { Film, Tv, Heart, LogOut, ChevronRight } from 'lucide-react';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!user) {
    return null;
  }

  // Hero banner movie - could be fetched from API instead of hardcoded
  const featuredMovie = {
    title: "The Matrix Resurrections",
    description: "Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a construct, Neo must decide to follow the white rabbit once more.",
    backdrop: "https://image.tmdb.org/t/p/original/hv7o3VgfsairBoQFAawgaQ4cR1m.jpg"
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white'>
      {/* Navbar */}
      <Navbar />
      
      {/* Welcome toast notification */}
      {showWelcome && (
        <div className="fixed top-20 right-4 bg-gray-800/90 backdrop-blur-sm z-40 rounded-lg shadow-lg p-4 transition-all duration-300 animate-fade-in-down flex items-center">
          <div className="mr-4">
            <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="h-10 w-10 rounded-full" />
              ) : (
                user.displayName?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
          </div>
          <div>
            <p className="font-bold">Welcome back, {user.displayName?.split(' ')[0] || 'User'}!</p>
            <p className="text-sm text-gray-300">Ready to discover new movies?</p>
          </div>
        </div>
      )}
      
      {/* Main content with proper spacing for fixed navbar */}
      <main className="pt-16">
        {/* Hero Banner */}
        <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={featuredMovie.backdrop}
              alt={featuredMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </div>
          
          <div className="relative h-full flex flex-col justify-end p-6 md:p-12 lg:p-16 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">{featuredMovie.title}</h1>
            <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 line-clamp-3">{featuredMovie.description}</p>
            <div className="flex space-x-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-md font-medium flex items-center">
                <Film className="mr-2" size={18} />
                <span>Watch Now</span>
              </button>
              <button className="bg-gray-800/80 hover:bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-md font-medium flex items-center">
                <Heart className="mr-2" size={18} />
                <span>Add to Favorites</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Movie Categories */}
<div className="px-4 md:px-8 py-8 space-y-8">
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl md:text-2xl font-bold">Popular Movies</h2>
      <button className="text-red-500 hover:text-red-400 flex items-center">
        See all <ChevronRight size={20} />
      </button>
    </div>
    <MovieCard title="Popular Movies" category="popular" />
  </div>

  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl md:text-2xl font-bold">Now Playing</h2>
      <button className="text-red-500 hover:text-red-400 flex items-center">
        See all <ChevronRight size={20} />
      </button>
    </div>
    <MovieCard title="Now Playing" category="now_playing" />
  </div>

  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl md:text-2xl font-bold">Top Rated</h2>
      <button className="text-red-500 hover:text-red-400 flex items-center">
        See all <ChevronRight size={20} />
      </button>
    </div>
    <MovieCard title="Top Rated" category="top_rated" />
  </div>

  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl md:text-2xl font-bold">Upcoming</h2>
      <button className="text-red-500 hover:text-red-400 flex items-center">
        See all <ChevronRight size={20} />
      </button>
    </div>
    <MovieCard title="Upcoming" category="upcoming" />
  </div>
</div>
        
        {/* Quick Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-8 mb-8">
          <div className="bg-gradient-to-br from-red-900/60 to-red-600/60 rounded-lg p-4 hover:scale-105 transition-transform cursor-pointer flex items-center justify-between">
            <span className="font-medium">Action</span>
            <ChevronRight size={18} />
          </div>
          <div className="bg-gradient-to-br from-blue-900/60 to-blue-600/60 rounded-lg p-4 hover:scale-105 transition-transform cursor-pointer flex items-center justify-between">
            <span className="font-medium">Sci-Fi</span>
            <ChevronRight size={18} />
          </div>
          <div className="bg-gradient-to-br from-green-900/60 to-green-600/60 rounded-lg p-4 hover:scale-105 transition-transform cursor-pointer flex items-center justify-between">
            <span className="font-medium">Comedy</span>
            <ChevronRight size={18} />
          </div>
          <div className="bg-gradient-to-br from-purple-900/60 to-purple-600/60 rounded-lg p-4 hover:scale-105 transition-transform cursor-pointer flex items-center justify-between">
            <span className="font-medium">Drama</span>
            <ChevronRight size={18} />
          </div>
        </div>
        
        {/* User Profile & Logout Section */}
        <div className="px-4 md:px-8 py-8 bg-black/30 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center mr-4 overflow-hidden border-2 border-red-500">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-12 w-12 object-cover" />
                ) : (
                  <span className="text-white text-lg font-bold">
                    {user.displayName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.displayName || user.email}</h2>
                <p className="text-gray-400 text-sm">Premium Member</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded flex items-center transition-colors duration-300"
            >
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        {/* Simple Footer */}
        <footer className="py-6 px-4 md:px-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} CineHunt. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-red-500 transition-colors duration-300 mx-2">Privacy Policy</a>
            <a href="#" className="hover:text-red-500 transition-colors duration-300 mx-2">Terms of Service</a>
            <a href="#" className="hover:text-red-500 transition-colors duration-300 mx-2">Help Center</a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Home;