import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Grid, Card, CardContent, Typography,Button  } from "@mui/material";
import { Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Registering necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AutoImageUpload = () => {
  const [graphData, setGraphData] = useState({
    predictions: { labels: [], data: [] },
  });

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const createGraph = (data, label) => ({
    labels: data.labels,
    datasets: [
      {
        label: label,
        data: data.data, // Ensure this array contains dynamic numeric values
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderWidth: 2,
        tension: 0.4, // For smooth curves
        pointStyle: "circle",
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  });
  
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Plant Health Predictions", 20, 10);
    doc.autoTable({
      head: [["#", "Prediction", "Confidence (%)"]],
      body: predictions.map((pred, index) => [
        index + 1,
        pred.pred,
        `${pred.conf}%`,
      ]),
    });
    doc.save("plant_health_predictions.pdf");
  };

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/image");
        const newPrediction = response.data;
        console.log(newPrediction);

        setGraphData((prevGraphData) => ({
          predictions: {
            labels: [
              ...prevGraphData.predictions.labels,
              new Date().toLocaleTimeString(),
            ],
            data: [
              ...prevGraphData.predictions.data,
              parseFloat(newPrediction.conf),
            ], // Ensure numeric values
          },
        }));

        setPredictions((prevPredictions) => {
          const updatedPredictions = [newPrediction, ...prevPredictions];
          return updatedPredictions.slice(0, 10);
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
    const intervalId = setInterval(fetchPrediction, 10000);

    return () => clearInterval(intervalId);
  }, []);

  if (error) return <h1>Error: {error}</h1>;

  return (
    <div
      style={{
        padding: "20px",
        backgroundImage: `url('https://images.unsplash.com/photo-1723187137784-45f81b7253c3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWdyaWN1bHR1cmUlMjBmaWVsZHxlbnwwfHwwfHx8MA%3D%3D')`, // Replace with your image URL
        backgroundSize: "cover", // Ensures the image covers the full screen
        backgroundPosition: "center", // Keeps the image centered
        backgroundAttachment: "fixed", // Keeps the image fixed during scrolling
        minHeight: "100vh", // Ensures the background covers the full content height
      }}
    >
      
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}>
  <Button
    variant="contained"
    color="primary"
    onClick={downloadPDF}
  >
    Download Prediction Report as PDF
  </Button>
</div>

    <div style={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Plant Health Prediction
      </Typography>
      {loading && <p>Loading...</p>}
      {predictions.length > 0 && (
        <div>
          <Grid container spacing={2} alignItems="center">
  {/* Image Section */}
  <Grid item xs={12} sm={6}>
    <Card
      sx={{
        backgroundImage: `url(${predictions[0].image})`, // Use the image as the card background
        backgroundSize: "cover", // Ensure the image covers the card completely
        backgroundPosition: "center", // Center the image
        borderRadius: "10px",
        height: "500px", // Fixed height
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Optional: Add shadow for better appearance
      }}
    >
      {/* Optionally, you can overlay content here */}
      <Typography
        variant="h6"
        style={{
          color: "white",
          textShadow: "1px 1px 4px rgba(0, 0, 0, 0.8)", // Add text visibility over the background
        }}
      >
        {/* Plant Health Image */}
      </Typography>
    </Card>
  </Grid>

  {/* Graph Section */}
  <Grid item xs={12} sm={6} >
    <Card
      sx={{
        padding: "20px",
        borderRadius: "10px",
        height: "300px", // Match height with the image card
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Optional: Add shadow
      }}
    >
      <CardContent style={{ width: "100%" }}>
        <Typography variant="h6" align="center">
          Prediction Graph
        </Typography>
        <div style={{ height: "100%" }}>
          <Line
            data={createGraph(graphData.predictions, "Confidence (%)")}
            options={{
              maintainAspectRatio: false,
              responsive: true,
            }}
          />
        </div>
      </CardContent>
    </Card>
  </Grid>
</Grid>


          {/* Table Below */}
          <table
            style={{
              margin: "20px auto",
              borderCollapse: "collapse",
              width: "80%",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>#</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Prediction
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((pred, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index === 0 ? "lightblue" : "lightgray",
                  }}
                >
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {index + 1}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {pred.pred}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {pred.conf}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
};

export default AutoImageUpload;
