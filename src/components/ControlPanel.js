import React, { useEffect, useState } from 'react'; 
import { Grid, Card, CardContent, Typography, Switch, Button } from '@mui/material';
import { realDB } from '../config/firebase';  // Import Firebase config
import { onValue, ref, set } from 'firebase/database';
import { toast } from 'react-toastify';

const ControlPanel = () => {
  const [status, setStatus] = useState({
    fan: false,
    led: false,
    pump: false
  });

  // Get initial status from Firebase (Realtime Database)
  useEffect(() => {
    // Realtime DB: Fetch initial values for fan, light, and pump
    const fanRef = ref(realDB, 'greenhouse/actuators/fan');
    const lightRef = ref(realDB, 'greenhouse/actuators/led');
    const pumpRef = ref(realDB, 'greenhouse/actuators/pump');

    // Listen to value changes for fan, light, and pump
    onValue(fanRef, (snapshot) => {
      const fanStatus = snapshot.val();
      setStatus(prevStatus => ({ ...prevStatus, fan: fanStatus }));
    });

    onValue(lightRef, (snapshot) => {
      const lightStatus = snapshot.val();
      setStatus(prevStatus => ({ ...prevStatus, led: lightStatus }));
    });

    onValue(pumpRef, (snapshot) => {
      const pumpStatus = snapshot.val();
      setStatus(prevStatus => ({ ...prevStatus, pump: pumpStatus }));
    });
  }, []);

  // Handle toggles and update the Firebase database
  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setStatus(prevStatus => ({ ...prevStatus, [name]: checked }));

    // Update Firebase Realtime Database with the new value
    const statusRef = ref(realDB, `greenhouse/actuators/${name}`);
    set(statusRef, checked)
      .then(() => {
        toast.success(`${name.charAt(0).toUpperCase() + name.slice(1)} updated!`);
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Failed to update ${name}`);
      });
  };

  const handleIrrigation = () => {
    // Trigger irrigation logic here
    toast.success("Irrigation triggered!");
    // You can also update the irrigation status in Firebase if needed
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
    <Grid container spacing={3}>
      {/* Fan Control */}
      <Grid item xs={12} sm={6} md={4}>
        <Card
          sx={{
            backgroundColor: "#ffffff",
            boxShadow: 3,
            borderRadius: "10px",
            "&:hover": { boxShadow: 6 },
            padding: "20px",
            transition: "all 0.3s ease",
          }}
        >
          <CardContent>
            <Typography variant="h6" style={{ color: "#1976d2" }}>
              Exhaust Fan
            </Typography>
            <Switch
              checked={status.fan}
              name="fan"
              onChange={handleToggle}
              color="primary"
            />
            <Typography style={{ marginTop: "10px", color: "#555" }}>
              Status: {status.fan ? "ON" : "OFF"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

        {/* Lights Control */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#ffffff', boxShadow: 3, borderRadius: '10px', '&:hover': { boxShadow: 6 }, padding: '20px', transition: 'all 0.3s ease' }}>
            <CardContent>
              <Typography variant="h6" style={{ color: '#ff9800' }}>Grow Lights</Typography>
              <Switch
                checked={status.led}
                name='led'
                onChange={handleToggle}
                color="primary"
              />
              <Typography style={{ marginTop: '10px', color: '#555' }}>
                Status: {status.led ? "ON" : "OFF"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Water Pump Control */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#ffffff', boxShadow: 3, borderRadius: '10px', '&:hover': { boxShadow: 6 }, padding: '20px', transition: 'all 0.3s ease' }}>
            <CardContent>
              <Typography variant="h6" style={{ color: '#4caf50' }}>Water Pump</Typography>
              <Switch
                checked={status.pump}
                name='pump'
                onChange={handleToggle}
                color="primary"
              />
              <Typography style={{ marginTop: '10px', color: '#555' }}>
                Status: {status.pump ? "ON" : "OFF"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ControlPanel;
