import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import Signup from './components/Signup';
import Home from './components/Home';
import ProjectDetails from './components/ProjectDetails';

import './styles.css';

const App = () => {
  const [formVisibility, setFormVisibility] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const isLoggedIn = JSON.parse(localStorage.getItem('loginStatus')) || false;

  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function (event) {
    window.history.go(1);
  };

  const setDetails = () => {
    const data = (localStorage.getItem('user'));
    setUserDetails(JSON.parse(data));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm sendData={setDetails} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {isLoggedIn === true ?
        <Routes>
          <>
            <Route path="/home" element={<Home props={userDetails} showModal={formVisibility} />} />
            <Route path="/details/:projectId" element={<ProjectDetails props={userDetails} />} />
          </>
        </Routes> : <>{!['/', '/signup'].includes(window.location.pathname) ?
          <>{
            alert("User not logged in!")
          }
            <Navigate to="/"></Navigate></>
          : <></>}
        </>}

    </Router>
  );
};

export default App;
