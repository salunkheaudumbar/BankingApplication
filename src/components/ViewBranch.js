import React, { useState, useEffect } from 'react';
import EditModal from './EditModal';
import './ViewBranch.css';

const ViewBranch = () => {
  const [branches, setBranches] = useState([]);
  const [branchManagers, setBranchManagers] = useState([]);
  const [editModalData, setEditModalData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/listAllBranches')
      .then(response => response.json())
      .then(data => setBranches(data))
      .catch(error => console.error('Error fetching branches:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/listAllBranchManagers')
      .then(response => response.json())
      .then(data => setBranchManagers(data))
      .catch(error => console.error('Error fetching branch managers:', error));
  }, []);

  const handleDelete = (index, type) => {
    if (window.confirm('Are you sure you want to delete?')) {
      if (type === 'manager') {
        const managerId = branchManagers[index].id;
        fetch(`http://localhost:8080/api/deleteBranchManager/${managerId}`, {
          method: 'DELETE'
        })
          .then(response => {
            if (response.ok) {
              const updatedManagers = [...branchManagers];
              updatedManagers.splice(index, 1);
              setBranchManagers(updatedManagers);
            } else {
              return response.json().then(err => { throw new Error(err.message); });
            }
          })
          .catch(error => console.error('Error deleting branch manager:', error));
      } else if (type === 'branch') {
        const branchId = branches[index].id;
        fetch(`http://localhost:8080/api/deleteBranch/${branchId}`, {
          method: 'DELETE'
        })
          .then(response => {
            if (response.ok) {
              const updatedBranches = [...branches];
              updatedBranches.splice(index, 1);
              setBranches(updatedBranches);
            } else {
              return response.json().then(err => { throw new Error(err.message); });
            }
          })
          .catch(error => console.error('Error deleting branch:', error));
      }
    }
  };

  const handleEdit = (data, type, index) => {
    setEditModalData({ ...data, type, index });
    setShowEditModal(true);
  };

  const handleSaveEdit = (data) => {
    if (data.type === 'manager') {
      fetch(`http://localhost:8080/api/updateBranchManager/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(updatedManager => {
          const updatedManagers = [...branchManagers];
          updatedManagers[data.index] = updatedManager;
          setBranchManagers(updatedManagers);
          setShowEditModal(false);
        })
        .catch(error => console.error('Error updating branch manager:', error));
    } else if (data.type === 'branch') {
      fetch(`http://localhost:8080/api/updateBranch/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(updatedBranch => {
          const updatedBranches = [...branches];
          updatedBranches[data.index] = updatedBranch;
          setBranches(updatedBranches);
          setShowEditModal(false);
        })
        .catch(error => console.error('Error updating branch:', error));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditModalData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="view-branch-container">
      <h2>Branch Managers and Allotted Branches</h2>
      <h5>Registered Bank Managers</h5>
      {branchManagers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Branch</th>
              <th>Present Address</th>
              <th>Permanent Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {branchManagers.map((manager, index) => (
              <tr key={index}>
                <td>{manager.name}</td>
                <td>{manager.dob}</td>
                <td>{manager.gender}</td>
                <td>{manager.phone}</td>
                <td>{manager.email}</td>
                <td>{manager.branch}</td>
                <td>{manager.presentAddress}</td>
                <td>{manager.permanentAddress}</td>
                <td>
                  <button onClick={() => handleEdit(manager, 'manager', index)}>Edit</button>
                  <button onClick={() => handleDelete(index, 'manager')}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No branch managers registered yet.</p>
      )}
      <h5>Registered Bank Branches</h5>
      {branches.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Branch Name</th>
              <th>IFSC Code</th>
              <th>State</th>
              <th>City</th>
              <th>Pin Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch, index) => (
              <tr key={index}>
                <td>{branch.branchName}</td>
                <td>{branch.ifscCode}</td>
                <td>{branch.state}</td>
                <td>{branch.city}</td>
                <td>{branch.pincode}</td>
                <td>
                  <button onClick={() => handleEdit(branch, 'branch', index)}>Edit</button>
                  <button onClick={() => handleDelete(index, 'branch')}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No branches registered yet.</p>
      )}

      <EditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        data={editModalData}
        onSave={handleSaveEdit}
        onChange={handleChange}
      />
    </div>
  );
};

export default ViewBranch;
