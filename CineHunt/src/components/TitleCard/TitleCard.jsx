import React, { useEffect, useRef, useState } from 'react'

const TitleCard = ({title, category}) => {
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsRef = useRef();
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

  const handleWheel = (event) => {
    event.preventDefault();
    const scrollAmount = event.deltaY * 2; // Increased multiplier for smoother scrolling
    cardsRef.current.scrollTo({
      left: cardsRef.current.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  };

  // Mouse drag handlers for smoother touch/click-drag scrolling
  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartX(event.pageX - cardsRef.current.offsetLeft);
    setScrollLeft(cardsRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const x = event.pageX - cardsRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    cardsRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (event) => {
    setIsDragging(true);
    setStartX(event.touches[0].pageX - cardsRef.current.offsetLeft);
    setScrollLeft(cardsRef.current.scrollLeft);
  };

  const handleTouchMove = (event) => {
    if (!isDragging) return;
    const x = event.touches[0].pageX - cardsRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    cardsRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(()=>{
    const fetchMovies = async() =>{
        try {
            setIsLoading(true);
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${category || 'now_playing'}?language=en-US&page=1`,
                options
            );
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setApiData(data.results);
        } catch (error){
            setError(error.message);
            console.error("Error fetching movies");
        } finally {
            setIsLoading(false);
        }
    };

    fetchMovies();

    // Add event listeners
    const currentRef = cardsRef.current;
    if (currentRef) {
      currentRef.addEventListener('wheel', handleWheel, { passive: false });
      currentRef.addEventListener('mousedown', handleMouseDown);
      currentRef.addEventListener('mousemove', handleMouseMove);
      currentRef.addEventListener('mouseup', handleMouseUp);
      currentRef.addEventListener('mouseleave', handleMouseLeave);
      currentRef.addEventListener('touchstart', handleTouchStart);
      currentRef.addEventListener('touchmove', handleTouchMove);
      currentRef.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('wheel', handleWheel);
        currentRef.removeEventListener('mousedown', handleMouseDown);
        currentRef.removeEventListener('mousemove', handleMouseMove);
        currentRef.removeEventListener('mouseup', handleMouseUp);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
        currentRef.removeEventListener('touchstart', handleTouchStart);
        currentRef.removeEventListener('touchmove', handleTouchMove);
        currentRef.removeEventListener('touchend', handleMouseUp);
      }
    };
  }, [category]);

  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div 
          ref={cardsRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {apiData.map((movie) => (
            <div
              key={movie.id}
              className="min-w-[200px] bg-gray-800/50 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-[300px] object-cover"
                draggable="false"
              />
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg truncate">
                  {movie.title}
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  {new Date(movie.release_date).getFullYear()}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white ml-1">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TitleCard