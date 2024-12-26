import React, { useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';

const PlantClassification = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  // Handle file selection and preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a local URL for image preview
      setUploadMessage('');
    }
  };

  // Handle file upload and API call
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadMessage('Uploading and classifying...');

      // API call to Flask backend
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUploadMessage(`Prediction: ${data.class} (Confidence: ${data.confidence}%)`);
    } catch (error) {
      setUploadMessage(`Error: ${error.message}`);
    }
  };

  return (
    <Box
      style={{
        padding: "20px",
        backgroundImage: `url('https://images.unsplash.com/photo-1723187137784-45f81b7253c3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWdyaWN1bHR1cmUlMjBmaWVsZHxlbnwwfHwwfHx8MA%3D%3D')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          padding: '100px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
          width: '600px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ marginBottom: '10px' }}>
          Plant Leaf Health Classification
        </Typography>

        {/* File input */}
        <TextField
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          inputProps={{ style: { display: 'none' } }}
          id="upload-file"
        />
        <label htmlFor="upload-file">
          <Button variant="contained" component="span" sx={{ marginBottom: '10px', marginRight: '10px' }}>
            Choose File
          </Button>
        </label>

        <Button
          variant="contained"
          color="primary"
          onClick={handleFileUpload}
          sx={{ marginBottom: '10px' }}
        >
          Upload and Classify
        </Button>

        {/* Display selected image preview */}
        {previewUrl && (
          <Box sx={{ marginTop: '10px' }}>
            <img
              src={previewUrl}
              alt="Selected File"
              style={{ maxWidth: '400px', maxHeight: '400px', borderRadius: '8px' }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: '10px' }}>
              {selectedFile.name}
            </Typography>
          </Box>
        )}

        {/* Upload message */}
        {uploadMessage && (
          <Typography variant="body1" color="textSecondary" sx={{ marginTop: '20px' }}>
            {uploadMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PlantClassification;
