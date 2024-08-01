import React from 'react';
import './EditModal.css';

const EditModal = ({ show, onClose, data, onSave, onChange }) => {
  if (!show) return null;

  const handleSave = () => {
    onSave(data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit {data.type === 'manager' ? 'Manager' : 'Branch'}</h2>
        <form>
          {data.type === 'manager' && (
            <>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dob"
                  value={data.dob}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>Gender:</label>
                <select
                  name="gender"
                  value={data.gender}
                  onChange={onChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>Branch:</label>
                <input
                  type="text"
                  name="branch"
                  value={data.branch}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>Present Address:</label>
                <input
                  type="text"
                  name="presentAddress"
                  value={data.presentAddress}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>Permanent Address:</label>
                <input
                  type="text"
                  name="permanentAddress"
                  value={data.permanentAddress}
                  onChange={onChange}
                />
              </div>
            </>
          )}
          {data.type === 'branch' && (
            <>
              <div className="form-group">
                <label>Branch Name:</label>
                <input
                  type="text"
                  name="branchName"
                  value={data.branchName}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>IFSC Code:</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={data.ifscCode}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>State:</label>
                <input
                  type="text"
                  name="state"
                  value={data.state}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={data.city}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>Pin Code:</label>
                <input
                  type="text"
                  name="pincode"
                  value={data.pincode}
                  onChange={onChange}
                />
              </div>
            </>
          )}
          <button type="button" onClick={handleSave}>
            Save
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
