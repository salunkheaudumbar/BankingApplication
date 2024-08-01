import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import UserLogin from './components/UserLogin';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminRegister from './components/AdminRegister';
import AdminDashboard from './components/AdminDashboard';
import RegisterBranchManager from './components/RegisterBranchManager';
import ViewBranch from './components/ViewBranch';
import BranchForm from './components/BranchForm';
import { AuthProvider } from './components/AuthContext';
import ForgotPassword from './components/ForgotPassword';
import UserRegister from './components/UserRegister';
import EditModal from './components/EditModal';

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <NavigationBar />
        <Routes>
          <Route path="/" exact element={<HomePage/>} />
          <Route path="/admin-register" element={<AdminRegister/>} />
          <Route path="/edit-modal" element={<EditModal/>} />
          <Route path="/admin-login" element={<AdminLogin/>} />
          <Route path="/user-login" element={<UserLogin/>} />
          <Route path="/user-register" element={<UserRegister/>} />
          <Route path='/admin-dashboard' element={<AdminDashboard/>}></Route>
          <Route path='/register-branch-manager' element={<RegisterBranchManager/>}></Route>
          <Route path='/branch' element={<ViewBranch/>}></Route>
          <Route path='/branch-form' element={<BranchForm/>}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
