import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterBranchManager.css';

const RegisterBranchManager = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    phone: '+91',
    email: '',
    password: '',
    branch: '',
    presentAddress: '',
    permanentAddress: '',
    confirmPassword: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState({});
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/listAllBranches')
      .then(response => response.json())
      .then(data => setBranches(data))
      .catch(error => console.error('Error fetching branches:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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

    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.presentAddress) newErrors.presentAddress = 'Present address is required';
    if (!formData.permanentAddress) newErrors.permanentAddress = 'Permanent address is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setSubmitted(false);
    } else {
      setError({});
      setSubmitted(false);

      fetch('http://localhost:8080/api/createBranchManager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => {
          if (response.ok) {
            setSubmitted(true);
          } else {
            return response.json().then(err => { throw new Error(err.message); });
          }
        })
        .catch(error => {
          setError({ general: error.message });
          setSubmitted(false);
        });
    }
  };

  useEffect(() => {
    if (submitted) {
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);
    }
  }, [submitted, navigate]);

  return (
    <div className="register-branch-manager-container">
      <form onSubmit={handleSubmit} className="register-branch-manager-form">
        <h2>Register Branch Manager</h2>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
          />
          {error.name && <span className="error">{error.name}</span>}
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            autoComplete="off"
          />
          {error.dob && <span className="error">{error.dob}</span>}
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            autoComplete="off"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {error.gender && <span className="error">{error.gender}</span>}
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="off"
          />
          {error.phone && <span className="error">{error.phone}</span>}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
          />
          {error.email && <span className="error">{error.email}</span>}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
          />
          {error.password && <span className="error">{error.password}</span>}
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="off"
          />
          {error.confirmPassword && <span className="error">{error.confirmPassword}</span>}
        </div>
        <div className="form-group">
          <label>Branch:</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            autoComplete="off"
          >
            <option value="">Select Branch</option>
            {branches.map(branch => (
              <option value={branch.branchName} key={branch.branchName}>{branch.branchName}</option>
            ))}
          </select>
          {error.branch && <span className="error">{error.branch}</span>}
        </div>
        <div className="form-group">
          <label>Present Address:</label>
          <input
            type="text"
            name="presentAddress"
            value={formData.presentAddress}
            onChange={handleChange}
            autoComplete="off"
          />
          {error.presentAddress && <span className="error">{error.presentAddress}</span>}
        </div>
        <div className="form-group">
          <label>Permanent Address:</label>
          <input
            type="text"
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleChange}
            autoComplete="off"
          />
          {error.permanentAddress && <span className="error">{error.permanentAddress}</span>}
        </div>
        {error.general && <span className="error">{error.general}</span>}
        {submitted && !Object.keys(error).length && (
          <span className="success">Successfully registered manager!</span>
        )}
        <button type="submit" className="submit-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterBranchManager;
