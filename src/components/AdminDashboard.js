import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { AuthContext } from './AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { login, logout } = useContext(AuthContext);

  // const handleLogout = () => {
  //   logout();
  //   navigate('/admin-login');
  // };

  useEffect(() => {
    login();
  }, [login]);

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>Hello Admin</h2>
        
      </div>
      <div className="button-container">
        <button className="dashboard-button" onClick={() => navigate('/branch-form')}>Register Bank Branch</button>
        <button className="dashboard-button" onClick={() => navigate('/register-branch-manager')}>Register Branch Manager</button>
        <button className="dashboard-button" onClick={() => navigate('/branch')}>View Bank & Branch Manager</button>
        <button className="dashboard-button" onClick={() => navigate('/customers')}>View Customers</button>       
        <button className="dashboard-button" onClick={() => navigate('/transactions')}>View Transactions</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
