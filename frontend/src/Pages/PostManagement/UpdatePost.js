import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';

function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [existingMedia, setExistingMedia] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${id}`);
        const post = response.data;
        setTitle(post.title || '');
        setDescription(post.description || '');
        setExistingMedia(post.media || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDeleteMedia = async (mediaUrl) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this media file?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/posts/${id}/media`, {
        data: { mediaUrl },
      });
      window.location.reload(); // Refresh the page after successful deletion
    } catch (error) {
      console.error('Error deleting media file:', error);
      alert('Failed to delete media file.');
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          reject(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
        } else {
          resolve();
        }
      };

      video.onerror = () => {
        reject(`Failed to load video metadata for ${file.name}.`);
      };
    });
  };

  const handleNewMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024;
    const maxImageCount = 3;

    let imageCount = existingMedia.filter((url) => !url.endsWith('.mp4')).length;
    let videoCount = existingMedia.filter((url) => url.endsWith('.mp4')).length;

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        return;
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
        if (imageCount > maxImageCount) {
          alert('You can upload a maximum of 3 images.');
          return;
        }
      } else if (file.type === 'video/mp4') {
        videoCount++;
        if (videoCount > 1) {
          alert('You can upload only 1 video.');
          return;
        }

        try {
          await validateVideoDuration(file);
        } catch (error) {
          alert(error);
          return;
        }
      } else {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }
    }

    setNewMedia(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    newMedia.forEach((file) => formData.append('newMediaFiles', file));

    try {
      await axios.put(`http://localhost:8080/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('uplode suceess.');
      navigate('/allPost');

    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className='frombkup'>
        <div className="update-post-container">
          <h1 className="update-post-title">Update Post</h1>
          <form onSubmit={handleSubmit} className="update-post-form">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Media</label>
              <div className="media-preview-container">
                {existingMedia.map((mediaUrl, index) => (
                  <div key={index} className="media-preview-item">
                    {mediaUrl.endsWith('.mp4') ? (
                      <video controls className="media-preview">
                        <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={`http://localhost:8080${mediaUrl}`}
                        alt={`Media ${index}`}
                        className="media-preview"
                      />
                    )}
                    <button
                      type="button"
                      className="delete-media-btn"
                      onClick={() => handleDeleteMedia(mediaUrl)}
                      aria-label="Delete media"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="file-upload-wrapper">
                <label className="file-upload-label">
                  <span>Add New Media</span>
                  <input
                    type="file"
                    className="file-upload-input"
                    accept="image/jpeg,image/png,image/jpg,video/mp4"
                    multiple
                    onChange={handleNewMediaChange}
                  />
                </label>
                <p className="file-upload-hint">
                  Max 3 images or 1 video (50MB max, 30s for video)
                </p>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Update Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePost;
