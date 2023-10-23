import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [zoomedPhoto, setZoomedPhoto] = useState(null);

  // New state variables for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotoForModal,setSelectedPhotoForModal] = useState(null);

  // New state variable for URL input
  const [urlInput, setUrlInput] = useState('');

  // New state variable to track the selected method for adding photos
  const [addMethod, setAddMethod] = useState('file'); // Default to 'file'

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const addPhoto = async () => {
    if (addMethod === 'file' && selectedFile) {
      const formData = new FormData();
      formData.append('photo', selectedFile);
      try {
        await axios.post('http://localhost:5000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        fetchPhotos();
      } catch (error) {
        console.error('Error adding photo:', error);
      }
    } else if (addMethod === 'url' && urlInput) {
      try {
        await axios.post('http://localhost:5000/api/add-from-url', { url: urlInput });
        fetchPhotos();
        setUrlInput('');
      } catch (error) {
        console.error('Error adding photo from URL:', error);
      }
    }
  };

  const fetchPhotos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/photos');
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const openModal = (photo) => {
    setSelectedPhotoForModal(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhotoForModal(null);
  };

  const navigatePhotos = (step) => {
    const currentIndex = photos.findIndex((photo) => photo._id === selectedPhotoForModal._id);
    const newIndex = currentIndex + step;
    if (newIndex >= 0 && newIndex < photos.length) {
      setSelectedPhotoForModal(photos[newIndex]);
    }
  };

  const deletePhoto = async (photoId) => {
    try {
      // Send a DELETE request to the server to delete the photo
      await axios.delete(`http://localhost:5000/api/photos/${photoId}`);
      // After successfully deleting the photo, fetch the updated list of photos
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };
  
  return (
    <div className="App">
      <h1>Photo Upload App</h1>

      <div className="photo-form">
        {/* Radio buttons for selecting the add method */}
        <div className="add-method">
          <label>
            <input
              type="radio"
              value="file"
              checked={addMethod === 'file'}
              onChange={() => setAddMethod('file')}
            />
            Add from File
          </label>
          <label>
            <input
              type="radio"
              value="url"
              checked={addMethod === 'url'}
              onChange={() => setAddMethod('url')}
            />
            Add from URL
          </label>
        </div>

        {/* Input fields based on the selected add method */}
        {addMethod === 'file' && (
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            className="custom-file-input"
            onChange={handleFileChange}
          />
        )}
        {addMethod === 'url' && (
          <input
            type="text"
            placeholder="Enter URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="url-file-input"
          />
        )}

        <button className="upload-button" onClick={addPhoto}>
          Add Photo
        </button>
      </div>


      <div className="photo-grid">
        {photos.map((photo) => (
          <div key={photo._id} className={`photo-card ${photo === zoomedPhoto ? 'zoomed' : ''}`}>
            <img
              src={`http://localhost:5000/uploads/${photo.filename}`}
              alt={photo.filename}
              onClick={() => openModal(photo)}
            />
            <button className="delete-button" onClick={() => deletePhoto(photo._id)}>
              <i className="fa fa-trash"></i>
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedPhotoForModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div className="modal-photo-container">
              <button className="prev-button" onClick={() => navigatePhotos(-1)}>
                &#10094;
              </button>
              <img
                src={`http://localhost:5000/uploads/${selectedPhotoForModal.filename}`}
                alt={selectedPhotoForModal.filename}
              />
              <button className="next-button" onClick={() => navigatePhotos(1)}>
                &#10095;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
