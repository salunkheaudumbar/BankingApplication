import React, { useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; // Import the CSS file
import { AuthContext } from './AuthContext';

const NavigationBar = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <Navbar expand="lg" className="navbar">
      <Navbar.Brand className="navbar-brand">BrightFund Bank</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/" className="nav-link">About Us</Nav.Link>
          <Nav.Link as={Link} to="/" className="nav-link">Contact Us</Nav.Link>
        </Nav>
        <Nav className="ml-auto">
          {isAdminLoggedIn ? (
            
            <Nav.Link as="button" onClick={handleLogout} className="nav-link">Logout</Nav.Link>
          ) : (
            <>
              <Nav.Link as={Link} to="/admin-login" className="nav-link">Admin</Nav.Link>
              <Nav.Link as={Link} to="/user-login" className="nav-link">Login</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
