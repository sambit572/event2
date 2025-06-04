import React, { useState, useEffect } from 'react';
import './LoginRegister.css';

const LoginRegister = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState('form'); // 'form', 'otp', 'success'
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);

  useEffect(() => {
    if (step === 'success') {
      setShowSuccessIcon(false);

      const iconTimer = setTimeout(() => {
        setShowSuccessIcon(true); // Show success icon after 500ms
      }, 500);

      const closeTimer = setTimeout(() => {
        onClose(); // Close modal after 5 seconds
      }, 5000);

      return () => {
        clearTimeout(iconTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [step, onClose]);

  const handleOTPChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleGetOTP = () => {
    console.log("OTP sent!");
    setStep('otp');
  };

  const handleVerifyOTP = () => {
    console.log("Entered OTP:", otp.join(""));
    setStep('success');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register clicked");
    setIsLogin(true);
    setStep('form');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login clicked");
    onClose();
  };

  return (
    <div className="login-wrapper" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {step === 'success' ? (
          <div className="success-container">
            <h2 className="success-heading">Congratulations</h2>
            <p>Welcome 🎉 to Eventsbridge</p>

            {showSuccessIcon && <div className="success-icon"></div>}

            <h3 className="success-heading">Thank you!</h3>
            <p className="success-message">
              Your OTP Verification has been completed successfully!
            </p>
          </div>
        ) : step === 'otp' ? (
          <>
            <h2 className="login-title">Verify With OTP</h2>
            <p className="otp-subtext">
              To ensure your security, enter the 6-digit code sent to your registered mobile number/email below.
            </p>

            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  maxLength="1"
                  value={digit}
                  className="otp-input"
                  onChange={(e) => handleOTPChange(e.target, index)}
                />
              ))}
            </div>

            <p className="resend-text">
              Not received your code? <span className="link">Resend OTP</span>
            </p>

            <button className="otp-button" onClick={handleVerifyOTP}>Verify</button>

            <p className="help-text">
              Having difficulties with OTP? <span className="link">Get Help</span>
            </p>
          </>
        ) : (
          <>
            <h2 className="login-title">{isLogin ? 'Log In' : 'Sign Up'}</h2>

            {isLogin ? (
              <>
                <label className="login-label">Enter Mobile No.</label>
                <input type="number" className="login-input" placeholder="+91 | Enter your number" required />

                <button className="otp-button" onClick={handleGetOTP}>Get OTP</button>

                <input type="email" name='email' className="login-input" placeholder="Enter email" required />
                <input type="password" name='password' className="login-input" placeholder="Enter password" required />

                <a className='Login-forget-password-link' href="/forgotpassword">Forget Password?</a>

                <button type="submit" className="otp-button" onClick={handleLogin}>Login</button>

                <p className="signup-text">
                  Don’t have an account?{' '}
                  <span className="link" onClick={() => {
                    setIsLogin(false);
                    setStep('form');
                  }}>Sign Up</span>
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
                  <span className="link" onClick={() => {
                    setIsLogin(true);
                    setStep('form');
                  }}>Log In</span>
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
