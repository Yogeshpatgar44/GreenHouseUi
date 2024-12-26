import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AutoImageUpload = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendImage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/saved-photo', null, {
        headers: {
          'Content-Type': 'image/jpeg',  // Make sure the request matches your Flask server expectations
        },
        responseType: 'json', // Ensure the response type is JSON
      });

      setPrediction(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error uploading the image');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Start sending images every 10 seconds (10000ms)
    const intervalId = setInterval(() => {
      sendImage();
    }, 10000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>Plant Health Prediction</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {prediction && (
        <div>
          <h3>Prediction: {prediction.prediction}</h3>
          <p>Confidence: {prediction.confidence}</p>
        </div>
      )}
    </div>
  );
};

export default AutoImageUpload;
