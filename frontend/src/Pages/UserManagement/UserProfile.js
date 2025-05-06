import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaClipboard, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaTrash } from 'react-icons/fa';
import './profile.css';
import NavBar from '../../Components/NavBar/NavBar';

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem('userID');
  const userType = localStorage.getItem('userType');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        if (!userId) {
          console.error('No userID found in localStorage');
          navigate('/login');
          return;
        }
        console.log('Fetching user data for userID:', userId);
        const response = await axios.get(`http://localhost:8080/user/${userId}`);
        setUserData(response.data);
        console.log('User data fetched successfully:', response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleDeleteProfile = () => {
    if (window.confirm('Are you sure you want to permanently delete your profile? This action cannot be undone.')) {
      axios.delete(`http://localhost:8080/user/${userId}`)
        .then(() => {
          alert('Profile deleted successfully!');
          localStorage.removeItem('userID');
          navigate('/');
        })
        .catch(error => {
          console.error('Error deleting profile:', error);
          alert('Failed to delete profile. Please try again.');
        });
    }
  };

  if (isLoading) {
    return (
      <div className="user-profile-container">
        <div className="loading-state">Loading user data...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="user-profile-container">
        <div className="loading-state">Failed to load user data. Please try again.</div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="user-profile-container">
        <div className="user-profile-header">
          <h2>Your Profile</h2>
          <p>Manage your Plusecore account information</p>
        </div>

        <div className="profile-info">
          <div className="profile-info-item">
            <span className="profile-info-label"><FaUser /> Full Name</span>
            <span className="profile-info-value">{userData.fullname}</span>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label"><FaEnvelope /> Email</span>
            <span className="profile-info-value">{userData.email}</span>
          </div>

          {userType !== 'google' && (
            <div className="profile-info-item">
              <span className="profile-info-label"><FaPhone /> Phone</span>
              <span className="profile-info-value">
                {userData.phone || 'Not provided'}
              </span>
            </div>
          )}
        </div>

        <div className="profile-actions">
          {userType !== 'google' && (
            <button
              className="profile-btn update"
              onClick={() => navigate(`/updateUserProfile/${userId}`)}
            >
              <FaEdit /> Update Profile
            </button>
          )}
          <button
            className="profile-btn delete"
            onClick={handleDeleteProfile}
          >
            <FaTrash /> Delete Profile
          </button>
        </div>
      </div>
      <div className="profile-cards-container">
        <div
          className="profile-card"
          onClick={() => navigate('/myPosts')}
        >
          <div className="profile-card-header">
            <FaClipboard className="profile-card-icon" />
            <h3 className="profile-card-title">My Posts</h3>
          </div>
          <p className="profile-card-content">
            View and manage all the posts you've created on Plusecore.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;