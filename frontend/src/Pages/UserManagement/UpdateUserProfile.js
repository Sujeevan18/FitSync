import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone} from 'react-icons/fa';
import './UpdateFrom.css';
import NavBar from '../../Components/NavBar/NavBar'
function UpdateUserProfile() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/user/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to load user data');
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      const response = await fetch(`http://localhost:8080/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        navigate('/userProfile');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating profile.');
    }
  };

  return (
    <div>
      <NavBar />
      <div className="user-update-container">
        <div className="user-update-card">
          <h2 className="user-update-title">Update Profile</h2>
          <form onSubmit={handleSubmit} className="user-update-form">
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
            <div className="user-form-group-full">
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
            </div>
            <div className="user-form-group">
              <label className="user-form-label">Phone Number</label>
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

            <div className="user-button-group">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="user-cancel-btn"
              >
                Cancel
              </button>
              <button type="submit" className="user-update-btn">
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUserProfile;