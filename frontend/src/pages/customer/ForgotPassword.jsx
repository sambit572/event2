import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted email:', email);
    // Add API call or logic here
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <p>Enter your email address</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
