import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import Signup from './components/Signup';
import Home from './components/Home';
import ProjectDetails from './components/ProjectDetails';

import './styles.css';

const App = () => {
  const [formVisibility, setFormVisibility] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const setDetails = () => {
    const data = (localStorage.getItem('user'));
    setUserDetails(JSON.parse(data));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm sendData={setDetails} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home props={userDetails} showModal={formVisibility} />} />
        <Route path="/details/:projectId" element={<ProjectDetails props={userDetails} />} />
      </Routes>
    </Router>
  );
};

export default App;
