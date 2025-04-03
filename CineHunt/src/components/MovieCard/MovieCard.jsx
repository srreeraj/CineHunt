import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react'

const MovieCard = ({title, category}) => {
  const [apiData, setApiData] = useState([]);
  const [favorites, setFavorites] = useState({});
  const cardRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjgzNmM0MTMyZjk4ZTc0YWJiMTg2OTRhNDgzY2YxMSIsIm5iZiI6MTc0MjEyNTIwNy40MTUsInN1YiI6IjY3ZDZiODk3ZDgwMjMwOTcwM2YxNDVjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UGLWIZ3b63fDSIh8hvpXL7uLojSJyzL451NOjWwDIvg'
    }
  };

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

  // Button-based scrolling
  const scrollLeft25Percent = () => {
    if (!cardRef.current) return;
    const scrollDistance = cardRef.current.offsetWidth * 0.25;
    cardRef.current.scrollLeft -= scrollDistance;
  };

  const scrollRight25Percent = () => {
    if (!cardRef.current) return;
    const scrollDistance = cardRef.current.offsetWidth * 0.25;
    cardRef.current.scrollLeft += scrollDistance;
  };

  const toggleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=en-US`, options)
      .then(res => {
        if(!res.ok){
          throw new Error(`HTTP error! Status ${res.status}`)
        } else{
          return res.json();
        }
      })
      .then(res => setApiData(res.results || []))
      .catch(err => console.error(err));

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [category, isDragging, startX, scrollLeft]);

  return (
    <div className="py-6 px-4 md:px-6 lg:px-8 relative">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title || "Popular on Netflix"}</h2>
      
      {/* Scroll buttons */}
      <button 
        onClick={scrollLeft25Percent}
        className="absolute left-1 top-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transform -translate-y-8"
        aria-label="Scroll left"
      >
        ◀
      </button>
      
      <button 
        onClick={scrollRight25Percent}
        className="absolute right-1 top-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transform -translate-y-8"
        aria-label="Scroll right"
      >
        ▶
      </button>
      
      <div
        ref={cardRef}
        className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory gap-4 pb-4 cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: "none",
          WebkitOverflowScrolling: 'touch'
        }}
        onMouseDown={handleMouseDown}
      >
        {apiData.map((card, index) => (
          <div key={index} className="relative flex-none snap-start w-64 md:w-72 group">
            <Link to={`player/${card.id}`} className="block">
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`} 
                  alt={card.original_title} 
                  className="w-full h-36 md:h-40 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button 
                  onClick={(e) => toggleFavorite(e, card.id)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60"
                >
                  <Heart 
                    size={18} 
                    fill={favorites[card.id] ? "#ff0000" : "none"} 
                    color={favorites[card.id] ? "#ff0000" : "white"} 
                    className="transition-all duration-300"
                  />
                </button>
                <div className="p-3 bg-black/80">
                  <p className="text-white font-medium text-sm md:text-base line-clamp-1">{card.original_title}</p>
                  <p className="text-gray-300 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-1">
                    {card.release_date?.split('-')[0]} • {Math.floor(card.vote_average * 10)}% Match
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MovieCard