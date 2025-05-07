import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiUser } from 'react-icons/fi';
import { FaRegHeart, FaHeart, FaRegComment, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import '../../App.css';

function AllPost() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetcheing post :', error);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post ?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/posts/${postId}`);
      alert('Post deleted successfully!');
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };

  const handleUpdate = (postId) => {
    navigate(`/updatePost/${postId}`);
  };

  const toggleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleSave = (postId) => {
    setSavedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="posts-container">
      <button
        className="add-post-btn floating-btn"
        onClick={() => navigate('/addNewPost')}
      >
        <FiPlus className="plus-icon" />
      </button>

      {posts.length === 0 ? (
        <div className="no-posts">
          <h3>No posts found</h3>
          <p>Be the first to share something amazing!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            {/* Post Header with Avatar */}
            <div className="post-header">
              <div className="user-info">
                <div className="avatar">
                  <FiUser className="user-icon" />
                </div>
                <span className="username">User</span>
              </div>

              <div className="post-actions">
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleUpdate(post.id)}
                >
                  <FiEdit />
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(post.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            <div className='dix_con'>
              {post.title && (
                <div className="post-title-container">
                  <h3 className="post-title">{post.title}</h3>
                </div>
              )}
              {post.description && (
                <div className="post-description">
                  <p>{post.description}</p>
                </div>
              )}
            </div>
            {/* Media Gallery */}
            <div className="media-gallery">
              {post.media.slice(0, 4).map((mediaUrl, index) => (
                <div
                  key={index}
                  className={`media-item ${post.media.length > 4 && index === 3 ? 'has-overlay' : ''}`}
                >
                  {mediaUrl.endsWith('.mp4') ? (
                    <video controls>
                      <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={`http://localhost:8080${mediaUrl}`} alt="Post Media" />
                  )}
                  {post.media.length > 4 && index === 3 && (
                    <div className="overlay">+{post.media.length - 4}</div>
                  )}
                </div>
              ))}
            </div>

         
          </div>
        ))
      )}
    </div>
  );
}

export default AllPost;