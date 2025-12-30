import React, { useEffect, useState } from "react";
import play_icon from "../../assets/play_icon.png";
import './MovieDetails.css';
import Navbar from "../../components/Navbar/Navbar";
import netflix_spinner from '../../assets/netflix_spinner.gif';
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import { db } from "../../firbase"; 
import { arrayUnion, doc, getDoc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";

interface Movie {
  id: number;
  original_title: string;
  overview: string;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

interface WatchlistMovie {
  id: number;
  original_title: string;
  backdrop_path: string | null;
}

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false); 

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYWQ4NGVkYmRmZjU3ZGFjMjNiYzNmNGNhZjBhOTZiYyIsIm5iZiI6MTc2NjA0MjI5MS4wODYwMDAyLCJzdWIiOiI2OTQzYWFiM2RjNmFiNzlmMzZlNmU3ZTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.8ZLMu2VEOYzYDwh1obESwAx58ExKfOlI2mDOADyjwlM'
          }
        };

        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details: ", error);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  useEffect(() => {
    if (user && id) {
      const userRef = doc(db, "users", user.uid);
      
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const watchlist = (data.watchlist as WatchlistMovie[]) || [];
          
          const exists = watchlist.some((item) => item.id === Number(id));
          setIsInWatchlist(exists);
        }
      });

      return () => unsubscribe();
    }
  }, [user, id]);

  const handleWatchlist = async () => {
    if (!user || !movie) {
      toast.error("Please log in to add to your list");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    
    const movieData: WatchlistMovie = {
      id: movie.id,
      original_title: movie.original_title,
      backdrop_path: movie.backdrop_path,
    };

    try {
      const docSnap = await getDoc(userRef);

      if (isInWatchlist) {
        if (docSnap.exists()) {
          const currentList = (docSnap.data()?.watchlist as WatchlistMovie[]) || [];
          const updatedList = currentList.filter((item) => item.id !== movie.id);
          
          await updateDoc(userRef, {
            watchlist: updatedList
          });
          toast.info("Removed from My List");
        }
      } else {
        if (docSnap.exists()) {
          await updateDoc(userRef, {
            watchlist: arrayUnion(movieData)
          });
        } else {
          await setDoc(userRef, { watchlist: [movieData] });
        }
        toast.success("Added to My List");
      }
    } catch (error) {
      console.error("Error updating watchlist: ", error);
      toast.error("Could not update watchlist");
    }
  };

  if (!movie) {
    return (
      <div className="global-spinner">
        <img src={netflix_spinner} alt="loading" />
      </div>
    );
  }

  return (
    <div className="movie-detials-container">
    <Navbar/>
      <div className="hero-backround">
        <img src={movie.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          : 'https://via.placeholder.com/1920x1080?text=No+Image'
        } alt={movie.original_title} className="backdrop-img"
        />

        <div className="gradient-overlay-x"></div>
        <div className="gradient-overlay-y"></div>
      </div>

      <div className="movie-info">
        <h1 className="movie-title">{movie.original_title}</h1>

        <div className="movie-meta">
          <span className="match-score">
            {movie.vote_average ? Math.round(movie.vote_average * 10) : 0}% Match
          </span>
          <span className="hd-badge">HD</span>
        </div>

        <p className="movie-desc">{movie.overview}</p>

        <div className="action-buttons">

          <Link to={`/player/${movie.id}`} className="btn-play">
            <img src={play_icon} alt="" className="btn-icon" style={{ width: '24px' }} />
            Play
          </Link>

          <button className="btn-list" onClick={handleWatchlist}>
            {isInWatchlist ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="btn-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="btn-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
            My List
          </button>
          
        </div>
      </div>
    </div>
  )
}

export default MovieDetails;