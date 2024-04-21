import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

import '../styles.css';
import NavbarContents from './NavbarContents';

//ssignup pages
const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [userDetails, setUserDetails] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post('http://localhost:3001/auth/signup', {
                username,
                password
            }).then(() => {
                navigate('/');
                alert("Signed up successfully. Login now.");
                console.log('Signed up successfully:');
            }).catch((error) => {
                alert(error.response.data.message);
                console.log('Error while login', error);
            });
        }
        catch (error) {
            console.error('Error while login', error);
        }
    }

    return (
        <>
            <NavbarContents />
            <div className='login'>
                <div className="container sm">
                    <div className="card-header">
                        <h3 className="text-center">Sign Up</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Enter Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <div className="invalid-feedback">
                                    Please choose a username.
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className="invalid-feedback">
                                    Please choose a password.
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmedpassword" className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmedpassword"
                                    placeholder="Re-enter the password"
                                    pattern={password}
                                    value={confirmedPassword}
                                    onChange={(e) => setConfirmedPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Sign Up</button>
                            </div>
                        </form>
                        <div className="link"><p><a href='/'>Login</a></p></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
