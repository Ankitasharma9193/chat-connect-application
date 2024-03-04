import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import signinImage from '../assets/signup.jpg';

const cookies = new Cookies();

const initialState = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    avatarURL: '',
};

export const Auth = () => {
  const [form, setForm] = useState(initialState)
  const [isSignup, setIsSignup] = useState(true);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const handleChange = (e) => {
    e.preventDefault();
    setForm({...form, [e.target.name]: e.target.value})
  }

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// username - abhi@123 pass: Anki
  const handleSubmit =  async (e) => {
    e.preventDefault();

    const { username, password, phoneNumber, avatarURL } = form;
    const URL =  'http://localhost:5000/auth';

    // getting back from backend = sending to backend
    const { data : { token, userId, hashedPassword, fullName }} = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'} ` ,
        { username, password, fullName: form.fullName, phoneNumber, avatarURL, }
    );
    // data we are getting from backend is usable for the application now
    // data we get back from backend will be set in browser through cookies
    cookies.set('token', token);
    cookies.set('username', username);
    cookies.set('fullName', fullName);
    cookies.set('userId', userId);
    // this step also happen after getting data back
    // while creating the account, set the data in cookies
    if(isSignup){
        cookies.set( 'hashedPassword', hashedPassword );
        cookies.set( 'phoneNumber', phoneNumber );
        cookies.set( 'avatarURL', avatarURL );
    }

    // once we set the cookies we want to reload our application
    //! Why ? - The application will reload and the auth token is now filled
    //! this token is been created at backend, refer Controller > Auth.js
    //! refer App.js line 14
    window.location.reload();
  };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  }
  console.log(isSignup);

  return (
    <div className='auth__form-container'>
        <div className='auth__form-container_fields'>
            <div className='auth__form-container_fields-content'>
                <p>{ isSignup ? 'Sign Up' : 'Log in'}</p>

                <form onSubmit={ handleSubmit }>

                    { isSignup && (
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor="fullName">Full Name</label>
                            <input 
                                name="fullName" 
                                type="text"
                                placeholder="Full Name"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="username">Username</label>
                            <input 
                                name="username" 
                                type="text"
                                placeholder="Username"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input 
                                    name="phoneNumber" 
                                    type="text"
                                    placeholder="Phone Number"
                                    onChange={handleChange}
                                    required
                            />
                        </div>
                    )}
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="avatarURL">Avatar URL</label>
                            <input 
                                    name="avatarURL" 
                                    type="text"
                                    placeholder="Avatar URL"
                                    onChange={handleChange}
                                    
                            />
                        </div>
                    )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="password">Password</label>
                            <input 
                                    name="password" 
                                    type="password"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    required
                            />
                        </div>
                    {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input 
                                    name="confirmPassword" 
                                    type="password"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    required
                            />
                        </div>
                    )}
                    <div className="auth__form-container_fields-content_button">
                        <button>{isSignup ? "Sign Up" : "Log In"}</button>
                    </div>
                </form>

                <div className="auth__form-container_fields-account">
                    <p>
                        {isSignup
                         ? "Already have an account?"
                         : "Don't have an account?"
                        }
                        <span onClick={switchMode}>
                             {isSignup ? 'Log In' : ' Sign Up'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div className="auth__form-container_image">
            <img src={signinImage} alt="sign in" />
        </div>
    </div>
  )
};

export default Auth;
