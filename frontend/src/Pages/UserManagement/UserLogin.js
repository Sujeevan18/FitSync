import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import './user.css';
import GoogalLogo from './img/glogo.png';

function UserLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userID', data.id);
        alert('Login successful!');
        navigate('/allPost');
      } else if (response.status === 401) {
        alert('Invalid credentials!');
      } else {
        alert('Invalid credentials!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="user-login-container">
      <div className='user-login-card-con'>
        <div className="user-login-card">
          <h2 className="user-login-title">Login</h2>
          <form onSubmit={handleSubmit} className="user-login-form">
            <div className="user-form-group">
              <label className="user-form-label">Email Address</label>
              <div className="user-input-container">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="user-form-input"
                />
                <FaEnvelope className="user-input-icon" />
              </div>
            </div>
            <div className="user-form-group">
              <label className="user-form-label">Password</label>
              <div className="user-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="user-form-input"
                />
                {showPassword ? (
                  <FaEyeSlash className="user-input-icon" onClick={togglePasswordVisibility} />
                ) : (
                  <FaEye className="user-input-icon" onClick={togglePasswordVisibility} />
                )}
              </div>
            </div>
            <button type="submit" className="user-login-btn">Login</button>
            <p className="user-signup-text">
              Don't have an account? <span className="user-signup-link" onClick={() => navigate('/register')}>Sign up for free</span>
            </p>
          </form>
          <button
            className="user-google-btn"
            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
          >
            <img src={GoogalLogo} alt='Google logo' className='user-glogo' />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;