import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import '../styles.css';

import NavbarContents from './NavbarContents';

const LoginForm = ({ sendData }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoginStatus("logging in");
            const response = await axios.post('https://todosnode-backend.netlify.app/.netlify/functions/app/login', {
                username,
                password
            });
            navigate('/home');
            setLoginStatus('success');
            sendData(response.config.data);
            localStorage.setItem('user', response.config.data);
            localStorage.setItem('loginStatus', JSON.stringify(true));
            console.log('Logged in successfully:', response.config.data)
        }
        catch (error) {
            if (error.response?.status === 401) {
                setLoginStatus('unsuccessful');
            }
            else {
                alert(error.response?.data?.message);
            }
            console.error('Error while login', error);
        }
    }

    return (
        <>
            <NavbarContents />
            <div className='login'>
                <div className="container sm">
                    <div className="card-header">
                        <h3 className="text-center">Login</h3>
                    </div>
                    <div className="card-body">
                        {loginStatus === 'unsuccessful' && <div className='alert alert-danger'>
                            Invalid username or password!
                        </div>}
                        <form onSubmit={handleSubmit}>
                            <fieldset>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
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
                            </fieldset>
                            <fieldset>
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
                            </fieldset>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Login</button>
                            </div>
                        </form>
                    </div>
                    <div className="link"><p><a href="./signup">Create an account</a></p></div>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
