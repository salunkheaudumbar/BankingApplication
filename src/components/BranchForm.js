import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BranchForm.css';

const statesAndCities = {
  'State1': ['City1', 'City2', 'City3'],
  'State2': ['City4', 'City5', 'City6'],
  // Add more states and their cities here
};

const BranchForm = () => {
  const [formData, setFormData] = useState({
    branchName: '',
    city: '',
    state: '',
    pincode: '',
    ifscCode: ''
  });
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'state') {
      // Update the cities based on the selected state
      setCities(statesAndCities[value] || []);
      setFormData((prevData) => ({ ...prevData, city: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const pincodeRegex = /^\d{6}$/; // 6-digit pincode
    const ifscCodeRegex = /^[A-Z]{4}\d{6}$/; // IFSC code format

    if (!formData.branchName) newErrors.branchName = 'Branch Name is required';

    if (!formData.state) newErrors.state = 'State is required';

    if (!formData.city) newErrors.city = 'City is required';

    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    else if (!pincodeRegex.test(formData.pincode)) newErrors.pincode = 'Pincode should be a 6-digit number';

    if (!formData.ifscCode) newErrors.ifscCode = 'IFSC Code is required';
    else if (!ifscCodeRegex.test(formData.ifscCode)) newErrors.ifscCode = 'IFSC Code should be in the format XXXX000000';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setSubmitted(false);

      fetch('http://localhost:8080/api/createBranch', {
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
          setErrors({ general: error.message });
          setSubmitted(false);
        });

      // Redirect to admin dashboard after a delay to show success message
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 3000); // Delay to show the success message
    }
  };

  return (
    <div className="branch-form-container">
      <h2>Register Branch</h2>
      <form onSubmit={handleSubmit} className="branch-form">
        <div className="form-group">
          <label>Branch Name:</label>
          <input
            type="text"
            name="branchName"
            value={formData.branchName}
            onChange={handleChange}
            
          />
          {errors.branchName && <span className="error">{errors.branchName}</span>}
        </div>
        <div className="form-group">
          <label>State:</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            
          >
            <option value="">Select State</option>
            {Object.keys(statesAndCities).map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <span className="error">{errors.state}</span>}
        </div>
        {formData.state && (
          <div className="form-group">
            <label>City:</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              
            >
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && <span className="error">{errors.city}</span>}
          </div>
        )}
        <div className="form-group">
          <label>Pincode:</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            
            pattern="\d{6}"
            title="Pincode should be a 6-digit number"
          />
          {errors.pincode && <span className="error">{errors.pincode}</span>}
        </div>
        <div className="form-group">
          <label>IFSC Code:</label>
          <input
            type="text"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            
            pattern="[A-Z]{4}[0-9]{6}"
            title="IFSC Code should be in the format XXXX000000"
          />
          {errors.ifscCode && <span className="error">{errors.ifscCode}</span>}
        </div>
        {submitted && !Object.keys(errors).length && (
          <p className="success-message">Branch successfully registered!</p>
        )}
        <button type="submit" className="submit-button">Register Branch</button>
      </form>
    </div>
  );
};

export default BranchForm;
