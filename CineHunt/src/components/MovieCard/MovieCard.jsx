import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight, Star, Calendar, Eye } from 'lucide-react';

const MovieCard = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Get saved favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when updated
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Mouse-based drag scrolling
  const handleMouseDown = (e) => {
    if (!cardRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - cardRef.current.offsetLeft);
    setScrollLeft(cardRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !cardRef.current) return;
    e.preventDefault();
    const x = e.pageX - cardRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    cardRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch-based drag scrolling for mobile
  const handleTouchStart = (e) => {
    if (!cardRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - cardRef.current.offsetLeft);
    setScrollLeft(cardRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !cardRef.current) return;
    const x = e.touches[0].pageX - cardRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    cardRef.current.scrollLeft = scrollLeft - walk;
  };

  // Button-based scrolling
  const scrollLeft25Percent = () => {
    if (!cardRef.current) return;
    const scrollDistance = cardRef.current.offsetWidth * 0.75;
    cardRef.current.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
  };

  const scrollRight25Percent = () => {
    if (!cardRef.current) return;
    const scrollDistance = cardRef.current.offsetWidth * 0.75;
    cardRef.current.scrollBy({ left: scrollDistance, behavior: 'smooth' });
  };

  const toggleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Intersection Observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjgzNmM0MTMyZjk4ZTc0YWJiMTg2OTRhNDgzY2YxMSIsIm5iZiI6MTc0MjEyNTIwNy40MTUsInN1YiI6IjY3ZDZiODk3ZDgwMjMwOTcwM2YxNDVjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UGLWIZ3b63fDSIh8hvpXL7uLojSJyzL451NOjWwDIvg'
      }
    };

    fetch(`https://api.themoviedb.org/3/movie/${category || "now_playing"}?language=en-US`, options)
      .then(res => {
        if(!res.ok){
          throw new Error(`HTTP error! Status ${res.status}`)
        } else{
          return res.json();
        }
      })
      .then(res => {
        setApiData(res.results || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      });

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
    }
  }, [category]);

  // Generate a better section title if not provided
  const getSectionTitle = () => {
    if (title) return title;
    
    switch(category) {
      case 'popular': return 'Popular Movies';
      case 'top_rated': return 'Top Rated Movies';
      case 'upcoming': return 'Coming Soon';
      case 'now_playing': return 'Now Playing';
      default: return 'Trending Movies';
    }
  };

  return (
    <div className={`py-6 px-4 md:px-6 lg:px-8 relative transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center">
        <span>{getSectionTitle()}</span>
        {category === 'top_rated' && <Star className="ml-2 text-yellow-400" size={18} />}
        {category === 'upcoming' && <Calendar className="ml-2 text-blue-400" size={18} />}
        {category === 'now_playing' && <Eye className="ml-2 text-green-400" size={18} />}
      </h2>
      
      {isLoading && (
        <div className="flex justify-center items-center h-36 md:h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-500/20 text-red-100 p-4 rounded-lg">
          <p>Error loading movies: {error}</p>
        </div>
      )}
      
      {!isLoading && !error && apiData.length > 0 && (
        <>
          {/* Scroll buttons - only show when hovering and if content is scrollable */}
          <button 
            onClick={scrollLeft25Percent}
            className="hidden md:flex absolute left-2 top-1/2 z-10 bg-black/60 hover:bg-red-600 text-white rounded-full w-10 h-10 items-center justify-center transform -translate-y-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={scrollRight25Percent}
            className="hidden md:flex absolute right-2 top-1/2 z-10 bg-black/60 hover:bg-red-600 text-white rounded-full w-10 h-10 items-center justify-center transform -translate-y-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
          
          <div
            ref={cardRef}
            className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 cursor-grab active:cursor-grabbing group"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: "none",
              WebkitOverflowScrolling: 'touch'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {apiData.map((movie, index) => (
              <div 
                key={movie.id || index} 
                className="relative flex-none w-[180px] xs:w-[220px] sm:w-[260px] md:w-[280px] group/card transition-transform duration-300"
              >
                <Link to={`/player/${movie.id}`} className="block">
                  <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover/card:scale-[1.03] group-hover/card:shadow-xl">
                    {/* Poster image with fallback */}
                    {movie.backdrop_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} 
                        alt={movie.title || movie.original_title} 
                        className="w-full h-[100px] xs:h-[120px] sm:h-[140px] md:h-[160px] object-cover transform group-hover/card:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-[100px] xs:h-[120px] sm:h-[140px] md:h-[160px] bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400 text-sm text-center px-2">Image not available</span>
                      </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover/card:opacity-100 transition-opacity duration-300" />
                    
                    {/* Favorite button */}
                    <button 
                      onClick={(e) => toggleFavorite(e, movie.id)}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 hover:bg-black/70 z-10"
                      aria-label={favorites[movie.id] ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart 
                        size={16} 
                        fill={favorites[movie.id] ? "#ff0000" : "none"} 
                        color={favorites[movie.id] ? "#ff0000" : "white"} 
                        className="transition-all duration-300"
                      />
                    </button>
                    
                    {/* Movie info */}
                    <div className="p-3 bg-black/80">
                      <p className="text-white font-medium text-sm sm:text-base line-clamp-1">
                        {movie.title || movie.original_title}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-gray-300 text-xs flex items-center">
                          {movie.release_date?.split('-')[0] || 'TBA'}
                        </p>
                        <p className="text-xs flex items-center">
                          <Star size={12} className="text-yellow-400 mr-1" />
                          <span className={movie.vote_average >= 7 ? "text-green-400" : movie.vote_average >= 5 ? "text-yellow-400" : "text-red-400"}>
                            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
      
      {!isLoading && !error && apiData.length === 0 && (
        <div className="bg-gray-800/50 rounded-lg p-6 text-center">
          <p className="text-gray-400">No movies available in this category</p>
        </div>
      )}
    </div>
  );
};

export default MovieCard;