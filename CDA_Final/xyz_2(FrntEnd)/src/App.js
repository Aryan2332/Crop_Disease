import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [newFile, setNewFile] = useState(null); 
  const [predictedClass, setPredictedClass] = useState(null);  
  const [loading, setLoading] = useState(false);  
  const [showModal, setShowModal] = useState(false);  

  const handleNewUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setNewFile(uploadedFile); 
    setPredictedClass(null);  
  };

  const handleFileSubmit = async () => {
    if (!newFile) return;  

    const formData = new FormData();
    formData.append('file', newFile);

    setLoading(true);  
    setShowModal(true);  

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPredictedClass(response.data.predicted_class);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);  
    }
  };

  const closeModal = () => setShowModal(false);

  const clearImage = () => {
    setNewFile(null);  
    setPredictedClass(null);  
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Crop Disease Detection</h1>
        <p className="intro-text">
          Upload a picture of your crop or capture it using your mobile camera to detect any potential diseases.
        </p>

        {/* New Upload Button */}
        <div className="button-container">
          <input
            type="file"
            onChange={handleNewUpload}
            id="newUploadButton"
            className="hidden-input"
          />
          <label htmlFor="newUploadButton" className="upload-btn">
            New Crop Image Upload
          </label>
        </div>

        {/* Image Preview */}
        {newFile && (
          <div className="image-preview-container">
            <img
              src={URL.createObjectURL(newFile)}
              alt="Crop Preview"
              className="image-preview"
            />
          </div>
        )}

        {/* Submit Button to Send Image to Flask Backend */}
        <div className="button-container">
          <button onClick={handleFileSubmit} className="upload-btn">
            Submit for Prediction
          </button>
        </div>

        {/* Modal for prediction result */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              {loading ? (
                <p>Loading... Please wait.</p>
              ) : (
                <div>
                  <h3>Prediction: {predictedClass}</h3>
                  <button onClick={closeModal} className="upload-btn">
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clear Image Button at bottom-right */}
        <button className="clear-btn" onClick={clearImage}>
          Clear Image
        </button>
      </div>
    </div>
  );
}

export default App;
