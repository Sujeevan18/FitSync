import React, { useState } from 'react';
import axios from 'axios';
import './post.css';

function AddNewPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024; // 50MB

    let imageCount = 0;
    let videoCount = 0;
    const previews = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        window.location.reload();
        return;
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
      } else if (file.type === 'video/mp4') {
        videoCount++;

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);

          }
        };
      } else {
        alert(`Unsupported file type: ${file.type}`);

        return;
      }

      previews.push({ type: file.type, url: URL.createObjectURL(file) });
    }

    if (imageCount > 3) {
      alert('You can upload a maximum of 3 images.');

      return;
    }

    if (videoCount > 1) {
      alert('You can upload only 1 video.');

      return;
    }

    setMedia(files);
    setMediaPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    media.forEach((file, index) => formData.append(`mediaFiles`, file));

    try {
      await axios.post('http://localhost:8080/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post created successfully!');
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      alert('Failed to create post.');
    }
  };

  return (
    <div className="add-post-container">
      <h1 className="add-post-title">Create New Post</h1>
      <form onSubmit={handleSubmit} className="add-post-form">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            placeholder="Enter post description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            required
            rows={4}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Media Upload</label>
          <div className="media-preview-container">
            {mediaPreviews.map((preview, index) => (
              <div key={index} className="media-preview-item">
                {preview.type.startsWith('video/') ? (
                  <video controls className="media-preview">
                    <source src={preview.url} type={preview.type} />
                  </video>
                ) : (
                  <img src={preview.url} alt={`Preview ${index}`} className="media-preview" />
                )}
              </div>
            ))}
          </div>
          <div className="file-upload-wrapper">
            <label className="file-upload-label">
              <span>Choose Files</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,video/mp4"
                multiple
                onChange={handleMediaChange}
                className="file-upload-input"
              />
            </label>
            <p className="file-upload-hint">Max 3 images or 1 video (50MB max, 30s for video)</p>
          </div>
        </div>
        <button type="submit" className="submit-button">Create Post</button>
      </form>
    </div>
  );
}

export default AddNewPost;