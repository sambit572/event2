import React, { useState } from 'react';
import './LoginRegister.css';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';

const LoginRegister = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleRegister = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Register button clicked!");
    // Add registration logic here
  };

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Login button clicked!");
    // Add login logic here
  };

  return (
    <div className="login-wrapper" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="login-title">{isLogin ? 'Log In' : 'Sign Up'}</h2>

        {isLogin ? (
          <>
            <label className="login-label">Enter Mobile No.</label>
            <input
              type="number"
              className="login-input"
              placeholder="+91 | Enter your number"
              required
            />

            <button className="otp-button">Get OTP</button>

            <input type="email" name='email' className="login-input" placeholder="Enter email" required />
            <input type="password" name='password' className="login-input" placeholder="Enter password" required />

            <a className='Login-forget-password-link' href="#">Forget Password?</a>

            <button type="submit" className="otp-button" onClick={handleLogin}>Login</button>

            <p className="signup-text">
              Don’t Have An Account?{' '}
              <span className="link" onClick={() => setIsLogin(false)}>Sign Up</span>
            </p>
          </>
        ) : (
          <>
            <input type="text" name='fullName' className="login-input" placeholder="Enter full name" required />
            <input type="email" name='email' className="login-input" placeholder="Enter email" required />
            <input type="number" name='phoneNo' className="login-input" placeholder="+91 | Enter the 10 digit number" required />
            <input type="password" name='password' className="login-input" placeholder="Create password" required />
            <input type="password" className="login-input" placeholder="Confirm password" required />

            <button type="submit" className="otp-button" onClick={handleRegister}>Register</button>

            <p className="signup-text">
              Already have an account?{' '}
              <span className="link" onClick={() => setIsLogin(true)}>Log In</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
