import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleSendOtp = () => {
    if (!email) {
      toast.error('Email is required.');
      return;
    }
    if (!validateEmail(email)) {
      toast.error('Invalid email format.');
      return;
    }

    axios.post('http://localhost:8080/api/send-otp', { contactType: 'email', contactValue: email })
      .then(() => {
        toast.success(`OTP sent to ${email}`, {
          position: "top-right",
          autoClose: 2000,
        });
        setStep(2);
      })
      .catch((error) => {
        const errorMsg = error.response?.data || 'An error occurred. Please try again.';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      toast.error('OTP is required.');
      return;
    }

    axios.post('http://localhost:8080/api/verify-otp', { contactValue: email, otp })
      .then(() => {
        toast.success('OTP verified successfully!', {
          position: "top-right",
          autoClose: 2000,
        });
        setStep(3);
      })
      .catch((error) => {
        const errorMsg = error.response?.data || 'Invalid OTP. Please try again.';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };

  const handleResetPassword = () => {
    if (!newPassword) {
      toast.error('New password is required.');
      return;
    }
    if (!validatePassword(newPassword)) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    axios.put('http://localhost:8080/api/update-password', { email, newPassword })
      .then(() => {
        toast.success('Password reset successfully!', {
          position: "top-right",
          autoClose: 2000,
        });
        navigate('/admin-login');
      })
      .catch((error) => {
        const errorMsg = error.response?.data || 'Error resetting password. Please try again.';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="forgot-password-page">
      <h2>Forgot Password</h2>
      {step === 1 && (
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <label>Enter OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
