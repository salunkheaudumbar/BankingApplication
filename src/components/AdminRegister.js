import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './AdminRegister.css';

function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91',
    dob: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [otpMethod, setOtpMethod] = useState('');
  const [showOtpMethod, setShowOtpMethod] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      evaluatePasswordStrength(value);
    }
  };

  const evaluatePasswordStrength = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mediumPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (strongPasswordRegex.test(password)) {
      setPasswordStrength('strong');
    } else if (mediumPasswordRegex.test(password)) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('weak');
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
    const phoneRegex = /^\+91[0-9]{10}$/;
    const nameRegex = /^[A-Z\s]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.name) newErrors.name = 'Name is required';
    else if (!nameRegex.test(formData.name)) newErrors.name = 'Name should contain only capital letters and spaces';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Email should be a valid .com address';

    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number';

    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    else if (calculateAge(formData.dob) < 18) newErrors.dob = 'You must be at least 18 years old';

    if (!formData.gender) newErrors.gender = 'Gender is required';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!passwordRegex.test(formData.password)) newErrors.password = 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    return newErrors;
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setShowOtpMethod(true);
    }
  };

  const handleOtpMethodChange = (e) => {
    setOtpMethod(e.target.value);
  };

  const handleOtpSubmit = () => {
    if (otpMethod === 'email' || otpMethod === 'phone') {
      const contactValue = otpMethod === 'email' ? formData.email : formData.phone;
      axios.post('http://localhost:8080/api/send-otp', {
        contactType: otpMethod,
        contactValue: contactValue
      })
        .then(response => {
          setShowOtpInput(true);
          toast.success(`OTP sent successfully to ${otpMethod}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch(error => {
          toast.error('Error sending OTP', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
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

  const verifyOtp = () => {
    axios.post('http://localhost:8080/api/verify-otp', {
      contactType: otpMethod,
      contactValue: otpMethod === 'email' ? formData.email : formData.phone,
      otp: otp
    })
      .then(response => {
        toast.success('OTP verified successfully!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Register the user after OTP verification
        axios.post('http://localhost:8080/api/register/manager', formData)
          .then(response => {
            toast.success('Registration successful!', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              navigate('/admin-login');
            }, 2000); // 2-second delay
          })
          .catch(error => {
            toast.error('Error during registration', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      })
      .catch(error => {
        toast.error('Invalid OTP. Please try again.', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <div className="register-page">
      <h2>Admin Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          {errors.dob && <span className="error">{errors.dob}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            autoComplete="off"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          {passwordStrength && (
            <span className={`password-strength ${passwordStrength}`}>
              {passwordStrength === 'strong' && 'Strong password'}
              {passwordStrength === 'medium' && 'Medium strength password'}
              {passwordStrength === 'weak' && 'Weak password'}
            </span>
          )}
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>
        <button type="submit">Send OTP</button>
        {showOtpMethod && (
          <div className="otp-method">
            <h3>Select OTP Delivery Method</h3>
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
            <button onClick={handleOtpSubmit}>Submit</button>
          </div>
        )}

        {showOtpInput && (
          <div className="otp-input">
            <h3>Enter OTP</h3>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              required
              autoComplete="off"
            />
            <button onClick={verifyOtp} className='verifyOtpButton'>Verify OTP</button>
          </div>
        )}
      </form>
      <ToastContainer />
    </div>
  );
}

export default AdminRegister;
