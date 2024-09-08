import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Auth = () => {
  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post('http://localhost:5000/auth/google', {
        token: response.credential,
      });
      console.log('Login success:', res.data);
      // You can store user data in the state or local storage
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google login error:', error);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post('http://localhost:5000/signup', { name, email, password });
      console.log(res.data.message);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });
      console.log(res.data.message);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="34925859579-4v6uiruln3n916jplcot70rsg9di9crl.apps.googleusercontent.com">
      <div>
        <h2>Login with Google</h2>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        
        <h2>Normal Signup</h2>
        <form onSubmit={handleSignup}>
          <input type="text" name="name" placeholder="Name" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Signup</button>
        </form>

        <h2>Normal Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Auth;
