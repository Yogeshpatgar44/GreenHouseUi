import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { realDB } from "../config/firebase";
import { ref, onValue } from "firebase/database";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from '@mui/material';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registering necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState({});
  const [historicalData, setHistoricalData] = useState([]);

  const [graphData, setGraphData] = useState({
    temperature: { labels: [], data: [] },
    humidity: { labels: [], data: [] },
    soil_moisture: { labels: [], data: [] },
    gasLevel: { labels: [], data: [] },
  });

  // Function to create graph data
  const createGraph = (data, label) => {
    return {
      labels: data.labels,
      datasets: [
        {
          label: label,
          data: data.data,
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1,
        },
      ],
    };
  };

  useEffect(() => {
    const dataRef = ref(realDB, "greenhouse/sensors");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const newData = snapshot.val();
      if (newData) {
        setData(newData);

        setHistoricalData((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            temperature: newData.temperature,
            humidity: newData.humidity,
            soilMoisture: Math.round(((7095 - newData.soil_moisture) / 7095) * 100),
            gasLevel: newData.gas_level,
          },
        ]);
 
        // Update graph data dynamically
        setGraphData((prevGraphData) => ({
          ...prevGraphData,
          temperature: {
            labels: [...prevGraphData.temperature.labels, new Date().toLocaleTimeString()],
            data: [...prevGraphData.temperature.data, newData.temperature],
          },
        }));

        setGraphData((prevGraphData) => ({
          ...prevGraphData,
          humidity: {
            labels: [...prevGraphData.humidity.labels, new Date().toLocaleTimeString()],
            data: [...prevGraphData.humidity.data, newData.humidity],
          },
        }));

        setGraphData((prevGraphData) => ({
          ...prevGraphData,
          gasLevel: {
            labels: [...prevGraphData.gasLevel.labels, new Date().toLocaleTimeString()],
            data: [...prevGraphData.gasLevel.data, newData.gas_level],
          },
        }));

        setGraphData((prevGraphData) => ({
          ...prevGraphData,
          soil_moisture: {
            labels: [...prevGraphData.soil_moisture.labels, new Date().toLocaleTimeString()],
            data: [...prevGraphData.soil_moisture.data, newData.soil_moisture],
          },
        }));
      }
    });

    return () => unsubscribe();
  }, []);



  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("GreenHouse Automated System Sensor Data", 14, 20);

    // Add a table of historical data
    doc.autoTable({
      head: [["Time", "Temperature (°C)", "Humidity (%)", "Soil Moisture (%)", "Gas Level (ppm)"]],
      body: historicalData.map((item) => [
        item.time,
        item.temperature,
        item.humidity,
        item.soilMoisture,
        item.gasLevel,
      ]),
      startY: 30,
    });

    doc.save("GreenHouse_Sensor_Data.pdf");
  };



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
    Download Data as PDF
  </Button>
</div>


      <Grid container spacing={3}>
        {/* Temperature Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: '#f20505',
            color: '#fff',
            '&:hover': { boxShadow: 10, transform: 'scale(1.05)' },
            transition: 'all 0.3s ease',
            borderRadius: '10px',
            padding: '20px',
          }}>
            <CardContent>
              <Typography variant="h6">Temperature</Typography>
              <Typography variant="h4">{data.temperature} <sup>°C</sup></Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Humidity Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: '#388e3c',
            color: '#fff',
            '&:hover': { boxShadow: 10, transform: 'scale(1.05)' },
            transition: 'all 0.3s ease',
            borderRadius: '10px',
            padding: '20px',
          }}>
            <CardContent>
              <Typography variant="h6">Humidity</Typography>
              <Typography variant="h4">{data.humidity}<sup> %</sup></Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Soil Moisture Card */}
        {/* <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: '#795548',
            color: '#fff',
            '&:hover': { boxShadow: 10, transform: 'scale(1.05)' },
            transition: 'all 0.3s ease',
            borderRadius: '10px',
            padding: '20px',
          }}>
            <CardContent>
              <Typography variant="h6">Soil Moisture</Typography>
              <Typography variant="h4">{data.soil_moisture}<sup> %</sup></Typography>
            </CardContent>
          </Card>
        </Grid> */}

          {/* Soil Moisture Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: '#795548',
            color: '#fff',
            '&:hover': { boxShadow: 10, transform: 'scale(1.05)' },
            transition: 'all 0.3s ease',
            borderRadius: '10px',
            padding: '20px',
          }}>
            <CardContent>
              <Typography variant="h6">Soil Moisture</Typography>
              <Typography variant="h4">
                {
                  Math.round(((7095 - data.soil_moisture) / 7095) * 100) // Adjusted for 12-bit ADC
                }
                <sup>%</sup>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Gas Level Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: '#fbc02d',
            color: '#fff',
            '&:hover': { boxShadow: 10, transform: 'scale(1.05)' },
            transition: 'all 0.3s ease',
            borderRadius: '10px',
            padding: '20px',
          }}>
            <CardContent>
              <Typography variant="h6">Gas Level</Typography>
              <Typography variant="h4">{data.gas_level}<sup> ppm</sup></Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Temperature Graph */}
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{
            backgroundColor: '#ffffff',
            boxShadow: 3,
            borderRadius: '10px',
            padding: '20px',
          }}>
            <CardContent>
              <Typography variant="h6">Temperature Graph</Typography>
              <Line data={createGraph(graphData.temperature, "Temperature (°C)")} />
            </CardContent>
          </Card>
        </Grid>

        {/* Humidity Graph */}
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{
            backgroundColor: '#ffffff',
            boxShadow: 3,
            borderRadius: '10px',
            padding: '20px',
          }}>
            <CardContent>
              <Typography variant="h6">Humidity Graph</Typography>
              <Line data={createGraph(graphData.humidity, "Humidity (%)")} />
            </CardContent>
          </Card>
        </Grid>

        {/* Soil Moisture Graph */}
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{
            backgroundColor: '#ffffff',
            boxShadow: 3,
            borderRadius: '10px',
            padding: '20px',
          }}>
            <CardContent>
              <Typography variant="h6">Soil Moisture Graph</Typography>
              <Line data={createGraph(graphData.soil_moisture, "Soil Moisture (%)")} />
            </CardContent>
          </Card>
        </Grid>

        {/* Gas Level Graph */}
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{
            backgroundColor: '#ffffff',
            boxShadow: 3,
            borderRadius: '10px',
            padding: '20px',
          }}>
            <CardContent>
              <Typography variant="h6">Gas Level Graph</Typography>
              <Line data={createGraph(graphData.gasLevel, "Gas Level (ppm)")} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
