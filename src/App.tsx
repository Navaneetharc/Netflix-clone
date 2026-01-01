import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Player from './pages/Player/Player';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from './context/AuthContext';
import netflix_spinner from './assets/netflix_spinner.gif';
import MovieDetails from './pages/MovieDetail/MovieDetail';
import MyList from './pages/MyList/MyList';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  // if (loading) {
  //   return (
  //     <div className="global-spinner">
  //       <img src={netflix_spinner} alt="loading" />
  //     </div>
  //   );
  // }

  return (
    <div>
      <ToastContainer theme="dark" />
      
      {loading && (
        <div className="global-spinner">
          <img src={netflix_spinner} alt="loading" />
        </div>
      )}

      {!loading && (
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/movie/:id" 
            element={user ? <MovieDetails/> : <Navigate to="/login"/>}
          />
          <Route
            path="/player/:id"
            element={user ? <Player /> : <Navigate to="/login" />}
          />
          <Route
           path="/my-list"
           element={user ? <MyList/> : <Navigate to="/login"/>}
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
