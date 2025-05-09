import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import './user.css';
import GoogalLogo from './img/glogo.png';

function UserRegister() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        phone: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (!formData.email) {
            alert("Email is required");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            alert("Email is invalid");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('User registered successfully!');
                setFormData({ fullname: '', email: '', password: '', phone: '' });
                window.location.href = '/'
            } else if (response.status === 409) {
                alert('Email already exists!');
            } else {
                alert('Failed to register user.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="user-login-container">
            <div className='user-login-card-con'>
         
                <div className="user-login-card">
                    <h2 className="user-login-title">Register</h2>
                    <form onSubmit={handleSubmit} className="user-login-form">
                        <div className="user-form-group">
                            <label className="user-form-label">Full Name</label>
                            <div className="user-input-container">
                                <FaUser className="user-input-icon" />
                                <input
                                    type="text"
                                    name="fullname"
                                    placeholder="Full Name"
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                    required
                                    className="user-form-input"
                                />
                            </div>
                        </div>
                        <div className="user-form-group">
                            <label className="user-form-label">Email Address</label>
                            <div className="user-input-container">
                                <FaEnvelope className="user-input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="user-form-input"
                                />
                            </div>
                        </div>
                        <div className="user-form-group">
                            <label className="user-form-label">Password</label>
                            <div className="user-input-container">
                                <FaLock className="user-input-icon" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="user-form-input"
                                />
                            </div>
                        </div>
                        <div className="user-form-group">
                            <label className="user-form-label">Phone</label>
                            <div className="user-input-container">
                                <FaPhone className="user-input-icon" />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const re = /^[0-9\b]{0,10}$/;
                                        if (re.test(e.target.value)) {
                                            handleInputChange(e);
                                        }
                                    }}
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                    title="Please enter exactly 10 digits."
                                    required
                                    className="user-form-input"
                                />
                            </div>
                        </div>
                        <button type="submit" className="user-login-btn">Register</button>
                        <div className="user-signup-text">
                            You have an account? <span className="user-signup-link" onClick={() => (window.location.href = '/')}>Sign in now</span>
                        </div>
                    </form>
                    <button
                        onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                        className="user-google-btn"
                    >
                        <img src={GoogalLogo} alt='Google logo' className='user-glogo' />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserRegister;