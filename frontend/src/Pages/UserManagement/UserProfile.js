import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
          <h2>Your Profile Details</h2>
        </div>
        <div className='profile-details_con'>
          <div className='profile-details_con_section'>
            <div className="profile-info">
              <div className="profile-info-item">
                <span className="profile-info-label">Full Name : {userData.fullname}</span>
              </div>

              <div className="profile-info-item">
                <span className="profile-info-label">Email  : {userData.email}</span>
              </div>
              {userType !== 'google' && (
                <div className="profile-info-item">
                  <span className="profile-info-label"> Phone  : {userData.phone}</span>
                </div>
              )}
              {/* Remove skills display */}
            </div>
            <div className="profile-actions">
              {userType !== 'google' && (
                <button
                  className="profile-btn update"
                  onClick={() => navigate(`/updateUserProfile/${userId}`)}
                > Update
                </button>
              )}
              <button
                className="profile-btn delete"
                onClick={handleDeleteProfile}
              >
                Delete
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserProfile;