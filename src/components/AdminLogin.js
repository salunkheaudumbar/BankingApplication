import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [otpMethod, setOtpMethod] = useState('');
  const [showOtpMethod, setShowOtpMethod] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!recaptchaValue) newErrors.recaptcha = 'Please complete the reCAPTCHA';
    return newErrors;
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await axios.post('http://localhost:8080/api/login', formData);
        if (response.data) {
          setShowOtpMethod(true);
        }
      } catch (error) {
        toast.error('Invalid email or password', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const handleOtpMethodChange = async (e) => {
    setOtpMethod(e.target.value);
    if (e.target.value === 'phone') {
      try {
        const response = await axios.get(`http://localhost:8080/api/getPhoneNumberByEmail?email=${formData.email}`);
        if (response.status === 200) {
          setPhoneNumber(response.data);
        } else {
          toast.error('No phone number found for the provided email', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        toast.error('Error fetching phone number', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const handleOtpSubmit = async () => {
    if (otpMethod) {
      try {
        const contactValue = otpMethod === 'email' ? formData.email : phoneNumber;
        const response = await axios.post('http://localhost:8080/api/send-otp', {
          contactType: otpMethod,
          contactValue: contactValue
        });
        if (response.data) {
          setShowOtpInput(true);
          toast.success('OTP sent successfully!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        toast.error('Error sending OTP', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      toast.error('Please select a method to receive the OTP.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const verifyOtp = async () => {
    if (otp) {
      try {
        const response = await axios.post('http://localhost:8080/api/verify-otp', { otp });
        if (response.data) {
          toast.success('OTP verified successfully!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            navigate('/admin-dashboard');
          }, 2000); // 2-second delay
        }
      } catch (error) {
        toast.error('Invalid OTP. Please try again.', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      toast.error('Please enter the OTP.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="login-page">
      <h2>Admin Login</h2>
      <form onSubmit={handleSendOtp}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="captcha-container">
          <ReCAPTCHA
            sitekey="6LdGChMqAAAAADpemykUkpz7NOdGO0YfPGSSgaKB" // Replace with your actual site key
            onChange={handleRecaptchaChange}
          />
          {errors.recaptcha && <span className="error">{errors.recaptcha}</span>}
        </div>
        <button type="submit">Send OTP</button>
        {showOtpMethod && (
          <div className="otp-method">
            <h6>Select OTP Delivery Method</h6>
            <div>
              <input
                type="radio"
                id="otpEmail"
                name="otpMethod"
                value="email"
                checked={otpMethod === 'email'}
                onChange={handleOtpMethodChange}
              />
              <label htmlFor="otpEmail">Email</label>
            </div>
            <div>
              <input
                type="radio"
                id="otpPhone"
                name="otpMethod"
                value="phone"
                checked={otpMethod === 'phone'}
                onChange={handleOtpMethodChange}
              />
              <label htmlFor="otpPhone">Phone</label>
            </div>
            <button type="button" onClick={handleOtpSubmit}>Submit</button>
          </div>
        )}
        {showOtpInput && (
          <div className="otp-input">
            <h6>Enter OTP</h6>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
            />
            <button type="button" onClick={verifyOtp} className='verifyOtpButton'>Verify OTP</button>
          </div>
        )}
      </form>
      <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
      <ToastContainer />
    </div>
  );
}

export default AdminLogin;
