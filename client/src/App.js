import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import axios from 'axios';

// import ClassRoom from './ClassRoom';
import LoginForm from './components/LoginForm';
import Signup from './components/Signup';
import Home from './components/Home';
// import ScheduleForm from './ScheduleForm';
// import NavbarContents from './NavbarContents';

import './styles.css';

// import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [formVisibility, setFormVisibility] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const setDetails = () => {
    // console.log(JSON.parse(data));
    // console.log(data)
    // console.log('Data received from child:', localStorage.getItem('user'));
    // localStorage.setItem('user', data);
    // const convertedData = JSON.parse(localStorage.getItem('user'));
    const data = (localStorage.getItem('user'));
    setUserDetails(JSON.parse(data));
  };

  const showLoginMenu = () => {
    return (
      <></>
    );
  }

  // const logOut = async (e) => {
  //   try {
  //     e.preventDefault();
  //     const response = await axios.post('http://localhost:3001/auth/logout', {})
  //     .then(()=>{
  //       alert("Logged out...");
  //     });
  //   }
  //   catch (err) {
  //     console.error('Error while login', err);
  //   }
  // }

  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm sendData={setDetails} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home props={userDetails} showModal={formVisibility} />} />
          {/* <Route path="/schedulelist" element={<ClassRoom props={userDetails} showModal={formVisibility} />} /> */}
          {/* <Route path="/schedule" element={(props)=>{<ClassRoom handleClose={handleClose} aria_hidden={aria_hidden} {...props} />}}/> */}

        </Routes>
      </Router>
  );
};

export default App;
