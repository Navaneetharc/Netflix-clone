import React, { useEffect, useState } from 'react';
import './MyList.css';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firbase'; // Make sure path is correct
import { doc, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import netflix_spinner from '../../assets/netflix_spinner.gif';
import Navbar from '../../components/Navbar/Navbar';

interface MovieData {
  id: number;
  original_title: string;
  backdrop_path: string | null;
}

const MyList: React.FC = () => {
  const { user } = useAuth();
  const [list, setList] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setList(doc.data().watchlist || []);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="global-spinner">
        <img src={netflix_spinner} alt="loading" />
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="my-list-container">
        <br />
      <h2 className="my-list-title">My List</h2>
      
      {list.length > 0 ? (
        <div className="my-list-grid">
          {list.map((item) => (
            <Link to={`/movie/${item.id}`} key={item.id} className="my-list-card">
              <img 
                src={item.backdrop_path 
                  ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` 
                  : 'https://via.placeholder.com/500x281?text=No+Image'} 
                alt={item.original_title} 
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-list">
           <h3>Your list is empty</h3>
           <p>Add movies to your watchlist to see them here.</p>
        </div>
      )}
    </div>
    </>
    
  );
};

export default MyList;